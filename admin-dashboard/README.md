# HexaCoin 后台管理系统

这是一个基于 Supabase + Vite + React + Tailwind CSS 构建的后台管理系统，用于管理 HexaCoin 应用的用户、TODO 和短信验证码记录等数据。

## 功能特性

- 用户管理：查看、创建、编辑和删除用户
- TODO 管理：查看、创建、编辑和删除 TODO 项目
- 短信验证码记录：查看和管理短信验证码记录
- 响应式设计：适配桌面和移动设备
- 基于 Supabase 的身份验证和数据存储

## 技术栈

- **前端框架**：React
- **构建工具**：Vite
- **CSS 框架**：Tailwind CSS
- **状态管理**：Zustand
- **后端服务**：Supabase
- **路由**：React Router
- **表单处理**：React Hook Form

## 安装和运行

### 前提条件

- Node.js (v14.0.0 或更高版本)
- npm 或 yarn

### 安装步骤

1. 克隆仓库

```bash
git clone <仓库地址>
cd admin-dashboard
```

2. 安装依赖

```bash
npm install
# 或
yarn
```

3. 创建环境变量文件

在项目根目录创建 `.env.local` 文件，并添加以下内容：

```
VITE_SUPABASE_URL=你的_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

5. 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 项目结构

```
admin-dashboard/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图片、字体等资源
│   ├── components/      # 可复用组件
│   │   └── ui/          # UI 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面组件
│   ├── services/        # API 服务
│   ├── store/           # 状态管理
│   ├── utils/           # 工具函数
│   ├── App.jsx          # 应用入口组件
│   └── main.jsx         # 应用入口文件
├── .env.local           # 环境变量（需自行创建）
├── index.html           # HTML 模板
├── package.json         # 项目依赖和脚本
├── tailwind.config.js   # Tailwind CSS 配置
└── vite.config.js       # Vite 配置
```

## 数据模型

### 用户 (User)

- id: UUID (主键)
- username: 字符串 (唯一)
- is_active: 布尔值
- phone_number: 字符串 (唯一，可选)
- hashed_password: 字符串
- is_superuser: 布尔值
- shortid: 字符串 (唯一，可选)
- created_at: 日期时间
- updated_at: 日期时间
- is_deleted: 布尔值
- description: 字符串 (可选)

### TODO

- id: UUID (主键)
- text: 字符串
- completed: 布尔值
- user_id: UUID (外键，关联到 User)
- created_at: 日期时间
- updated_at: 日期时间
- is_deleted: 布尔值
- description: 字符串 (可选)

### 短信验证码记录 (SMSCodeRecord)

- id: UUID (主键)
- expire_time: 日期时间
- phone_number: 字符串
- sms_code: 整数
- created_at: 日期时间
- updated_at: 日期时间
- is_deleted: 布尔值
- description: 字符串 (可选)

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)