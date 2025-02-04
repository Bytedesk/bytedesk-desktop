/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-09 11:09:57
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-06 15:58:24
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://www.npmjs.com/package/ws
// https://github.com/websockets/ws/tree/master/examples
import { BrowserWindow } from "electron";
// import { WEBSOCKET_MESSAGE } from "../../../utils/constants";
import WebSocket from "ws";

// 
let socketClient: WebSocket;
// TODO: 端口可配置
const address = "localhost";

export function connectWebSocketServer(mainWindow: BrowserWindow, port: any) {
  console.log("connectWebSocketServer");
  //
  socketClient = new WebSocket(`ws://${address}:${port}`, {
    // perMessageDeflate: false,
  });
  // 
  socketClient.on("open", () => {
    console.log("websocket client open");
    // 
    sendMessage();
  });
  // 
  socketClient.on("message", (data: any, isBinary: boolean) => {
    const message = isBinary ? data : data.toString();
    console.log(`websocket client receive message: ${message}, isBinary ${isBinary}`);
    // mainWindow.webContents.send(WEBSOCKET_MESSAGE, message);
    //
    // setTimeout(function timeout() {
    //   sendMessage();
    // }, 5000);
  });
  // 
  socketClient.on("close", () => {
    console.log("websocket client close");
    // clearTimeout(pingTimeout);
  });
  // 
  socketClient.on("error", (error) => {
    console.log("websocket client error", error);
  });
  // 
  socketClient.on("open", () => {
    console.log("websocket client open");
    // heartbeat();
  });
  // 
  socketClient.on("ping", () => {
    console.log("websocket client ping");
    // heartbeat();
  });
  //
  
  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  // let pingTimeout = setTimeout(() => {
  //   socketClient.terminate();
  // }, 10000 + 1000);

  // function heartbeat() {
  //   console.log("websocket client heartbeat");
  //   sendMessage();

  //   // clearTimeout(pingTimeout);

  //   // Use `WebSocket#terminate()`, which immediately destroys the connection,
  //   // instead of `WebSocket#close()`, which waits for the close timer.
  //   // Delay should be equal to the interval at which your server
  //   // sends out pings plus a conservative assumption of the latency.
  //   // pingTimeout = setTimeout(() => {
  //   //   socketClient.terminate();
  //   // }, 10000 + 1000);
  // }
}

export function sendMessage() {
  let data = Date.now();
  console.log("websocket desktop client send message:", data);
  socketClient.send(`desktop client ${data}`);
}

export function isConnected() {
  return socketClient && socketClient.readyState === socketClient.OPEN;
}

export function isConnecting() {
  return socketClient && socketClient.readyState === socketClient.CONNECTING;
}