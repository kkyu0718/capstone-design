import { PrismaClient, user_account } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";

const prisma = new PrismaClient();

//* 회원가입
const createUser = async (user_name: string, user_password: string) => {

  //? 넘겨받은 password를 bcrypt의 도움을 받아 암호화
  const salt = await bcrypt.genSalt(10); //^ 매우 작은 임의의 랜덤 텍스트 salt
  const bcrypted_password = await bcrypt.hash(user_password, salt); //^ 위에서 랜덤을 생성한 salt를 이용해 암호화

  const data = await prisma.user_account.create({
    data: {
      user_name: user_name,
      user_password: bcrypted_password,
    }
  })

  return data;
};

//* 로그인
const signIn = async (user_name: string, user_password: string) => {
  try {
    const user = await prisma.user_account.findFirst({
      where: {
        user_name: user_name,
      },
    });
    if (!user) return null;

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) return sc.UNAUTHORIZED;

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//* 아이디 중복 확인
const checkDuplicatedUsername = async (user_name: string) => {
  const data = await prisma.user_account.findFirst({
    where: {
      user_name: user_name,
    }
  })

  if(data) return true;
  return false;
} 

const getDiary = async (userId: number) => {
  const data = await prisma.diary.findMany({
    where: {
      user_id: userId
    }
  })

  return data;
}

const getDiaryByDate =async (userId: number, year: number, month: number) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month, 31);

  const data = await prisma.diary.findMany({
    where: {
      user_id: userId,
      created_at: {
        gte: start,
        lte: end,
      }
    }
  })

  return data;
}

const userService = {
  createUser,
  signIn,
  checkDuplicatedUsername,
  getDiary,
  getDiaryByDate,
};

export default userService;
