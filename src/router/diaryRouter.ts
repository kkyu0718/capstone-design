import { Router } from "express";
import { body } from "express-validator";
import { auth } from "../middlewares";
import diaryController from "../controller/diaryController";

const router: Router = Router();

//* 다이어리 등록 - POST api/diary/create
router.post(
    "/create",
    auth,
    diaryController.createDiary
)

//* 다이어리 상세 조회 - GET api/diary/{diary_id}
router.get(
    "/:diary_id",
    auth,
    diaryController.getDiaryInfo
)

export default router;
