import { Router } from "express";
import userRouter from "./userRouter";
import diaryRouter from "./diaryRouter";

const router: Router = Router();

router.use("/user", userRouter);
router.use("/diary", diaryRouter);

export default router;
