/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-04 12:15:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-06 16:36:32
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 本地传文件
// https://socket.io/docs/v4/tutorial/introduction
// https://socket.io/how-to/use-with-react
import { io, Socket } from "socket.io-client";

// let socket: Socket = null;
// TODO: 端口可配置
const port = 9014;
// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
export const socketIo: Socket = io(`http://localhost:${port}`, {
  //   autoConnect: false,
});

// function startSocketioClient() {
//     console.log("startSocketioClient");
//     // 
//     socket = io(`http://localhost:${port}`, {
//     //   auth: {
//     //     userid: "111",
//     //     username: "我是接纳端",
//     //     role: "reader",
//     //   },
//     });
//     socket.on("connect", () => {
//       console.log("socketio client connected");
//     });
//     // 
// }

// function stopSocketioClient() {
//     if (socket == null) return;
//     socket.disconnect();
// }

// export default {
//     startSocketioClient,
//     stopSocketioClient
// }