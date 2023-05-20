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

    const result = await axios({
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
    const img = fs.readFileSync(local_img_url);

    axios.interceptors.request.use(function (config) {
        console.log('Request:', config); // 요청 객체 출력
        return config;
      }, function (error) {
        return Promise.reject(error);
      });

    formdata.append('file', img, "test.png");
    
    const data = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/diary/uploadImage',
        data: formdata,
        headers: formdata.getHeaders(),
    }).then((res) => {
        return res?.data;
    }).catch((error) => {
        console.log(error.response)
    })

    return data?.data;
}

const diaryService = {
    createDiary,
    getDiaryInfo,
    saveImageInLocal,
    uploadImageInRemote
}

export default diaryService;