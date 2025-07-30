// vite.config.ts
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "file:///Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.9_less@4.4.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.19/node_modules/@vitejs/plugin-react/dist/index.js";
import { createHtmlPlugin } from "file:///Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.4.19/node_modules/vite-plugin-html/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/apps/desktop";
var vite_config_default = defineConfig(({ command, mode }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  console.log("isServe:", isServe, "isBuild:", isBuild, "sourcemap:", sourcemap);
  const isElectron = mode === "electron" || process.env.VITE_APP_ENV === "electron";
  console.log("isElectron:", isElectron, "mode:", mode);
  return {
    // 根据环境设置不同的 base
    base: isElectron ? "./" : "/agent",
    // Electron 使用相对路径，Web 使用 /agent
    resolve: {
      alias: {
        "@": path.join(__vite_injected_original_dirname, "src")
      }
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
      // }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            isElectron
          }
        }
      })
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
      "process.env": process.env,
      // 注入构建时间
      __BUILD_TIME__: JSON.stringify((/* @__PURE__ */ new Date()).toISOString())
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
        output: {
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return "assets/[name]-[hash][extname]";
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            } else if (/\.(css|less|scss|sass)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "css";
            }
            return `${isElectron ? "" : "agent/"}assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: `${isElectron ? "" : "agent/"}assets/js/[name]-[hash].js`,
          entryFileNames: `${isElectron ? "" : "agent/"}assets/js/[name]-[hash].js`
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmluZ2ppbnBlbmcvRGVza3RvcC9naXQvcHJpdmF0ZS9naXRodWIvYnl0ZWRlc2stZnJvbnRlbmQtcHJpdmF0ZS9hcHBzL2Rlc2t0b3BcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9uaW5namlucGVuZy9EZXNrdG9wL2dpdC9wcml2YXRlL2dpdGh1Yi9ieXRlZGVzay1mcm9udGVuZC1wcml2YXRlL2FwcHMvZGVza3RvcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbmluZ2ppbnBlbmcvRGVza3RvcC9naXQvcHJpdmF0ZS9naXRodWIvYnl0ZWRlc2stZnJvbnRlbmQtcHJpdmF0ZS9hcHBzL2Rlc2t0b3Avdml0ZS5jb25maWcudHNcIjsvKlxuICogQEF1dGhvcjogamFja25pbmcgMjcwNTgwMTU2QHFxLmNvbVxuICogQERhdGU6IDIwMjQtMDEtMTMgMDI6Mzk6NDlcbiAqIEBMYXN0RWRpdG9yczogamFja25pbmcgMjcwNTgwMTU2QHFxLmNvbVxuICogQExhc3RFZGl0VGltZTogMjAyNS0wNy0yMSAyMjoyMjoyM1xuICogQERlc2NyaXB0aW9uOiBieXRlZGVzay5jb20gaHR0cHM6Ly9naXRodWIuY29tL0J5dGVkZXNrL2J5dGVkZXNrXG4gKiAgIFBsZWFzZSBiZSBhd2FyZSBvZiB0aGUgQlNMIGxpY2Vuc2UgcmVzdHJpY3Rpb25zIGJlZm9yZSBpbnN0YWxsaW5nIEJ5dGVkZXNrIElNIFx1MjAxM1xuICogIHNlbGxpbmcsIHJlc2VsbGluZywgb3IgaG9zdGluZyBCeXRlZGVzayBJTSBhcyBhIHNlcnZpY2UgaXMgYSBicmVhY2ggb2YgdGhlIHRlcm1zIGFuZCBhdXRvbWF0aWNhbGx5IHRlcm1pbmF0ZXMgeW91ciByaWdodHMgdW5kZXIgdGhlIGxpY2Vuc2UuXG4gKiAgXHU0RUM1XHU2NTJGXHU2MzAxXHU0RjAxXHU0RTFBXHU1MTg1XHU5MEU4XHU1NDU4XHU1REU1XHU4MUVBXHU3NTI4XHVGRjBDXHU0RTI1XHU3OTgxXHU3OUMxXHU4MUVBXHU3NTI4XHU0RThFXHU5NTAwXHU1NTJFXHUzMDAxXHU0RThDXHU2QjIxXHU5NTAwXHU1NTJFXHU2MjE2XHU4MDA1XHU5MEU4XHU3RjcyU2FhU1x1NjVCOVx1NUYwRlx1OTUwMFx1NTUyRVxuICogIEJ1c2luZXNzIFNvdXJjZSBMaWNlbnNlIDEuMTogaHR0cHM6Ly9naXRodWIuY29tL0J5dGVkZXNrL2J5dGVkZXNrL2Jsb2IvbWFpbi9MSUNFTlNFXG4gKiAgY29udGFjdDogMjcwNTgwMTU2QHFxLmNvbVxuICogXHU4MDU0XHU3Q0ZCXHVGRjFBMjcwNTgwMTU2QHFxLmNvbVxuICogQ29weXJpZ2h0IChjKSAyMDI0IGJ5IGJ5dGVkZXNrLmNvbSwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuaW1wb3J0IHsgcm1TeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24tdml0ZS92aXRlLXBsdWdpbi1lbGVjdHJvblxuLy8gaW1wb3J0IGVsZWN0cm9uIGZyb20gXCJ2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGVcIjtcbi8vIGltcG9ydCBwa2cgZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIHJtU3luYyhcImRpc3QtZWxlY3Ryb25cIiwgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pO1xuICAvL1xuICBjb25zdCBpc1NlcnZlID0gY29tbWFuZCA9PT0gXCJzZXJ2ZVwiO1xuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gXCJidWlsZFwiO1xuICBjb25zdCBzb3VyY2VtYXAgPSBpc1NlcnZlIHx8ICEhcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHO1xuICAvLyBjb25zdCBpc0VsZWN0cm9uUHJvZCA9IGlzQnVpbGQgJiYgIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRztcbiAgLy8gY29uc3QgY29uZmlnRW52ID0gaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ09ORklHX0VOViB8fCBcInByb2RcIjtcbiAgLy8gY29uc29sZS5sb2coXCJjb25maWdFbnZcIiwgY29uZmlnRW52KTtcbiAgY29uc29sZS5sb2coXCJpc1NlcnZlOlwiLCBpc1NlcnZlLCBcImlzQnVpbGQ6XCIsIGlzQnVpbGQsIFwic291cmNlbWFwOlwiLCBzb3VyY2VtYXApO1xuICAvLyBcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTY2MkYgRWxlY3Ryb24gXHU2Nzg0XHU1RUZBXG4gIGNvbnN0IGlzRWxlY3Ryb24gPSBtb2RlID09PSAnZWxlY3Ryb24nIHx8IHByb2Nlc3MuZW52LlZJVEVfQVBQX0VOViA9PT0gJ2VsZWN0cm9uJztcbiAgY29uc29sZS5sb2coXCJpc0VsZWN0cm9uOlwiLCBpc0VsZWN0cm9uLCBcIm1vZGU6XCIsIG1vZGUpO1xuICAvLyBcbiAgcmV0dXJuIHtcbiAgICAvLyBcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdThCQkVcdTdGNkVcdTRFMERcdTU0MENcdTc2ODQgYmFzZVxuICAgIGJhc2U6IGlzRWxlY3Ryb24gPyAnLi8nIDogJy9hZ2VudCcsIC8vIEVsZWN0cm9uIFx1NEY3Rlx1NzUyOFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NFx1RkYwQ1dlYiBcdTRGN0ZcdTc1MjggL2FnZW50XG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICAvLyBcdTVGMDBcdTU0MkYgRWxlY3Ryb24gXHU4QzAzXHU4QkQ1XG4gICAgICAvLyBlbGVjdHJvbih7XG4gICAgICAvLyAgIG1haW46IHtcbiAgICAgIC8vICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQubGliLmVudHJ5YFxuICAgICAgLy8gICAgIGVudHJ5OiBcImVsZWN0cm9uL21haW4vaW5kZXgudHNcIixcbiAgICAgIC8vICAgICBvbnN0YXJ0KGFyZ3MpIHtcbiAgICAgIC8vICAgICAgIGlmIChwcm9jZXNzLmVudi5WU0NPREVfREVCVUcpIHtcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJbc3RhcnR1cF0gRWxlY3Ryb24gQXBwXCIsXG4gICAgICAvLyAgICAgICAgICk7XG4gICAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgICAgLy8gICAgICAgICBhcmdzLnN0YXJ0dXAoKTtcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHZpdGU6IHtcbiAgICAgIC8vICAgICAgIGJ1aWxkOiB7XG4gICAgICAvLyAgICAgICAgIHNvdXJjZW1hcCxcbiAgICAgIC8vICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxuICAgICAgLy8gICAgICAgICBvdXREaXI6IFwiZGlzdC1lbGVjdHJvbi9tYWluXCIsXG4gICAgICAvLyAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoXG4gICAgICAvLyAgICAgICAgICAgICBcImRlcGVuZGVuY2llc1wiIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSxcbiAgICAgIC8vICAgICAgICAgICApLFxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgfSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICBwcmVsb2FkOiB7XG4gICAgICAvLyAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxuICAgICAgLy8gICAgIC8vIFByZWxvYWQgc2NyaXB0cyBtYXkgY29udGFpbiBXZWIgYXNzZXRzLCBzbyB1c2UgdGhlIGBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0YCBpbnN0ZWFkIGBidWlsZC5saWIuZW50cnlgLlxuICAgICAgLy8gICAgIGlucHV0OiBcImVsZWN0cm9uL3ByZWxvYWQvaW5kZXgudHNcIixcbiAgICAgIC8vICAgICB2aXRlOiB7XG4gICAgICAvLyAgICAgICBidWlsZDoge1xuICAgICAgLy8gICAgICAgICBzb3VyY2VtYXA6IHNvdXJjZW1hcCA/IFwiaW5saW5lXCIgOiB1bmRlZmluZWQsIC8vICMzMzJcbiAgICAgIC8vICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxuICAgICAgLy8gICAgICAgICBvdXREaXI6IFwiZGlzdC1lbGVjdHJvbi9wcmVsb2FkXCIsXG4gICAgICAvLyAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoXG4gICAgICAvLyAgICAgICAgICAgICBcImRlcGVuZGVuY2llc1wiIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSxcbiAgICAgIC8vICAgICAgICAgICApLFxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgfSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICAvLyBQbG95ZmlsbCB0aGUgRWxlY3Ryb24gYW5kIE5vZGUuanMgQVBJIGZvciBSZW5kZXJlciBwcm9jZXNzLlxuICAgICAgLy8gICAvLyBJZiB5b3Ugd2FudCB1c2UgTm9kZS5qcyBpbiBSZW5kZXJlciBwcm9jZXNzLCB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgbmVlZHMgdG8gYmUgZW5hYmxlZCBpbiB0aGUgTWFpbiBwcm9jZXNzLlxuICAgICAgLy8gICAvLyBTZWUgXHVEODNEXHVEQzQ5IGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi12aXRlL3ZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXG4gICAgICAvLyAgIHJlbmRlcmVyOiB7fSxcbiAgICAgIC8vIH0pLFxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaXNFbGVjdHJvbjogaXNFbGVjdHJvblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgXSxcbiAgICAvLyBcdTUzMDVcdTU0MkJcdTU5MDRcdTc0MDYgQ1NTIFx1NjU4N1x1NEVGNlx1NzY4NFx1OTE0RFx1N0Y2RVxuICAgIC8vIGNzczoge1xuICAgIC8vICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgIC8vICAgICBzY3NzOiB7XG4gICAgLy8gICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwic3JjL3BhZ2VzL0Rhc2hib2FyZC9Ib21lL2NoYXRQYWdlLmNzc1wiO2BcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfVxuICAgIC8vIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAncHJvY2Vzcy5lbnYnOiBwcm9jZXNzLmVudixcbiAgICAgIC8vIFx1NkNFOFx1NTE2NVx1Njc4NFx1NUVGQVx1NjVGNlx1OTVGNFxuICAgICAgX19CVUlMRF9USU1FX186IEpTT04uc3RyaW5naWZ5KG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSksXG4gICAgfSxcbiAgICAvLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL3NlcnZlci1vcHRpb25zXG4gICAgLy8gZWxlY3Ryb25cdThDMDNcdThCRDUsIHByb2Nlc3MuZW52XHU2RDRGXHU4OUM4XHU1NjY4XHU3M0FGXHU1ODgzXHU0RTBEXHU1M0VGXHU3NTI4XG4gICAgLy8gc2VydmVyOlxuICAgIC8vICAgcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHICYmXG4gICAgLy8gICAoKCkgPT4ge1xuICAgIC8vICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBrZy5kZWJ1Zy5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCk7XG4gICAgLy8gICAgIHJldHVybiB7XG4gICAgLy8gICAgICAgaG9zdDogdXJsLmhvc3RuYW1lLFxuICAgIC8vICAgICAgIHBvcnQ6ICt1cmwucG9ydCxcbiAgICAvLyAgICAgfTtcbiAgICAvLyAgIH0pKCksXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA5MDA1XG4gICAgfSxcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXG4gICAgLy8gb3B0aW1pemVEZXBzOiB7IGV4Y2x1ZGU6IFtcImZzZXZlbnRzXCJdIH0sXG4gICAgLy8gb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gICBleGNsdWRlOiBbXCJAZmZtcGVnL2ZmbXBlZ1wiLCBcIkBmZm1wZWcvdXRpbFwiXSxcbiAgICAvLyB9LFxuICAgIC8vIGh0dHBzOi8vY24udml0ZWpzLmRldi9ndWlkZS9idWlsZCNtdWx0aS1wYWdlLWFwcFxuICAgIC8vIF9fZGlybmFtZSBcdTc2ODRcdTUwM0NcdTRFM0Egdml0ZS5jb25maWcuanMgXHU2NTg3XHU0RUY2XHU2MjQwXHU1NzI4XHU3Njg0XHU3NkVFXHU1RjU1XG4gICAgLy8gYnVpbGQ6IHtcbiAgICAvLyAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAvLyAgICAgaW5wdXQ6IHtcbiAgICAvLyAgICAgICBpbmRleDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAvLyAgICAgICAvLyBzY3JlZW5SZWNvcmRlcjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2NvbXBvbmVudHMvU2NyZWVuUmVjb3JkZXIvaW5kZXguaHRtbFwiLCksXG4gICAgLy8gICAgICAgLy8gcmVjb3JkZXJTY3JlZW46IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9wYWdlcy9yZWNvcmRlclNjcmVlbi5odG1sXCIpLFxuICAgIC8vICAgICB9LFxuICAgIC8vICAgfSxcbiAgICAvLyAgIG91dERpcjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKSxcbiAgICAvLyB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGV4dGVybmFsOiBbL15zcmNcXC9lbnRyaWVzXFwvLiovXSxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm86IHsgdHlwZTogc3RyaW5nOyBuYW1lPzogc3RyaW5nOyBzb3VyY2U/OiBzdHJpbmcgfCBVaW50OEFycmF5IH0pID0+IHtcbiAgICAgICAgICAgIGlmICghYXNzZXRJbmZvLm5hbWUpIHJldHVybiAnYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gYXNzZXRJbmZvLm5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGxldCBleHRUeXBlID0gaW5mb1tpbmZvLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgICBpZiAoL1xcLihtcDR8d2VibXxvZ2d8bXAzfHdhdnxmbGFjfGFhYykoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xuICAgICAgICAgICAgICBleHRUeXBlID0gJ21lZGlhJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcLihwbmd8anBlP2d8Z2lmfHN2Z3xpY298d2VicCkoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xuICAgICAgICAgICAgICBleHRUeXBlID0gJ2ltZyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9cXC4od29mZjI/fGVvdHx0dGZ8b3RmKShcXD8uKik/JC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XG4gICAgICAgICAgICAgIGV4dFR5cGUgPSAnZm9udHMnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFwuKGNzc3xsZXNzfHNjc3N8c2FzcykoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xuICAgICAgICAgICAgICBleHRUeXBlID0gJ2Nzcyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBgJHtpc0VsZWN0cm9uID8gJycgOiAnYWdlbnQvJ31hc3NldHMvJHtleHRUeXBlfS9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBgJHtpc0VsZWN0cm9uID8gJycgOiAnYWdlbnQvJ31hc3NldHMvanMvW25hbWVdLVtoYXNoXS5qc2AsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IGAke2lzRWxlY3Ryb24gPyAnJyA6ICdhZ2VudC8nfWFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzYCxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFjQSxTQUFTLGNBQWM7QUFDdkIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUlsQixTQUFTLHdCQUF3QjtBQXJCakMsSUFBTSxtQ0FBbUM7QUF3QnpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDakQsU0FBTyxpQkFBaUIsRUFBRSxXQUFXLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFFeEQsUUFBTSxVQUFVLFlBQVk7QUFDNUIsUUFBTSxVQUFVLFlBQVk7QUFDNUIsUUFBTSxZQUFZLFdBQVcsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUkzQyxVQUFRLElBQUksWUFBWSxTQUFTLFlBQVksU0FBUyxj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
