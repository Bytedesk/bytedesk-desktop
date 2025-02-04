/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-06 17:15:50
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-08 15:56:35
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://nodejs.org/api/dgram.html
// import { BrowserWindow } from "electron";

// https://nodejs.org/api/dgram.html
import { BrowserWindow } from "electron";
import { MULTICAST_MESSAGE } from "../../utils/constants";
import dgram from "node:dgram";
// import { Buffer } from "node:buffer";
// import { currentTimestamp } from "../../../src/utils/utils"; 

// TODO: 地址可设置, 224.0.0.0 到 239.255.255.255之间的地址
// TODO: 端口可配置
const address = "230.0.0.0";
const port = 6781;
let socket = null;
// localsend
// const address = "224.0.0.167";
// const port = 5331;

const startMulticastSocket = (mainWindow: BrowserWindow) => {
  console.log("startMulticastClient");

  socket = dgram.createSocket({
    type: "udp4",
    reuseAddr: true, // for testing multiple instances on localhost
  });

  socket.on("message", (messageBinary, rinfo) => {
    const message = messageBinary.toString().trim();
    // const messageObject = JSON.parse(message);
    // messageObject.address = rinfo;
    // let messageObject: MULTICAST.MessageObject = {
    //   user: JSON.parse(message),
    //   address: rinfo,
    // };
    // console.log("multicast receive message:", message, rinfo);
    // push message to the Electron-Renderer
    mainWindow.webContents.send(MULTICAST_MESSAGE, message);
  });

  socket.on("listening", () => {
    const address = socket.address();
    //  socket.setBroadcast(true);
    //  socket.setMulticastTTL(128);
    console.log(
      `multicast server listening ${address.address}:${address.port}`,
    );
  });

  socket.on("connect", () => {
    console.log("multicast server connected");
  });

  socket.on("close", () => {
    console.log("multicast server closed");
  });

  socket.on("error", (err) => {
    console.error(`multicast server error:\n${err.stack}`);
    socket.close();
  });

  socket.bind(port, () => {
    console.log("multicast server bind callback");
    socket.addMembership(address);
    // socket.setMulticastInterface('::%eth1');
  });

  // for testing
  // setInterval(() => {
  //   let message = "Hi from desktop! " + currentTimestamp();
  //   // const message = Buffer.from('Some bytes');
  //   socket.send(message, 0, message.length, port, address, (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   });
  // }, 10000);
};

const sendMutlicastMessage = (message: string) => {
  if (socket) {
    socket.send(message, 0, message.length, port, address, (err) => {
      if (err) {
        console.error(err);
      }
    });
  } else {
    console.log("startMulticastSocket not started");
  }
};

const stopMulticastSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  } else {
    console.log("startMulticastSocket not started");
  }
};

export default {
  startMulticastSocket,
  sendMutlicastMessage,
  stopMulticastSocket,
};
