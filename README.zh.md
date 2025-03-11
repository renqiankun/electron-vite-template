[ English](README.md) | [ 中文](README.zh.md)
# 🚀 Electron + Vite + Drizzle ORM + Better-SQLite3

一个基于 **Electron + Vite + Drizzle ORM + Better-SQLite3** 的现代化桌面应用模板。

## ✨ 项目特点
- **Drizzle ORM** 现代化、轻量级 ORM 方案
- **Vue 3** 作为 UI 业务层（可自行替换）
- **Electron v34.0.0** + **Node.js v20.18.0**
- **Better-SQLite3** 高效、同步的 SQLite 数据库库

---

## 📂 目录结构

```bash
📦 项目根目录
├── assets                 # 静态资源（包含打包后的APP图标）
├── electron               # Electron 相关代码
│   ├── main               # 主进程代码
│   │   ├── auto-update    # electron-updater 自动更新相关代码
│   │   ├── db             # 数据库相关代码
│   │   ├── router         # 路由（提供访问数据库的接口）
│   │   ├── utils.ts       # 工具函数
│   │   ├── dbServicesInit.ts  # 数据库初始化逻辑
│   │   ├── index.ts       # 主进程入口文件
│   ├── preload            # 预加载目录
├── migrations             # 数据库升级相关文件
├── public                 # Vue 资源目录
├── src                    # Vue 代码目录
├── drizzle.config.ts       # Drizzle ORM 迁移配置文件
├── electron-builder.json   # Electron 打包配置
├── vite.config.tsn        # vite 打包配置
```

---

## ⚙️ 环境配置

1. **Node.js** 使用 `v20.18.0`
2. **Visual Studio 2022**（需安装 **桌面端开发 C++** 组件）
3. **Python 3.7**
4. **环境变量配置**
   ```sh
   npm config edit
   ```
   添加以下内容：
   ```ini
   ELECTRON_MIRROR=https://registry.npmmirror.com/-/binary/electron/
   home=https://npmmirror.com
   msvs_version=2022
   python=python
   registry=https://registry.npmmirror.com/
   ```
5. **全局安装 `node-gyp`**
   ```sh
   npm install -g node-gyp
   ```

---

## 🚀 启动项目

```sh
npm install                  # 安装依赖
npm rebuild                  # 重新编译本地依赖
npx electron-rebuild -f -w better-sqlite3  # 适配 Electron 原生模块，可选指定模块名 如：better-sqlite3
npm run syncSchema           # 先同步数据库 Schema
npm run dev                  # 启动项目
npm run build                # 构建项目
```

---

## 🔨 开发指南

### **📌 本地数据库同步**
- **修改数据库 Schema 后执行**：
  ```sh
  npm run syncSchema
  ```
  该命令包含以下三步：
  1. `npm rebuild` - 重新编译 `better-sqlite3` 适配本地 Node.js 版本
  2. `npx drizzle-kit push` - 将 `schema` 直接同步到本地数据库
  3. `npx electron-rebuild -f -w better-sqlite3` - 重新编译 `better-sqlite3` 适配 Electron 版本

### **📌 打包时数据库升级**

1. 执行打包： 会先执行 npm run generateSchama,生成数据库升级文件
   ```sh
   npm run build
   ```

   ```
   数据库文件区分开发环境.enb.db及生产环境.db两个文件，以应对drizzel-orm在本地开发
   同时本地打包安装时，数据库结构升级问题，如果使用同一个文件，则本地安装生产包时先删除已存在的数据库文件或修改为其他名称
   ```

---



### **📌 预加载（Preload）文件引用**
1. **webPreferences 禁用渲染环境node、开启上下文隔离，但是没有启用沙盒模式**，需在preload中抛出原生模块或进程通信
2. **Preload 目录文件编译为es的.mjs**，内部使用 `import` 方式引入其它模块


### **📌 数据库升级方式**
数据库升级分为 **开发环境** 和 **生产环境**：

#### **1️⃣ 生产环境**
- **打包时会自动生成数据库升级文件**，无需手动处理
- 确保 `drizzle.config.ts` 中 `databasePath` 指向本地数据库文件

#### **2️⃣ 开发环境**
- **Schema 变更后，执行**：
  ```sh
  npm run syncSchema
  ```
  **执行的操作**：
  - 重新编译 `better-sqlite3` 
  - 使用 `drizzle-kit push` 直接同步数据库
  - 重新适配 Electron 版本 

#### **3️⃣ 迁移文件管理**
- `migrations` 目录用于存放数据库升级文件
- **不要随意删除** 该目录，否则可能导致数据丢失

---

## 📌 待办事项
✅ **数据库通信示例**
✅ **app升级 electron-updater示例**
✅ **添加logger**
⬜ **多窗口示例**
⬜ **bytecode代码加密**

---

🎉 **Enjoy coding with Electron + Vite + Drizzle ORM!** 🚀

