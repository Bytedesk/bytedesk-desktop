/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 22:43:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-07 17:19:13
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// const winston = require("winston");
import winston from "winston";

const loggerMain = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "weiyu.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  loggerMain.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
export default loggerMain;