/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-12-19 14:20:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-21 18:32:05
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import { defineConfig } from 'wxt';
// import react from '@vitejs/plugin-react';

const chromeMV3Permissions = [
  "newtab",
  "storage",
  "sidePanel",
  "activeTab",
  "scripting",
  "declarativeNetRequest",
  "action",
  "unlimitedStorage",
  "contextMenus",
  "tts",
  "notifications"
]

const firefoxMV2Permissions = [
  "newtab",
  "storage",
  "activeTab",
  "scripting",
  "unlimitedStorage",
  "contextMenus",
  "webRequest",
  "webRequestBlocking",
  "notifications",
  "http://*/*",
  "https://*/*",
  "file://*/*"
]

// See https://wxt.dev/api/config.html
export default defineConfig({
  // 使用vite报错：The symbol "prevRefreshSig" has already been declared
  // vite: () => ({
  //   plugins: [react()],
  // }),
  // 
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  outDir: "dist-wxt",            // default: ".output"
  // Relative to srcDir
  entrypointsDir: "entries", // default: "entrypoints"
  publicDir: "static",       // default: "public"
  // 
  manifest: {
    version: "1.0.1",
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    action: {},
    commands: {
      _execute_action: {
        description: "Open the Web UI",
        suggested_key: {
          default: "Ctrl+Shift+L"
        }
      },
      execute_side_panel: {
        description: "Open the side panel",
        suggested_key: {
          default: "Ctrl+Shift+P"
        }
      }
    },
    permissions:
      process.env.TARGET === "firefox"
        ? firefoxMV2Permissions
        : chromeMV3Permissions
  },
});
