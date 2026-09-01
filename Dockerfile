# ==========================================
# 1. 基础镜像阶段
# ==========================================
FROM node:20.19.1-alpine

# ==========================================
# 2. 设置工作目录
# ==========================================
WORKDIR /universal-admin-koa-app

# ==========================================
# 3. 复制依赖并安装：搬运并组装家具
# ==========================================
COPY package*.json ./

# 🌟 核心修改：安装 PM2（全局），否则最后 pm2-runtime 会报错找不到命令
# 建议加上 npm regisry 镜像加速（如果构建在国内服务器或阿里云）
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm install -g pm2

# 利用 Docker 缓存：package.json 没变时，这步瞬间完成
RUN npm install --production

# ==========================================
# 4. 复制业务代码：搬入你写好的 JS 文件
# ==========================================
# 复制打包好的 dist 目录到 /universal-admin-koa-app/dist
COPY dist ./dist

# 如果上传文件夹仅用于存放初始化静态资源，保留此行；
# 如果是存放用户动态上传文件的目录，建议删除此行，改用 docker run -v 动态挂载
# COPY uploads ./uploads

# 创建空 uploads 目录供宿主机挂载，防止权限报错
RUN mkdir -p uploads

COPY README.md ./

# ==========================================
# 5. 暴露端口与启动
# ==========================================
EXPOSE 8001

CMD ["pm2-runtime", "dist/app.js", "--name", "koa-backend"]