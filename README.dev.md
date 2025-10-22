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