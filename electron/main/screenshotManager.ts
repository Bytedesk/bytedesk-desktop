/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-06 13:35:49
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-22 13:23:54
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { BrowserWindow, clipboard, globalShortcut } from "electron";
import Screenshots from "electron-screenshots";
import { NOTIFICATION_MESSAGE, SCREENSHOT_OK } from "../utils/constants";

// https://github.com/nashaofu/screenshots
export const createScreenshot = (mainWindow: BrowserWindow) => {
  // register screen shot
  const screenshots = new Screenshots();
  // const screenshots = new Screenshots({
  //   lang: {
  //     operation_rectangle_title: "矩形2323",
  //   },
  //   singleWindow: true,
  // });
  // screenshots.$view.webContents.openDevTools();
  screenshots.on("windowCreated", ($win) => {
    $win.on("focus", () => {
      globalShortcut.register("esc", () => {
        screenshots.endCapture();
        // 下面判断报错
        // if ($win?.isFocused() && screenshots) {
        //   screenshots.endCapture();
        // }
        globalShortcut.unregister("esc");
      });
    });
    $win.on("blur", () => {
      globalShortcut.unregister("esc");
    });
  });
  // 点击确定按钮回调事件
  screenshots.on("ok", (e, _buffer, _bounds) => {
    console.log("screenshots ok");
    screenshots.endCapture();
    // 截图
    const image = clipboard.readImage();
    // console.log("screenshots image", image);
    const message = {
      type: SCREENSHOT_OK,
      data: image,
    };
    mainWindow.webContents.send(NOTIFICATION_MESSAGE, message);
  });
  // 点击取消按钮回调事件
  screenshots.on("cancel", () => {
    console.log("screenshots cancel");
    screenshots.endCapture();
  });
  // 点击保存按钮回调事件
  screenshots.on("save", (e, _buffer, _bounds) => {
    console.log("screenshots save");
    screenshots.endCapture();
  });
  // 保存后的回调事件
  screenshots.on("afterSave", (e, _buffer, _bounds, isSaved) => {
    console.log("screenshots afterSave");
    console.log("isSaved", isSaved); // 是否保存成功
    screenshots.endCapture();
  });
  //
  return screenshots;
};
