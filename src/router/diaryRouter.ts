import { Router } from "express";
import { auth } from "../middlewares";
import diaryController from "../controller/diaryController";
import upload from "../middlewares/upload";

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

router.post(
    "/uploadImage",
    upload.single("file"),
    diaryController.uploadImage
)

export default router;
