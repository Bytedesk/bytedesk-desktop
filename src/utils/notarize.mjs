/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-21 16:26:06
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-30 12:05:29
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
// https://github.com/electron/notarize
// https://www.npmjs.com/package/@electron/notarize
// https://github.com/electron-userland/electron-builder/issues/8103
// 自定义打包文件名：
// "artifactName": "${productName}-${version}-${os}-${arch}.${ext}"
import { notarize } from '@electron/notarize';
import dotenv from 'dotenv';

// 加载 .env 文件中的环境变量
dotenv.config();

export default async function notarizeApp(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }
  
  const appName = context.packager.appInfo.productFilename;
  console.log('notarize: ', appName, process.env.APP_BUNDLE_ID);

  if (!process.env.APP_BUNDLE_ID || !process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
    throw new Error('Missing required environment variables for notarization');
  }

  await notarize({
    appBundleId: process.env.APP_BUNDLE_ID,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
}