/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-09 10:21:32
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-04-29 12:52:51
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
// import RateLimit from "express-rate-limit";
import http from "node:http";
import { networkInterfaces } from "os";
import { BrowserWindow } from "electron";
import { startPairDropServer } from "./pairdrop";
import conf from "./pairdrop/config";
// import { HTTP_MESSAGE } from "../../utils/constants";
// import websocket from "./websocket";

// https://expressjs.com/en/starter/hello-world.html
const app = express();
// TODO: 端口可配置
const port = process.env.DROP_PORT || 9013;
// 
// if (conf.rateLimit) {
//   const limiter = RateLimit({
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 1000, // Limit each IP to 1000 requests per `window` (here, per 5 minutes)
//     message:
//       "Too many requests from this IP Address, please try again after 5 minutes.",
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   });

//   app.use(limiter);
//   // ensure correct client ip and not the ip of the reverse proxy is used for rate limiting
//   // see https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues

//   app.set("trust proxy", conf.rateLimit);

//   if (!conf.debugMode) {
//     console.log("Use DEBUG_MODE=true to find correct number for RATE_LIMIT.");
//   }
// }
//
// web send files: http://localhost:9013/
app.use("/", express.static(process.env.DIST + "/pairdrop"));
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

if (conf.debugMode && conf.rateLimit) {
  console.debug("\n");
  console.debug("----DEBUG RATE_LIMIT----");
  console.debug(
    "To find out the correct value for RATE_LIMIT go to '/ip' and ensure the returned IP-address is the IP-address of your client.",
  );
  console.debug(
    "See https://github.com/express-rate-limit/express-rate-limit#troubleshooting-proxy-issues for more info",
  );
  app.get("/ip", (req, res) => {
    res.send(req.ip);
  });
}
// app.get("/ip", (_req, res) => {
//   res.json(results);
// });
// By default, clients connecting to your instance use the signaling server of your instance to connect to other devices.
// By using `WS_SERVER`, you can host an instance that uses another signaling server.
app.get('/config', (req, res) => {
    res.send({
        signalingServer: conf.signalingServer,
        buttons: conf.buttons
    });
});
// app.use((req, res) => {
//     res.redirect(301, '/');
// });

//
export function startDropServer(mainWindow: BrowserWindow) {
  //
  // http://localhost:9013/
  let dropServer = http.createServer(app);
  dropServer.listen(port);
  //
  startPairDropServer(dropServer);
  console.log("Pairdrop is running on port", port);
  //
  return dropServer;
}
