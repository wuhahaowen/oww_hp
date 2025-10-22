# 本地开发部署指南

本文档介绍如何在本地 Docker Desktop 环境中运行和调试 hass-panel 项目。

## 目录结构

```
hass-panel/
├── backend/           # 后端代码 (FastAPI)
├── frontend/          # 前端代码 (React)
├── docker/            # Docker 配置文件
├── docker-compose.dev.yml  # 本地开发环境 Docker Compose 配置
└── ...
```

## 本地开发环境部署

### 1. 克隆项目

```bash
git clone <项目地址>
cd hass-panel
```

### 2. 构建并启动本地开发环境

```bash
# 使用本地开发的 docker-compose 文件启动
docker-compose -f docker-compose.dev.yml up --build
```

#构架本地
docker run -d -p 5123:5123 -p 5124:5124 \
-v D:/hebing/hass-panel/data/hass-panel-dev:/config/hass-panel \
-v D:/hebing/hass-panel/backend:/backend \
-v D:/hebing/hass-panel/frontend/build:/app \
-e NODE_ENV=development \
-e DEBUG=1 \
--restart unless-stopped \
--name hass-panel-dev \
ghcr.io/mrtian2016/hass-panel:latest


方案二：创建一个专门用于前端开发的容器
我们可以创建一个新的Docker容器，专门用于前端开发，与后端容器分离：
docker run -it --rm -p 3000:3000 -v D:/hebing/hass-panel/frontend:/app -w /app node:18 bash
然后在容器中运行：
npm install
npm start

我们可以修改运行容器的命令，添加前端源代码的挂载，并在容器中运行前端开发服务器：
docker run -d -p 5123:5123 -p 5124:5124 -p 3000:3000 \
-v D:/hebing/hass-panel/data/hass-panel-dev:/config/hass-panel \
-v D:/hebing/hass-panel/backend:/backend \
-v D:/hebing/hass-panel/frontend:/frontend \
--name hass-panel-dev \
ghcr.io/mrtian2016/hass-panel:latest
然后进入容器并启动前端开发服务器：
docker exec -it hass-panel-dev bash
cd /frontend
npm install
npm start


# 使用清理后的环境重新构建
docker-compose -f docker-compose.dev.yml down
docker system prune -a
docker-compose -f docker-compose.dev.yml up --build



这将启动以下服务：
- 前端服务 (nginx): http://localhost:5123
- 后端服务 (FastAPI): http://localhost:5124

### 3. 访问应用

- 前端界面: http://localhost:5123
- 后端 API 文档: http://localhost:5124/docs

### 4. 开发调试

#### 后端开发
后端代码已挂载到容器中，启用 `--reload` 选项，代码更改会自动重启服务。

#### 前端开发
如需进行前端开发，可以单独运行前端开发服务器：

```bash
cd frontend
npm install
npm start
```

前端开发服务器默认运行在 http://localhost:3000，并配置了代理以访问后端 API。

### 5. 数据持久化

所有配置数据存储在本地的 `data/hass-panel-dev` 目录中，包括：
- SQLite 数据库
- 用户配置
- 日志文件
- 上传文件

## 网络问题解决方案

如果遇到网络问题导致无法拉取 Docker 镜像，请尝试以下解决方案：

### 1. 配置 Docker Desktop 镜像加速

在 Docker Desktop 中配置镜像加速器：
1. 打开 Docker Desktop 设置
2. 选择 "Docker Engine" 选项卡
3. 在配置文件中添加以下内容：
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```
4. 点击 "Apply & Restart" 重启 Docker

### 2. 使用国内网络环境

如果在企业或学校网络环境下，可能需要配置代理或使用家庭网络。

### 3. 手动拉取基础镜像

可以尝试手动拉取所需的镜像：
```bash
docker pull python:3.9-slim
docker pull node:18
```

## 常见问题

### 1. 端口冲突
如果 5123 或 5124 端口已被占用，可以修改 [docker-compose.dev.yml](docker-compose.dev.yml) 中的端口映射。

### 2. 权限问题
在某些系统上，可能需要调整 `data/hass-panel-dev` 目录的权限：

```bash
mkdir -p data/hass-panel-dev
chmod -R 777 data/hass-panel-dev
```

### 3. 首次运行初始化
首次运行时，需要通过前端界面完成系统初始化流程。