import { defineConfig } from 'drizzle-kit'
import path, { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'

import { APP_NAME, DB_CONFIG } from './electron/main/utils/constants'
import { homedir } from 'node:os'

// 根据当前平台，复刻 Electron app.getPath('appData') 的默认规则
function getElectronAppDataPath() {
  const homeDir = homedir()
  if (process.platform === 'win32') {
    return process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming')
  }

  if (process.platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Application Support')
  }

  // Linux：优先遵从 XDG_CONFIG_HOME，未设置则使用 ~/.config
  return process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config')
}


// 需要确认databasePath 是否指向正确的数据库文件 DB_CONFIG.dbFileName区分了开发、生产文件名
const databasePath = path.join(getElectronAppDataPath(), APP_NAME, DB_CONFIG.dbFileName)
/**
 * 生成数据库文件夹
 */
const generateDbPath = (dirString: string) => {
  console.warn('databasePath: ', databasePath)
  try {
    const dir = dirname(dirString)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

generateDbPath(databasePath)
// console.log('databasePath', databasePath);



export default defineConfig({
  dialect: 'sqlite', // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore"
  schema: './electron/main/db/schema/index.ts',
  out: './migrations',
  dbCredentials: {
    url: databasePath
  }
})
