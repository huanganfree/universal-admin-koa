import Router from '@koa/router';
import { createContent, getContents, uploadFile } from '../../controller/content/content.controller';
import multer from '@koa/multer';
import path from 'node:path';
import dayjs from 'dayjs';


const contentRouter = new Router({ prefix: '/api/content' });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // 2. 控制文件叫什么名字（核心优势）
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${dayjs().format('YYYY-MM-DD_HH-mm-ss')}${ext}`;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });

contentRouter.post('/upload', upload.single('file'), uploadFile)

contentRouter.post('/create', createContent)

contentRouter.get('/contents/search', getContents)

export default contentRouter