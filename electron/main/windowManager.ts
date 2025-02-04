/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:14:40
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-18 15:30:27
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { app, BrowserWindow, Menu, MenuItem, shell } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getIsAppQuitting } from "./storeManager";
import { LOGIN_WINDOW_HEIGHT, LOGIN_WINDOW_WIDTH } from "../utils/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.DIST_PYTHON = join(process.env.DIST_ELECTRON, "../dist-python");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

export const createMainWindow = () => {
  console.log("createMainWindow");
// process.env.DIST /Users/ningjinpeng/Desktop/git/private/weiyu/desktop/dist
// process.env.DIST_ELECTRON /Users/ningjinpeng/Desktop/git/private/weiyu/desktop/dist-electron/
// process.env.VITE_PUBLIC /Users/ningjinpeng/Desktop/git/private/weiyu/desktop/public
// process.env.VITE_DEV_SERVER_URL http://localhost:5173/
// preload /Users/ningjinpeng/Desktop/git/private/weiyu/desktop/dist-electron/preload/index.mjs
  // console.log("process.env.DIST", process.env.DIST);
  // console.log("process.env.DIST_ELECTRON", process.env.DIST_ELECTRON);
  // console.log("process.env.VITE_PUBLIC", process.env.VITE_PUBLIC);
  // console.log("process.env.VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
  // console.log("preload", preload);
  // 
  const mainWindow = new BrowserWindow({
    title: "weiyu.im",
    center: true,
    // x: 50,
    // y: 50,
    // width: 1000,
    // height: 800,
    width: LOGIN_WINDOW_WIDTH,
    height: LOGIN_WINDOW_HEIGHT,
    // minWidth: 1000,
    // minHeight: 800,
    // 创建无边框窗口：https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows
    // frame: false,
    titleBarStyle:  process.platform === 'darwin' ? "hidden" : "default",
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   height: 60
    // },
    trafficLightPosition: { x: 5, y: 5 },
    //
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });
  // 获取焦点
  // mainWindow.on('focus', (_event) => {
  //   console.log("mainWindow on focus");
  // })
  // 失去焦点
  // mainWindow.on('blur', (_event) => { 
  //   console.log("mainWindow on blur"); 
  // })
  // 点击创建x关闭按钮，会触发  
  // 右键点击docker-》退出，会触发
  mainWindow.on("close", (event) => { 
    console.log("window on close"); 
    // 仅在windows生效 && process.platform === "win32"
    if (!getIsAppQuitting()) { 
      console.log("window on close 1"); 
      // FIXME: 导致无法正常退出应用
      event.preventDefault();
      if (mainWindow) { 
        console.log("window on close 2");
        mainWindow.hide();
      }
      console.log("window on close 3");
    }
  });

  if (url) {
    console.log("electron url", url);
    mainWindow.loadURL(url);
  } else {
    console.log("electron indexHtml", indexHtml);
    mainWindow.loadFile(indexHtml);
  }
  if (!app.isPackaged) {
    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // 右键菜单
  mainWindow.webContents.on('context-menu', () => {
    const menu = new Menu()
    menu.append(new MenuItem({ label: '复制', role: 'copy', sublabel: '⌘ + C' }))
    menu.append(new MenuItem({ label: '粘贴', role: 'paste', sublabel: '⌘ + V' }))
    menu.append(new MenuItem({ label: '剪切', role: 'cut', sublabel: '⌘ + X' }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: '全选', role: 'selectAll', sublabel: '⌘ + A' }))
    menu.popup()
  })
  // 开机启动-设置隐藏窗口
  // mainWindow.once("ready-to-show", () => {
  //   if (!app.getLoginItemSettings().openAtLogin) mainWindow.show();
  // }); 
  // show the traffic lights
  // mainWindow.setWindowButtonVisibility(true);
  return mainWindow;
};

export const createEnlargeWindow = (arg) => {
  const enlargeWindow = new BrowserWindow({
    title: "放大阅读",
    webPreferences: {
      preload,
    },
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log("createEnlargeWindow:");
    enlargeWindow.loadURL(`${url}`);
  } else {
    console.log("createEnlargeWindow:");
    enlargeWindow.loadFile(indexHtml);
  }
  enlargeWindow.webContents.on("dom-ready", () => {
    enlargeWindow.webContents.send("initialize-window", arg);
  });
  return enlargeWindow;
};

export const createChildWindow = (arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      // nodeIntegration: true,
      // contextIsolation: false,
    },
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
  return childWindow;
};
