/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-06 13:37:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-01 08:28:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { BrowserWindow, globalShortcut } from "electron";
import { createScreenshot } from "./screenshotManager";

export const registerShortcutHandler = (mainWindow: BrowserWindow) => {
  console.log("registerShortcutHandler");

  const screenshots = createScreenshot(mainWindow);
  // const screenshots = new Screenshots({
  //   lang: {
  //     operation_rectangle_title: "矩形2323",
  //   },
  //   singleWindow: true,
  // });
  // screenshots.$view.webContents.openDevTools();
  globalShortcut.register("CommandOrControl+Shift+A", () => {
    screenshots.startCapture();
    // screenshots.$view.webContents.openDevTools();
  });
  // globalShortcut.register("Esc", () => {
  //   screenshots.endCapture();
  // });
};

export const unregisterGlobalShortcut = () => {
  globalShortcut.unregister("CommandOrControl+Shift+A");
  // globalShortcut.unregister("Esc");
  // globalShortcut.unregister("CommandOrControl+Shift+Q");
};

export const isRegisteredGlobalShortcut = () => {
  return globalShortcut.isRegistered("CommandOrControl+Shift+A");
};
