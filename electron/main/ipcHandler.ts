/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:16:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-18 15:29:33
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import {
  shell,
  ipcMain,
  Notification,
  BrowserWindow,
  dialog,
  app,
  nativeTheme,
} from "electron";
import fs from "fs";
import { createChildWindow, createEnlargeWindow } from "./windowManager";
import { createScreenshot } from "./screenshotManager";
// import capture from "../capture";
import os from "os";
import path from "node:path";
// import https from "node:https";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { EMediaType, requestMediaAccess } from "./requestMediaAccess";
import { join } from "node:path";
import testPuppeteer from "../puppet";
import { LOGIN_WINDOW_HEIGHT, LOGIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT, MAIN_WINDOW_WIDTH } from "../utils/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let enlargeWindow = null;

// https://www.electronjs.org/docs/latest/tutorial/ipc
export const registerIpcHandler = (mainWindow: BrowserWindow) => {
  console.log("registerIpcHandler");
  // 1.注册全局事件
  // 打开外部URL链接
  ipcMain.on("open-external-url", (_event, url) => {
    shell.openExternal(url);
  });

  // quit通知处理函数
  ipcMain.on("quit", (event) => {
    console.log("event", event);
    event.sender.send("hide-tray");
    // isAppQuit = true;
    app.quit();
    app.exit(0); // FIXME: windows客户端在退出程序之后，查看任务管理器，还存在运行中线程，并提示新消息，添加此行尝试完善
  });

  //
  ipcMain.on("set-login-item-settings", (event, settings) => {
    console.log("openAtStartup:", event, settings);
    app.setLoginItemSettings(settings);
  });
  //
  ipcMain.on("show-context-menu", (event) => {
    console.log('show-context-menu', event)
    // if (BrowserWindow) {
    //   // const win = BrowserWindow.fromWebContents(event.sender)
    //   // menu.popup(win)
    // }
  });

  // 屏幕大小
  // const size = screen.getPrimaryDisplay().size
  // 新访客进入
  // TODO: windows icon图标闪烁
  // TODO: Windows增加右下角弹窗提示，Mac右上角弹窗
  ipcMain.on("new-visitor", (event) => {
    console.log("event", event);
    // if (mainWindow.isFocused()) {
    //   return
    // }
    // shouldShineIcon = true
    // shineTrayIcon()
    // toggleNotificationWindow()
    // if (process.platform === 'win32') {
    //   let options = { icon: iconPath, title: '新访客提示', content: '新访客进入' }
    //   if (trayIcon && !trayIcon.isDestroyed()) trayIcon.displayBalloon(options)
    // }
  });

  // 收到新消息
  // TODO: windows icon图标闪烁
  // TODO: Windows增加右下角弹窗提示，Mac右上角弹窗
  ipcMain.on("notification:show", (_event, title, content) => {
    console.log("event", content);
    new Notification({
      title: title,
      body: content,
      icon: join(process.env.VITE_PUBLIC, "/logo.png"),
    }).show();
    //
    // if (mainWindow.isFocused()) {
    //   return
    // }
    // shouldShineIcon = true
    // shineTrayIcon()
    // toggleNotificationWindow()
    // if (process.platform === 'win32') {
    //   let options = { icon: iconPath, title: '新消息提示', content: '收到新消息' }
    //   if (trayIcon && !trayIcon.isDestroyed()) trayIcon.displayBalloon(options)
    // }
  });

  ipcMain.on("is-focused", (event, arg) => {
    console.log("event", event, arg);
    // event.returnValue = mainWindowFocused
  });

  // 监听角标通道消息
  ipcMain.on("badge-changed", function (event, num) {
    console.log("event", event, num);
    // if (trayIcon === null || trayIcon === undefined) {
    //   return
    // }
    // if (process.platform === 'darwin') {
    //   // 设置badge未读数, 设置 num = '' 清空数字
    //   app.dock.setBadge(num)
    //   if (trayIcon) trayIcon.setTitle(num)
    // } else if (process.platform === 'win32') {
    //   // let options = { icon: iconPath, title: '未读消息提示', content: '未读数目' + num }
    //   // trayIcon.displayBalloon(options)
    // }
  });

  ipcMain.on("screenshot:capture", (_event, content) => {
    console.log("capture", content);
    //
    const screenshots = createScreenshot(mainWindow);
    screenshots.startCapture();
    // capture.startCapture();
  });

  // stomp连接中
  ipcMain.on("connecting", (event) => {
    console.log("event", event);
  });

  // stomp连接成功
  ipcMain.on("connected", (event) => {
    console.log("event", event);
    // if (!trayIcon || trayIcon.isDestroyed()) {
    //   return
    // }
    // trayIcon.setImage(lightIconPath)
    // if (process.platform === 'win32') {
    //   let options = { icon: iconPath, title: '连接提示', content: '连接成功' }
    //   trayIcon.displayBalloon(options)
    // }
  });

  // stomp连接断开
  ipcMain.on("disconnected", (event) => {
    console.log("event", event);
    // if (!trayIcon || trayIcon.isDestroyed()) {
    //   return
    // }
    // trayIcon.setImage(darkIconPath)
  });

  //
  ipcMain.on("show-tray", (event) => {
    console.log("event", event);
    // createTrayIcon()
    // createTrayWindow()
    // createNotificationWindow()
  });

  ipcMain.on("save-image-dialog", (event, imageUrl) => {
    console.log("event", event, imageUrl);
    // const options = {
    //   title: '保存图片',
    //   filters: [
    //     { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    //   ]
    // }
    // dialog.showSaveDialog(options, (filename) => {
    //   // event.sender.send('saved-file', filename)
    //   downloadFile(imageUrl, filename)
    // })
  });

  // 隐藏tray
  ipcMain.on("hide-tray", (event) => {
    console.log("event", event);
  });

  // New window example arg: new windows url
  ipcMain.handle("open-win", (_, arg) => {
    createChildWindow(arg);
  });

  //
  ipcMain.on("url:open", (_, url) => {
    console.log("open url", url);
    shell.openExternal(url);
    // Open devTool if the app is not packaged
    // mainWindow.webContents.openDevTools({ mode: "detach" });
    // const win = new BrowserWindow({ width: 800, height: 600 });
    // win.loadURL(url);
    // win.show();
  });

  // 登录成功: 小窗口变大窗口
  ipcMain.on("login:success", (_) => {
    console.log("login:success", _);
    mainWindow.setSize(MAIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT);
    mainWindow.center();
  });

  ipcMain.on("logout:success", (_) => {
    console.log("logout:success", _);
    mainWindow.setSize(LOGIN_WINDOW_WIDTH, LOGIN_WINDOW_HEIGHT, true);
    mainWindow.center();
  });

  //
  function handleSetTitle(event, title) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  }
  ipcMain.on("set-title", handleSetTitle);

  //
  async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({});
    if (!canceled) {
      return filePaths[0];
    }
  }
  ipcMain.handle("dialog:openFile", handleFileOpen);

  //
  async function handleChooseImage() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpeg", "jpg", "png", "gif"] }],
    });
    if (!canceled) {
      return filePaths.map((path) => {
        return fs.readFileSync(path);
      });
      // return filePaths;
    }
  }
  ipcMain.handle("dialog:chooseImage", handleChooseImage);

  async function handleSystemInfo() {
    return {
      os: os.platform(),
      // arch: os.arch(),
      version: os.release(),
      // cpu: os.cpus(),
      type: os.type(),
      hostname: os.hostname(),
      // network: os.networkInterfaces(),
      userInfo: os.userInfo(),
    };
  }
  ipcMain.handle("system:info", handleSystemInfo);

  async function getIpAddress() {
    const interfaces = os.networkInterfaces();
    // console.log("interfaces", interfaces);
    const ipAddress: string[] = [];
    Object.keys(interfaces).forEach((key) => {
      interfaces[key].forEach((item) => {
        const familyV4Value = typeof item.family === "string" ? "IPv4" : 4;
        if (item.family === familyV4Value && !item.internal) {
          // console.log("item.address", item.address);
          ipAddress.push(item.address);
          // return;
        }
        // if (item.family === "IPv4" && item.address !== "127.0.0.1" && item.internal === false) {
        //   ipAddress = item.address;
        // }
      });
    });
    return ipAddress;
  }
  ipcMain.handle("system:ip", getIpAddress);

  // 从微语拖拽文件到桌面或其他地方
  // https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
  // const iconName = path.join(__dirname, "iconForDragAndDrop.png");
  // console.log("iconName", iconName);
  // const icon = fs.createWriteStream(iconName);
  // // Create a new file to copy - you can also copy existing files.
  // fs.writeFileSync(
  //   path.join(__dirname, "drag-and-drop-1.md"),
  //   "# First file to test drag and drop"
  // );
  // fs.writeFileSync(
  //   path.join(__dirname, "drag-and-drop-2.md"),
  //   "# Second file to test drag and drop"
  // );
  // https.get("https://img.icons8.com/ios/452/drag-and-drop.png", (response) => {
  //   response.pipe(icon);
  // });
  // // https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
  // ipcMain.on("ondragstart", (event, filePath) => {
  //   event.sender.startDrag({
  //     file: path.join(__dirname, filePath),
  //     icon: iconName,
  //   });
  // });

  // https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
  // Handle window controls via IPC
  ipcMain.on("shell:open", () => {
    const pageDirectory = __dirname.replace("app.asar", "app.asar.unpacked");
    const pagePath = path.join("file://", pageDirectory, "index.html");
    shell.openExternal(pagePath);
  });

  // 切换对话页面-右侧栏：显示、隐藏
  ipcMain.on("right-panel:show", (_event, show) => {
    const size = mainWindow.getSize();
    let width = size[0];
    const height = size[1];
    // console.log("right-panel:show", show, width, height)
    if (show) {
      width = width + 200;
    } else {
      width = width - 200;
    }
    mainWindow.setSize(width, height, true);
  });

  // 开机启动
  ipcMain.on("open-at-login:set", function (_, openAtLogin) {
    app.setLoginItemSettings({
      openAtLogin,
      openAsHidden: true,
    });
  });
  ipcMain.handle("open-at-login:get", function () {
    return app.getLoginItemSettings().openAtLogin;
  });

  // 颜色主题, 会影响选择文件对话框等颜色
  // "Native interfaces" include the file picker, window border, dialogs, context menus, and more
  // https://www.electronjs.org/docs/latest/tutorial/dark-mode
  ipcMain.on("theme-mode:set", (_event, themeMode) => {
    console.log("theme-mode:set", themeMode);
    nativeTheme.themeSource = themeMode;
  });

  ipcMain.handle(
    "request-media-access",
    async (_, mediaType: EMediaType = EMediaType.microphone) => {
      return requestMediaAccess(mediaType);
    },
  );

  // 监听渲染进程发来的 'create-new-window' 消息
  ipcMain.on("create-new-window", (event, arg) => {
    if (enlargeWindow == null) {
      enlargeWindow = createEnlargeWindow(arg);
    } else {
      enlargeWindow.show();
    }
  });

  // 窗口是否激活
  ipcMain.handle("window-is-active", function () {
    return mainWindow.isFocused();
  });

  //登录窗口最小化
  ipcMain.on("window-min", function () {
    mainWindow.minimize();
  });

  //登录窗口最大化
  ipcMain.on("window-max", function () {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  //登录窗口关闭
  ipcMain.on("window-close", function () {
    mainWindow.close();
  });

  //
  ipcMain.on("test-puppeteer", (_) => {
    console.log("test-puppeteer", _);
    testPuppeteer();
  });
};
