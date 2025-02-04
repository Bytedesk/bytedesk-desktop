/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-09 11:09:57
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-20 11:34:40
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
import { WEBSOCKET_MESSAGE } from "../../../utils/constants";
import { WebSocketServer } from "ws";
import { Server } from "node:http";

// 
let socketServer: WebSocketServer;
let isAlive: boolean;

export function startWebSocketServer(mainWindow: BrowserWindow, server: Server) {
  console.log("startWebSocketServer");
  //
  socketServer = new WebSocketServer({ server });

  socketServer.on("connection", (socket, request) => {
    isAlive = true;
    const ip = request.socket.remoteAddress;
    console.log(`websocket connection from: ${ip}`);
    // const forwarded_ip = req.headers["x-forwarded-for"].split(",")[0].trim();

    socket.on("message", (data, isBinary) => {
      const message = isBinary ? data : data.toString();
      console.log(
        `websocket receive message: ${message}, isBinary ${isBinary}`,
      );
      // push message to the Electron-Renderer
      mainWindow.webContents.send(WEBSOCKET_MESSAGE, message);
      // 广播给所有客户端
      // wss.clients.forEach(function each(client) {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(message, { binary: isBinary });
      //   }
      // });
      socket.send(`echo:${message}`, (err) => {
        if (err) {
          console.log(`[SERVER] error:${err}`);
        }
      });
    });

    socket.on("close", (code, reason) => {
      console.log("websocket connection closed", code, reason);
    });

    socket.on("error", (error) => {
      console.error("websocket error:", error);
    });
  });

  // socketServer.on("headers", (headers, response) => {
  //   console.log("websocket server headers:", headers, response);
  //   if (
  //     response.headers.cookie &&
  //     response.headers.cookie.indexOf("peerid=") > -1
  //   )
  //     return;
  // });

  socketServer.on("error", (error) => {
    console.error("websocket server error:", error);
  });
}

//
// const interval = setInterval(function ping() {
//   wss.clients.forEach(function each(ws) {
//     if (isAlive === false) return ws.terminate();
//     isAlive = false;
//     ws.ping();
//   });
// }, 10000);
