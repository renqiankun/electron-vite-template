Here is the English version of your documentation:

---

[English](README.md) | [中文](README.zh.md)

# 🚀 Electron + Vite + Drizzle ORM + Better-SQLite3

A modern desktop application template based on **Electron + Vite + Drizzle ORM + Better-SQLite3**.

## ✨ Features

* **Drizzle ORM** – A modern and lightweight ORM solution
* **Vue 3** for the UI layer (can be replaced as needed)
* **Electron v34.0.0** + **Node.js v20.18.0**
* **Better-SQLite3** – A performant, synchronous SQLite library

---

## 📂 Project Structure

```bash
📦 Project Root
├── assets                 # Static assets (including packaged app icons)
├── electron               # Electron-related code
│   ├── main               # Main process code
│   │   ├── auto-update    # electron-updater related code
│   │   ├── db             # Database logic
│   │   ├── router         # Routes providing DB access interfaces
│   │   ├── utils.ts       # Utility functions
│   │   ├── dbServicesInit.ts  # Database initialization logic
│   │   ├── index.ts       # Entry file of the main process
│   ├── preload            # Preload scripts
├── migrations             # Database migration files
├── public                 # Vue public assets
├── src                    # Vue source code
├── drizzle.config.ts      # Drizzle ORM migration config
├── electron-builder.json  # Electron build config
├── vite.config.ts         # Vite build config
```

---

## ⚙️ Environment Setup

1. **Node.js** version `v20.18.0`
2. **Visual Studio 2022** (Install the **Desktop development with C++** workload)
3. **Python 3.7**
4. **Configure environment variables**

   ```sh
   npm config edit
   ```

   Add the following:

   ```ini
   ELECTRON_MIRROR=https://registry.npmmirror.com/-/binary/electron/
   home=https://npmmirror.com
   msvs_version=2022
   python=python
   registry=https://registry.npmmirror.com/
   ```
5. **Install `node-gyp` globally**

   ```sh
   npm install -g node-gyp
   ```

---

## 🚀 Getting Started

```sh
npm install                  # Install dependencies
npm rebuild                  # Rebuild native dependencies
npx electron-rebuild -f -w better-sqlite3  # Rebuild native modules for Electron (e.g., better-sqlite3)
npm run syncSchema           # Sync local development database schema
npm run dev                  # Start development (run syncSchema first)
npm run build                # Build the app (will generate migration files first)
```

---

## 🔨 Development Guide

### **📌 Syncing the Local Database**

* **To sync schema changes to your local database**, run:

  ```sh
  npm run syncSchema

  This command quickly syncs schema fields without generating migration files.
  Migration files are automatically generated during the build.
  ```

  ```sh
  npm run syncSchema-old  # (Deprecated and slower)

  This runs:
  1. `npm rebuild` – Rebuild better-sqlite3 for the local Node.js version
  2. `npx drizzle-kit push` – Push schema to local database
  3. `npx electron-rebuild -f -w better-sqlite3` – Rebuild for Electron compatibility
  ```

### **📌 Database Migration on Build**

1. Run the build command to generate migration files using the development database structure:

   ```sh
   npm run build
   ```

   ```
   The development (.env.db) and production (.db) database files are separate to avoid issues 
   with migration failures when installing the production app over an already-updated local dev DB.
   If using the same file, delete or back up the existing local file before installing the production app.
   ```

---

### **📌 Preload Script Notes**

1. **`webPreferences` disables Node.js in renderer and enables context isolation** (sandbox is not enabled). Native modules and IPC must be exposed through preload scripts.
2. **Preload files are compiled as `.mjs` using ES module syntax**, with `import` used for dependencies.

### **📌 Database Migration Handling**

Migrations differ between **development** and **production** environments:

#### **1️⃣ Production**

* **Migration files are automatically generated during build**
* Make sure `drizzle.config.ts` points to the correct local database path

#### **2️⃣ Development**

* After schema changes, run:

  ```sh
  npm run syncSchema
  ```

  This:

  * Syncs the schema with the local development database

#### **3️⃣ Managing Migration Files**

* The `migrations` directory stores all migration files
* **Do not delete** this directory to avoid potential data loss

---

## 📌 TODO List

✅ **Database communication example**
✅ **App auto-updater with electron-updater**
✅ **Add logger**
⬜ **Multi-window example**
⬜ **Bytecode encryption**

---

🎉 **Enjoy coding with Electron + Vite + Drizzle ORM!** 🚀

---
