/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:15:22
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-26 09:45:47
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
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  app,
  dialog,
  shell,
} from "electron";
import { setIsAppQuitting } from "./storeManager";
import { createScreenshot } from "./screenshotManager";
// import { join } from 'path';
// import { readFileSync } from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// 添加获取版本信息的函数
const getVersionInfo = () => {
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);
  // const pkgPath = join(__dirname, '../../package.json');
  
  // 简单起见，直接使用 app.getVersion()
  return {
    version: app.getVersion(),
    commit: app.getVersion(),
    date: new Date().toISOString(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    v8: process.versions.v8,
    os: `${process.platform} ${process.getSystemVersion()}`
  };
};

// 显示关于对话框
const showAboutDialog = (mainWindow: BrowserWindow) => {
  const info = getVersionInfo();
  const message = [
    `Bytedesk ${info.version}`,
    `Version: ${info.commit}`,
    `Publish: ${new Date().toLocaleDateString()}`,
    '',
    `Electron: ${info.electron}`,
    `Chrome: ${info.chrome}`,
    `Node.js: ${info.node}`, 
    `V8: ${info.v8}`,
    `System: ${info.os}`,
    '',
    '© 2024 bytedesk. All rights reserved.'
  ].join('\n');

  dialog.showMessageBox(mainWindow, {
    title: 'about bytedesk',
    message: message,
    type: 'info',
    buttons: ['ok']
  });
};

export const registerMenuManager = (mainWindow: BrowserWindow) => {
  console.log("registerMenuManager");
  // 菜单
  // TODO: 增加检测新版本菜单
  // TODO: 设置icon
  const name = app.getName();
  // const version = app.getVersion();
  const template: MenuItemConstructorOptions[] = [
    // {
    //   label: "网页",
    //   submenu: [
    //     {
    //       label: "网页版",
    //       click: function () {
    //         // TODO:替换端口
    //         shell.openExternal("http://localhost:9011");
    //       },
    //     },
    //     {
    //       label: "隔空传送",
    //       click: function () {
    //         // TODO:替换端口
    //         shell.openExternal("http://localhost:9012");
    //       },
    //     },
    //   ],
    // },
    // {
    //   label: "文件",
    //   submenu: [
    //     {
    //       label: "发起会话",
    //       click: function () {
    //         // mainWindow.webContents.send('open-new-window', 'new-window');
    //         console.log("TODO: 发起会话");
    //       },
    //     },
    //     {
    //       label: "关闭",
    //       click: function () {
    //         mainWindow.close();
    //       },
    //     },
    //   ],
    // },
    {
      label: "编辑",
      submenu: [
        { accelerator: "CmdOrCtrl+Z", role: "undo" },
        { accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { type: "separator" },
        { accelerator: "CmdOrCtrl+X", role: "cut" },
        { accelerator: "CmdOrCtrl+C", role: "copy" },
        { accelerator: "CmdOrCtrl+V", role: "paste" },
        { accelerator: "CmdOrCtrl+A", role: "selectAll" },
      ],
    },
    {
      label: "视图",
      submenu: [
        {
          label: "截图",
          accelerator: "CmdOrCtrl+Shift+A",
          click: function () {
            const screenshots = createScreenshot(mainWindow);
            screenshots.startCapture();
          },
        },
        {
          label: "隐藏当前窗口截图",
          accelerator: "CmdOrCtrl+Shift+B",
          click: function () {
            // 隐藏当前窗口截图
            mainWindow.hide();
            const screenshots = createScreenshot(mainWindow);
            screenshots.startCapture();
          },
        },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { role: "resetZoom" },
        { type: "separator" },
        { accelerator: "CmdOrCtrl+R", role: "reload" },
        { accelerator: "CmdOrCtrl+Shift+R", role: "forceReload" },
        { 
          label: "调试窗口",
          accelerator: "CmdOrCtrl+I", 
          // role: "toggleDevTools",
          click: function () {
            // mainWindow.webContents.toggleDevTools();
            mainWindow.webContents.openDevTools({ mode: "detach" });
          },
         },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "帮助",
      role: "help",
      submenu: [
        {
          label: "官网",
          // accelerator: 'Command+A',
          click: function () {
            shell.openExternal("https://www.weiyuai.cn");
          },
        },
        {
          label: "文档",
          accelerator: "Command+H",
          click: function () {
            shell.openExternal("https://www.weiyuai.cn/docs/zh-CN/");
          },
        },
        {
          label: "下载",
          accelerator: "Command+D",
          click: function () {
            shell.openExternal("https://www.weiyuai.cn/download.html");
          },
        },
        {
          type: "separator",
        },
        {
          label: "退出",
          accelerator: "Command+Q",
          click: function () {
            // isAppQuit = true;
            // isAppQuit = true;
            setIsAppQuitting(true);
            app.quit();
            // app.quit();
            // app.exit(0); // FIXME: windows客户端在退出程序之后，查看任务管理器，还存在运行中线程，并提示新消息，添加此行尝试完善
          },
        },
      ],
    },
  ];
  // 经测试：仅在mac下起作用，在win32点击菜单无效
  if (process.platform === "darwin") {
    template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          click: () => showAboutDialog(mainWindow)
        },
        {
          type: "separator",
        },
        // {
        //   label: "代理设置...",
        //   click: () => {
        //     console.log("TODO: 代理设置");
        //     // message.warning("TODO: 即将上线，敬请期待");
        //     dialog
        //       .showMessageBox({
        //         title: "提示",
        //         message: "代理设置功能即将上线，敬请期待！",
        //         type: "info", // 可以是 'none', 'info', 'error', 'warning' 或 'question'
        //       })
        //       .then((result) => {
        //         console.log("对话框已关闭，用户选择：", result.response);
        //       })
        //       .catch((err) => {
        //         console.error("显示对话框时出错：", err);
        //       });
        //   },
        // },
        {
          type: "separator",
        },
        {
          label: `隐藏`,
          accelerator: "Command+H",
          role: "hide",
        },
        {
          label: "显示",
          role: "unhide",
        },
        {
          type: "separator",
        },
        {
          label: "意见反馈",
          click: () => {
            shell.openExternal("https://www.weiyuai.cn/contact.html");
          },
        },
        {
          type: "separator",
        },
        {
          label: "退出",
          accelerator: "Command+Q",
          click: function () {
            // isAppQuit = true;
            setIsAppQuitting(true);
            app.quit();
          },
        },
      ],
    });
  }
  // TODO: 添加帮助菜单：检查更新、关于、反馈、帮助
  // 测试阶段暂时停用
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
