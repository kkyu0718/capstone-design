import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import jwtHandler from "../modules/jwtHandler";
import { userService } from "../service";

//* 회원 가입
const createUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  if(!userService.checkDuplicatedUsername) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DUPLICATED_USERNAME));
  }

  const { user_name, user_password } = req.body;
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
    const userId = await userService.signIn(user_name, user_password);

    if (!userId) return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
    else if (userId === sc.UNAUTHORIZED)
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_PASSWORD));

    const accessToken = jwtHandler.sign(userId);

    const result = {
      accessToken,
    };

    res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, result));
  } catch (e) {
    console.log(error);
    //? 서버 내부에서 오류 발생
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const checkDuplicatedUsername =  async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const { user_name } = req.body;

  const data = userService.checkDuplicatedUsername(user_name);

  const result = {
    isDuplicated: data
  }

  return res.status(sc.OK).send(success(sc.OK, rm.CHECK_DUPLICATED, result));
}


const userController = {
  createUser,
  signInUser,
  checkDuplicatedUsername,
};

export default userController;
