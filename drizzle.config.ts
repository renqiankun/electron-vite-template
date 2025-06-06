import { defineConfig } from 'drizzle-kit'
import path, { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'

import { APP_NAME, DB_CONFIG } from './electron/main/utils/constants'
// 需要确认databasePath 是否指向正确的数据库文件 DB_CONFIG.dbFileName区分了开发、生产文件名
const databasePath = path.join(process.env.APPDATA ?? '', APP_NAME, DB_CONFIG.dbFileName)
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
