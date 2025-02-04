/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-09 10:21:32
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-06 15:38:09
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
// https://www.npmjs.com/package/express
import express from "express";
import http, { Server } from "node:http";
import apiv1 from "./controllers/api_v1";
import { BrowserWindow } from "electron";
// import { HTTP_MESSAGE } from "../../utils/constants";
import websocket from "./websocket";
//
// import { dirname } from "node:path";
// import { fileURLToPath } from "node:url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// https://expressjs.com/en/starter/hello-world.html
const app = express();
// TODO: 端口可配置
const port = process.env.IM_PORT || 9011;
//
// web chat: http://localhost:9011/
app.use("/", express.static(process.env.DIST));
app.use("/api/v1", apiv1);
//
export function startImServer(mainWindow: BrowserWindow) {
  //
  // app.get("/", function (req, res) {
  //   // res.send("Hello from desktop http server");
  //   mainWindow.webContents.send(HTTP_MESSAGE, "hello from http message");
  //   //
  //   res.sendFile(process.env.DIST  + "/drop/index.html");
  //   // res.sendFile(__dirname + "/drop/index.html");
  //   // res.sendFile(path.join(__dirname, '/index.html'));
  //   // Sending an HTML file
  //   // res.sendFile("index.html", { root: __dirname });
  //   // Sending an image
  //   // res.sendFile("image.jpg", { root: __dirname + "/public" });
  // });
  //
  // app.post("/", (req, res) => {
  //   res.send("Got a POST request");
  // });
  //
  // http://localhost:9011/
  let imServer: Server = http.createServer(app);
  imServer.listen(port);
  //
  // http://localhost:9011/
  // app.listen(port, () => {
  //   console.log(`http Server running at http://localhost:${port}/`);
  // });

  // 启动websocket服务
  websocket.server.startWebSocketServer(mainWindow, imServer);
  websocket.client.connectWebSocketServer(mainWindow, port);
  

  return imServer;
}
