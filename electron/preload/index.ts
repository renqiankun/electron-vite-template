import { queryDB } from './modules/db'
import { fsProxy } from './modules/fs'
import {update} from './modules/update'
import {logger} from './modules/logger'
import { contextBridge } from 'electron'
import { createWindow } from './modules/window-pool'
/**
 * 抛出window.electronAPI
 */
contextBridge.exposeInMainWorld('electronAPI', {
  queryDB: queryDB,
  env: process.env.NODE_ENV,
  fs: fsProxy,
  update,
  logger,
  createWindow
})
