/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-13 02:39:49
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-30 14:45:59
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { app, ipcMain } from "electron";
import { createRequire } from "node:module";
import type {
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo,
} from "electron-updater";

const { autoUpdater } = createRequire(import.meta.url)("electron-updater");

export function registerAutoUpdateHandler(mainWindow: Electron.BrowserWindow) {
  console.log("update");

  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = true;
  autoUpdater.disableWebInstaller = false;
  autoUpdater.allowDowngrade = false;

  // start check
  autoUpdater.on("checking-for-update", function () {
    console.log("checking for update");
    // TODO: checking for update message
  });

  // update available
  autoUpdater.on("update-available", (arg: UpdateInfo) => {
    mainWindow.webContents.send("update-can-available", {
      update: true,
      version: app.getVersion(),
      newVersion: arg?.version,
    });
  });

  // update not available
  autoUpdater.on("update-not-available", (arg: UpdateInfo) => {
    mainWindow.webContents.send("update-can-available", {
      update: false,
      version: app.getVersion(),
      newVersion: arg?.version,
    });
  });

  // Checking for updates
  ipcMain.handle("check-update", async () => {
    if (!app.isPackaged) {
      const error = new Error(
        "The update feature is only available after the package.",
      );
      return { message: error.message, error };
    }

    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      return { message: "Network error", error };
    }
  });

  // Start downloading and feedback on progress
  ipcMain.handle("start-download", (event: Electron.IpcMainInvokeEvent) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          // feedback download error message
          event.sender.send("update-error", { message: error.message, error });
        } else {
          // feedback update progress message
          event.sender.send("download-progress", progressInfo);
        }
      },
      () => {
        // feedback update downloaded message
        event.sender.send("update-downloaded");
      },
    );
  });

  // Install now
  ipcMain.handle("quit-and-install", () => {
    autoUpdater.quitAndInstall(false, true);
  });
}

function startDownload(
  callback: (error: Error | null, info: ProgressInfo | null) => void,
  complete: (event: UpdateDownloadedEvent) => void,
) {
  autoUpdater.on("download-progress", (info: ProgressInfo) =>
    callback(null, info),
  );
  autoUpdater.on("error", (error: Error) => callback(error, null));
  autoUpdater.on("update-downloaded", complete);
  autoUpdater.downloadUpdate();
}

export function checkUpdate (mainWindow: Electron.BrowserWindow, ipcMain) {
  autoUpdater.autoDownload = true; // 自动下载
  autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装
  // mainWin = win;
  // 检测是否有更新包并通知
  autoUpdater.checkForUpdatesAndNotify().catch();
  // 监听渲染进程的 install 事件，触发退出应用并安装
  ipcMain.handle('install', () => autoUpdater.quitAndInstall());
};
