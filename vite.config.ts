/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-13 02:39:49
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-20 12:46:21
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://github.com/electron-vite/vite-plugin-electron
// import electron from "vite-plugin-electron/simple";
// import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  //
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  // const isElectronProd = isBuild && !process.env.VSCODE_DEBUG;
  // const configEnv = import.meta.env.VITE_CONFIG_ENV || "prod";
  // console.log("configEnv", configEnv);
  console.log("isServe:", isServe, "isBuild:", isBuild, "sourcemap:", sourcemap);
  // 
  return {
    base: "/agent", // web端打包
    // base: "./", // 客户端打包
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    plugins: [
      react(),
      // 开启 Electron 调试
      // electron({
      //   main: {
      //     // Shortcut of `build.lib.entry`
      //     entry: "electron/main/index.ts",
      //     onstart(args) {
      //       if (process.env.VSCODE_DEBUG) {
      //         console.log("[startup] Electron App",
      //         );
      //       } else {
      //         args.startup();
      //       }
      //     },
      //     vite: {
      //       build: {
      //         sourcemap,
      //         minify: isBuild,
      //         outDir: "dist-electron/main",
      //         rollupOptions: {
      //           external: Object.keys(
      //             "dependencies" in pkg ? pkg.dependencies : {},
      //           ),
      //         },
      //       },
      //     },
      //   },
      //   preload: {
      //     // Shortcut of `build.rollupOptions.input`.
      //     // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
      //     input: "electron/preload/index.ts",
      //     vite: {
      //       build: {
      //         sourcemap: sourcemap ? "inline" : undefined, // #332
      //         minify: isBuild,
      //         outDir: "dist-electron/preload",
      //         rollupOptions: {
      //           external: Object.keys(
      //             "dependencies" in pkg ? pkg.dependencies : {},
      //           ),
      //         },
      //       },
      //     },
      //   },
      //   // Ployfill the Electron and Node.js API for Renderer process.
      //   // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      //   // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      //   renderer: {},
      // }) as any,
    ],
    // 包含处理 CSS 文件的配置
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "src/pages/Dashboard/Home/chatPage.css";`
    //     }
    //   }
    // },
    define: {
      'process.env': process.env
    },
    // https://vitejs.dev/config/server-options
    // electron调试, process.env浏览器环境不可用
    // server:
    //   process.env.VSCODE_DEBUG &&
    //   (() => {
    //     const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
    //     return {
    //       host: url.hostname,
    //       port: +url.port,
    //     };
    //   })(),
    server: {
      port: 9005
    },
    clearScreen: false,
    // optimizeDeps: { exclude: ["fsevents"] },
    // optimizeDeps: {
    //   exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    // },
    // https://cn.vitejs.dev/guide/build#multi-page-app
    // __dirname 的值为 vite.config.js 文件所在的目录
    // build: {
    //   rollupOptions: {
    //     input: {
    //       index: resolve(__dirname, "index.html"),
    //       // screenRecorder: resolve(__dirname, "src/components/ScreenRecorder/index.html",),
    //       // recorderScreen: resolve(__dirname, "src/pages/recorderScreen.html"),
    //     },
    //   },
    //   outDir: resolve(__dirname, "dist"),
    // },
    build: {
      rollupOptions: {
        external: [/^src\/entries\/.*/],
      }
    },
  };
});
