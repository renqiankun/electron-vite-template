import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path, { dirname } from 'path'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { APP_NAME, DB_CONFIG } from '../utils/constants'
import { generateDirPath, getAppHand, getDirname } from '../utils'
import log from '../logger'
const __dirname = getDirname(import.meta.url)
const DB_PATH = path.join(getAppHand(), APP_NAME, DB_CONFIG.dbFileName)

// 初始化数据库目录
generateDirPath(DB_PATH)
const sqlite = new Database(DB_PATH, {
  timeout: DB_CONFIG.timeout
})

export let db: BetterSQLite3Database<typeof schema>;
/**
 * 连接数据库
 */
export const dbConnect = async () => {
  // 校验数据库目录是否存在
  // generateDbPath(DB_PATH)
  db = drizzle(sqlite, { schema })
  // 仅在生成环境中使用迁移流程(打包自动生成升级文件)，开发环境使用 npm run syncSchema 直接同步数据库
  log.info('dbConnect', process.env.NODE_ENV)
  log.info('dbConnect', path.join(__dirname, '../../../migrations') )
  if (process.env.NODE_ENV === 'production') {
    try {
      await migrate(db, { migrationsFolder: path.join(__dirname, '../../../migrations') })
    }catch (e) {
      log.error('dbConnect error ', e)
    }
  }
}
