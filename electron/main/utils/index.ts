import { app } from "electron";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { existsSync, mkdirSync } from "fs";
import log from "../logger";
/**
 * 系统目录
 * 获取用户目录下appdata目录，win下指向C:\Users\用户名\AppData\Roaming
 * @returns string
 */
export const getAppHand = () => {
  return app.getPath("appData");
};


/**
 * 系统目录
 * 获取用户目录下userData（app）目录，win下指向C:\Users\用户名\AppData\Roaming\appname
 * @returns string
 */
export const getUserDataPath = () => {
  return app.getPath("userData");
}

/**
 * 安装目录
 * 获取打包的resource路径，开发环境为项目根目录
 * @returns string
 */
export const getResourcePath = () => {
  return process.resourcesPath;
}

/**
 * 是否是mac
 * @returns string
 */
export const isMac = ()=> {
  return process.platform === 'darwin'
}





/**
 * 获取当前文件目录
 * @param importMetaUrl import.meta.url
 * @returns string
 */
export function getDirname(importMetaUrl) {
  return path.dirname(fileURLToPath(importMetaUrl));
}


export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'




/**
 * 生成文件夹
 */
export const generateDirPath = (dirString:string) => {
  try {
    const dir = dirname(dirString)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  } catch (error) {
    log.error('Database connection error:', error)
    throw error
  }
}
