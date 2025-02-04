/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-02 13:22:42
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-06 16:23:20
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
// https://socket.io/docs/v4/tutorial/step-1
import { BrowserWindow } from "electron";
import express from "express";
// import cors from "cors";
import http from "node:http";
import { Server } from "socket.io";

// https://expressjs.com/en/starter/hello-world.html
// const app = express();
// app.use(
//   cors({
//     origin: "*",
//   }),
// );
// TODO: 端口可配置
// const port = process.env.DROP_PORT || 9014;
const port = 9014;
// 

// app.get("/", (req, res) => {
//   res.send("<h1>Hello SocketIO</h1>");
// });

//
function startSocketIoServer(mainWindow: BrowserWindow) {
    //
    // http://localhost:9014/
    // let httpServer = http.createServer(app);
    // httpServer.listen(port);
    //
    // let socketServer = new Server(httpServer);
    let socketServer = new Server({
      cors: {
        origin: "*",
      },
    });
    socketServer.listen(port);
    socketServer.on("connection", (socket) => {
        console.log("a socketio client connected");
        
        socket.on("disconnect", () => {
          console.log("a socketio client disconnected");
        });
    });
    //
    console.log("SocketIO is running on port", port);
    // return httpServer;
}

export default {
  startSocketIoServer
};