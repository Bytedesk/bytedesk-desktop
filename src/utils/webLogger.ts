/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-03 12:42:44
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-07 17:17:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://github.com/winstonjs/winston
// const winston = require('winston');
import winston from "winston";

const loggerRender = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  //   browser
  transports: [new winston.transports.Console()],
  //   no browser
  //   transports: [
  //     new winston.transports.File({ filename: 'error.log', level: 'error' }),
  //     new winston.transports.File({ filename: 'combined.log' }),
  //   ],
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  loggerRender.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default loggerRender;
