/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-09 10:21:32
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-01 21:08:56
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
import http from "node:http";
import { networkInterfaces } from "os";
import { BrowserWindow } from "electron";
import { startSnapdropServer } from "./snapdrop";
// import { HTTP_MESSAGE } from "../../utils/constants";
// import websocket from "./websocket";

// https://expressjs.com/en/starter/hello-world.html
const app = express();
// TODO: 端口可配置
const port = process.env.DROP_PORT || 9012;
//
// web send files: http://localhost:9012/
app.use("/", express.static(process.env.DIST + "/snapdrop"));
//
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
    if (net.family === familyV4Value && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

// http://localhost:9012/ip
app.get("/ip", (_req, res) => {
  res.json(results);
});

//
export function startDropServer(mainWindow: BrowserWindow) {
  //
  // http://localhost:9012/
  let dropServer = http.createServer(app);
  dropServer.listen(port);
  //
  startSnapdropServer(dropServer);
  console.log("Snapdrop is running on port", port);
  // websocket.server.startWebSocketServer(mainWindow, dropServer);
  // websocket.client.connectWebSocketServer(mainWindow, port);
  //
  return dropServer;
}
