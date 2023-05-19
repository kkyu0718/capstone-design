import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import diaryService from "../service/diaryService";
import util from "util";

const createDiary = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { userId, diary_img, diary_content } = req.body;

    const local_img_url = await diaryService.saveImageInLocal(diary_img);
    // const local_img_url = "test.png"

    if(local_img_url == undefined) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DIARY_IMG_NOT_FOUND));
    }

    const s3_img_url = await diaryService.uploadImageInRemote(local_img_url);

    if(s3_img_url == undefined) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DIARY_IMG_UPLOAD_FAIL));
    }

    const data = await diaryService.createDiary(+userId, s3_img_url, diary_content);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DIARY_CREATE_FAIL));
    }

    return res.status(sc.CREATED).send(success(sc.CREATED, rm.DIARY_CREATED));
}

const getDiaryInfo = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { diary_id } = req.params;

    const data = await diaryService.getDiaryInfo(+diary_id);
    
    if(!data) {
        return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.DIARY_NOT_FOUND));
    }

    return res.status(sc.OK).send(success(sc.OK, rm.DIARY_FOUND, data))
}

const uploadImage =async (req: Request, res: Response, next: NextFunction) => {
    console.dir("req.file"+util.inspect(req.file, {depth: null}));
    return res.status(sc.OK).send(success(sc.OK, "test", req.file?.location));
}

const diaryController = {
    createDiary,
    getDiaryInfo,
    uploadImage,
}

export default diaryController;