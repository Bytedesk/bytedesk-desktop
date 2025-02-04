/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-19 10:26:38
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-06 11:15:57
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// TODO: 蓝牙-聊天
// https://www.electronjs.org/docs/latest/tutorial/devices
import { BrowserWindow, ipcMain } from "electron";

let bluetoothPinCallback;
let selectBluetoothCallback;

export const registerBluetoothManager = (mainWindow: BrowserWindow) => {
  console.log("registerBluetoothManager");
  // TODO: 蓝牙-聊天
  // https://www.electronjs.org/docs/latest/tutorial/devices
  mainWindow.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault();
      selectBluetoothCallback = callback;
      // const result = deviceList.find((device) => {
      //     console.log('bluetooth device:', device.deviceId, device.deviceName);
      //     return device.deviceName === "test";
      // });
      console.log("selectBluetoothDevice", deviceList);
      //   callback(deviceList);
      // if (result) {
      //   callback(result.deviceId);
      // } else {
      //   // The device wasn't found so we need to either wait longer (eg until the
      //   // device is turned on) or until the user cancels the request
      // }
      if (deviceList.length > 0) {
        callback(deviceList[0].deviceId);
      } else {
        // The device wasn't found so we need to either wait longer (eg until the
        // device is turned on) or until the user cancels the request
      }
    },
  );

  ipcMain.on("cancel-bluetooth-request", (event) => {
    console.log("cancel-bluetooth-request", event);
    selectBluetoothCallback("");
  });

  // Listen for a message from the renderer to get the response for the Bluetooth pairing.
  ipcMain.on("bluetooth-pairing-response", (event, response) => {
    console.log("bluetooth-pairing-response", event, response);
    bluetoothPinCallback(response);
  });

  mainWindow.webContents.session.setBluetoothPairingHandler(
    (details, callback) => {
      bluetoothPinCallback = callback;
      // Send a message to the renderer to prompt the user to confirm the pairing.
      // Send a IPC message to the renderer to prompt the user to confirm the pairing.
      // Note that this will require logic in the renderer to handle this message and
      // display a prompt to the user.
      mainWindow.webContents.send("bluetooth-pairing-request", details);
      console.log("bluetooth-pairing-request", details);
    },
  );

  // https://www.electronjs.org/docs/latest/api/session#sessetbluetoothpairinghandlerhandler-windows-linux
  // Listen for an IPC message from the renderer to get the response for the Bluetooth pairing.
  mainWindow.webContents.ipc.on(
    "bluetooth-pairing-response",
    (event, response) => {
      bluetoothPinCallback(response);
      console.log("bluetooth-pairing-response", response);
    },
  );
};
