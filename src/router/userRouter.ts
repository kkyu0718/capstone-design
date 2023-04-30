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

//* 회원가입 - POST api/user
router.post(
  "/signup",
  [
    body("user_name").notEmpty(), 
    body("user_password").notEmpty()
  ],
  userController.createUser
);

export default router;
