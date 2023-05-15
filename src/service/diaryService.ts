import { PrismaClient, diary } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sc } from "../constants";

const prisma = new PrismaClient();

const createDiary = async (userId: number, diary_img: string, diary_content: string) => {
    const data = await prisma.diary.create({
        data: {
            user_id: userId,
            diary_img: diary_img,
            diary_content: diary_content,
        }
    })

    return data;
}

const getDiaryInfo = async (diary_id: number) => {
    const data = await prisma.diary.findFirst({
        where: {
            diary_id: diary_id
        }
    })

    return data;
} 

const diaryService = {
    createDiary,
    getDiaryInfo,
}

export default diaryService;