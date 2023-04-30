import { Router } from "express";
import { body } from "express-validator";
import { userController } from "../controller";

const router: Router = Router();

//* 로그인 - POST api/user/signin
router.post(
  "/signin",
  [
    body("user_name").notEmpty(),
    body("user_password").notEmpty(),
  ],
  userController.signInUser
);

//* 회원가입 - POST api/user/signup
router.post(
  "/signup",
  [
    body("user_name").notEmpty(), 
    body("user_password").notEmpty()
  ],
  userController.createUser
);

//* 아이디 중복 확인 - POST api/user/duplicated
router.post(
  "/duplicated",
  [
    body("user_name").notEmpty(), 
  ],
  userController.checkDuplicatedUsername
);

export default router;
