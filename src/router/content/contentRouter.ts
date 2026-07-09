import Router from '@koa/router';
import { approveContent, createContent, deleteContent, editContent, getContentDetail, getContents, getDeletedContents, getPendingContents, physicalDeleteContent, rejectContent, restoreContent, submitContent, unpublishContent, uploadFile } from '../../controller/content/content.controller';
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

contentRouter.get('/pendingContents/search', getPendingContents)

contentRouter.get('/deletedContents/search', getDeletedContents)

contentRouter.put('/content/:id/submit', submitContent)

contentRouter.put('/content/:id/approve', approveContent)

contentRouter.put('/content/:id/reject', rejectContent)

contentRouter.put('/content/:id/unpublish', unpublishContent)

contentRouter.put('/:id/restore', restoreContent)

contentRouter.delete('/content/delete', deleteContent)

contentRouter.delete('/destroy', physicalDeleteContent)

contentRouter.get('/detail/:id', getContentDetail)

contentRouter.put('/:id', editContent)

export default contentRouter