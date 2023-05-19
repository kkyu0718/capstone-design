import { PrismaClient, diary } from "@prisma/client";
import axios from "axios";
import fs from "fs"
import FormData from "form-data";
import util from "util";

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

const saveImageInLocal = async (diary_img: string) => {
    const local_img_uri = "test.png";

    await axios({
        method: 'get',
        url: diary_img,
        responseType: 'stream'
    }).then((res) => {
        const writer = fs.createWriteStream(local_img_uri, {flags: 'w'});
        res.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })
      
        
    }).catch((error) => {
        console.log(error.response)
    })

    return local_img_uri;
}

const uploadImageInRemote = async (local_img_url: string) => {
    console.log("uploading...")
    const formdata = new FormData(); 
    // const reader = fs.createReadStream(local_img_url, 'utf-8');
    const img = fs.readFileSync(local_img_url,
    { encoding: 'base64', flag: 'r' });
    // console.log(img);

    formdata.append('file', img, "test.png");
    // formdata.append("file", "tempory")

    // console.dir("formdata"+util.inspect(formdata, {depth: null}));
    const data = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/diary/uploadImage',
        data: formdata,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((res) => {
        // console.log("업로드 response")
        // console.log(res);
        return res?.data;
    }).catch((error) => {
        console.log(error.response)
    })
    // console.log("returning data" + data?.data)
    return data?.data;
}

const diaryService = {
    createDiary,
    getDiaryInfo,
    saveImageInLocal,
    uploadImageInRemote
}

export default diaryService;