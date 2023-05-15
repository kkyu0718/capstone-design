import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { userService } from "../service";
import { user_account } from "@prisma/client";

//* 회원 가입
const createUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { user_name, user_password } = req.body;

  const isDuplicated = await userService.checkDuplicatedUsername(user_name);

  if(isDuplicated) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DUPLICATED_USERNAME));
  }

  const data = await userService.createUser(user_name, user_password);

  if (!data) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
  }

  return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS));
};

//* 로그인
const signInUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { user_name, user_password } = req.body;

  try {
    const user = await userService.signIn(user_name, user_password) as user_account;

    const userId = user.user_id;
    const userName = user.user_name;

    if (!userId) return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.SIGNIN_FAIL));
    else if (userId === sc.UNAUTHORIZED)
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));

    const accessToken = jwtHandler.sign(userId);

    const result = {
      accessToken : accessToken,
      userName : userName
    };

    return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
  } catch (e) {
    console.log(error);
    //? 서버 내부에서 오류 발생
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//* 아이디 중복
const checkDuplicatedUsername =  async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { user_name } = req.body;

  const isDuplicated = await userService.checkDuplicatedUsername(user_name);

  const result = {
    isDuplicated: isDuplicated
  }

  return res.status(sc.OK).send(success(sc.OK, rm.CHECK_DUPLICATED, result));
}

const getDiary = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { userId } = req.body;
  const month = req.query?.month;
  const year = req.query?.year;

  // month, year 모두 안들어오면 조건 없이 검색
  // 그렇지 않다면 date로 검색
  const diary = (month == undefined) && (year == undefined) ? await userService.getDiary(+userId) : await userService.getDiaryByDate(+userId, +year!, +month!);

  return res.status(sc.OK).send(success(sc.OK, rm.DIARY_FOUND, diary));
}

const userController = {
  createUser,
  signInUser,
  checkDuplicatedUsername,
  getDiary,
};

export default userController;
