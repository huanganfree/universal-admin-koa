"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const content_controller_1 = require("../../controller/content/content.controller");
const multer_1 = __importDefault(require("@koa/multer"));
const node_path_1 = __importDefault(require("node:path"));
const dayjs_1 = __importDefault(require("dayjs"));
const contentRouter = new router_1.default({ prefix: '/api/content' });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // 2. 控制文件叫什么名字（核心优势）
    filename: (req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname); // 获取文件扩展名
        const uniqueSuffix = `${(0, dayjs_1.default)().format('YYYY-MM-DD_HH-mm-ss')}${ext}`;
        cb(null, uniqueSuffix);
    }
});
const upload = (0, multer_1.default)({ storage });
contentRouter.post('/upload', upload.single('file'), content_controller_1.uploadFile);
contentRouter.post('/create', content_controller_1.createContent);
contentRouter.get('/contents/search', content_controller_1.getContents);
contentRouter.get('/pendingContents/search', content_controller_1.getPendingContents);
contentRouter.get('/deletedContents/search', content_controller_1.getDeletedContents);
contentRouter.put('/content/:id/submit', content_controller_1.submitContent);
contentRouter.put('/content/:id/approve', content_controller_1.approveContent);
contentRouter.put('/content/:id/reject', content_controller_1.rejectContent);
contentRouter.put('/content/:id/unpublish', content_controller_1.unpublishContent);
contentRouter.put('/:id/restore', content_controller_1.restoreContent);
contentRouter.delete('/content/delete', content_controller_1.deleteContent);
contentRouter.delete('/destroy', content_controller_1.physicalDeleteContent);
contentRouter.get('/detail/:id', content_controller_1.getContentDetail);
contentRouter.put('/:id', content_controller_1.editContent);
exports.default = contentRouter;
