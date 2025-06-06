/**
 * 数据库查询参数
 */
interface QueryDBType {
  /**请求路径即ipcMain监听路径 */
  path: string
  params?: Record<string, any>
  timeout?: number
}
/**
 * fs文件代理
 */
interface fsProxy {
  readFile: typeof fs.readFile
  writeFile: typeof fs.writeFile
  appendFile: typeof fs.appendFile
  mkdir: typeof fs.mkdir
  readdir: typeof fs.readdir
  stat: typeof fs.stat
  rmdir: typeof fs.rmdir
  rename: typeof fs.rename
  copyFile: typeof fs.copyFile
  access: typeof fs.access
  chmod: typeof fs.chmod
  chown: typeof fs.chown
  fstat: typeof fs.fstat
}

/**
 * app更新
 */
interface AppUpdate {
  onUpdateMsg: (callback: (data: { code: number; data?: any }) => void) => void
  setUrl: (url: string) => void
  checkUpdate: () => void
  startDownload: () => void
  quitAndInstall: () => void
}

interface Logger {
  warn: (msg: string) => Promise<void>
  error: (msg: string) => Promise<void>
  info: (msg: string) => Promise<void>
  verbose: (msg: string) => Promise<void>
  debug: (msg: string) => Promise<void>
  silly: (msg: string) => Promise<void>
}
/**
 * preload中 renderer注入electron
 */
declare interface Window {
  electronAPI: {
    queryDB: <T>(params: QueryDBType) => Promise<{ code: number; data: any; msg: string }>
    fs: fsProxy
    env: 'development' | 'production'
    update: AppUpdate
    logger: Logger,
    /**创建一个window 返回window.id */
    createWindow:()=>Promise<string>
  }
}
