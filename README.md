[ English](README.md) | [ 中文](README.zh.md)
# 🚀 Electron + Vite + Drizzle ORM + Better-SQLite3

A modern desktop application template based on **Electron + Vite + Drizzle ORM + Better-SQLite3**.

## ✨ Features
- **Drizzle ORM**: A modern, lightweight ORM solution
- **Vue 3**: Used as the UI layer (can be replaced as needed)
- **Electron v34.0.0** + **Node.js v20.18.0**
- **Better-SQLite3**: High-performance, synchronous SQLite database library

---

## 📂 Directory Structure

```bash
📦 Project Root
├── assets                 # Static resources (including app icons for packaging)
├── electron               # Electron-related code
│   ├── main               # Main process code
│   │   ├── auto-update    # electron-updater auto update
│   │   ├── db             # Database-related code
│   │   ├── router         # Routes (provides access to the database)
│   │   ├── utils.ts       # Utility functions
│   │   ├── dbServicesInit.ts  # Database initialization logic
│   │   ├── index.ts       # Main process entry file
│   ├── preload            # Preload scripts
├── migrations             # Database migration files
├── public                 # Vue public resources
├── src                    # Vue source code
├── drizzle.config.ts       # Drizzle ORM migration configuration
├── electron-builder.json   # Electron build configuration
├── vite.config.ts         # Vite build configuration
```

---

## ⚙️ Environment Setup

1. **Node.js** version `v20.18.0`
2. **Visual Studio 2022** (requires **Desktop development with C++** component)
3. **Python 3.7**
4. **Configure environment variables**
   ```sh
   npm config edit
   ```
   Add the following content:
   ```ini
   ELECTRON_MIRROR=https://registry.npmmirror.com/-/binary/electron/
   home=https://npmmirror.com
   msvs_version=2022
   python=python
   registry=https://registry.npmmirror.com/
   ```
5. **Globally install `node-gyp`**
   ```sh
   npm install -g node-gyp
   ```

---

## 🚀 Start the Project

```sh
npm install                  # Install dependencies
npm rebuild                  # Rebuild local dependencies
npx electron-rebuild -f -w better-sqlite3  # Adapt Electron native modules (optional: specify module name, e.g., better-sqlite3)
npm run syncSchema           # Sync the database schema
npm run dev                  # Start the project
npm run build                # Build the project
```

---

## 🔨 Development Guide

### **📌 Local Database Synchronization**
- **After modifying the database schema, execute:**
  ```sh
  npm run syncSchema
  ```
  This command includes three steps:
  1. `npm rebuild` - Rebuild `better-sqlite3` to match the local Node.js version
  2. `npx drizzle-kit push` - Sync the schema directly to the local database
  3. `npx electron-rebuild -f -w better-sqlite3` - Rebuild `better-sqlite3` for Electron compatibility

### **📌 Database Upgrade During Packaging**

1. Run the build command, which will first execute `npm run generateSchema` to generate database migration files:
   ```sh
   npm run build
   ```

   ```
   The database file is separated into development (`.env.db`) and production (`.db`) versions.
   This prevents issues when using Drizzle ORM for both local development and packaged installations.
   If using the same file, remove the existing database file or rename it before installing the production package.
   ```

---

### **📌 Preload Script Usage**
1. **`webPreferences` disables Node.js in the renderer, enables context isolation, but does not enable sandbox mode**, requiring native modules or IPC communication to be exposed in `preload`.
2. **Preload files are compiled as `.mjs` (ES module format)**, and `import` is used to include other modules internally.

### **📌 Database Migration Strategy**
Database migrations are handled differently for **development** and **production** environments:

#### **1️⃣ Production Environment**
- **Database migration files are automatically generated during the build process**, no manual intervention required.
- Ensure that `drizzle.config.ts` points to the correct database file.

#### **2️⃣ Development Environment**
- **After modifying the schema, run:**
  ```sh
  npm run syncSchema
  ```
  **This executes the following steps:**
  - Rebuild `better-sqlite3`
  - Use `drizzle-kit push` to directly sync the database
  - Rebuild `better-sqlite3` for Electron compatibility

#### **3️⃣ Migration File Management**
- The `migrations` directory stores database migration files.
- **Do not delete this directory**, as it may cause data loss.

---

## 📌 To-Do List
✅ **Database Communication Example**  
✅ **App Update with electron-updater Example**  
✅ **Add Logger**  
⬜ **Multi-Window Example**  
⬜ **bytecode**

---

🎉 **Enjoy coding with Electron + Vite + Drizzle ORM!** 🚀

