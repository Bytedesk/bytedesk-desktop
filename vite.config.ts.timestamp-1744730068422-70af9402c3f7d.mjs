// vite.config.ts
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "file:///Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.9_less@4.2.1_lightningcss@1.22.1_sass@1.83.4_sugarss@2.0.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.11_@types+node@20.17.9_less@4.2.1_lightningcss@1.22.1_sas_hpazd2gimt6fhazn2kg4kuzyqm/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { createHtmlPlugin } from "file:///Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.4.11_@types+node@20.17.9_less@4.2.1_lightningcss@1.22.1_sass@1._u7xc5pfg22uty5gzqw52pp56eq/node_modules/vite-plugin-html/dist/index.mjs";
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
      "process.env": process.env
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmluZ2ppbnBlbmcvRGVza3RvcC9naXQvcHJpdmF0ZS9naXRodWIvYnl0ZWRlc2stZnJvbnRlbmQtcHJpdmF0ZS9hcHBzL2Rlc2t0b3BcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9uaW5namlucGVuZy9EZXNrdG9wL2dpdC9wcml2YXRlL2dpdGh1Yi9ieXRlZGVzay1mcm9udGVuZC1wcml2YXRlL2FwcHMvZGVza3RvcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbmluZ2ppbnBlbmcvRGVza3RvcC9naXQvcHJpdmF0ZS9naXRodWIvYnl0ZWRlc2stZnJvbnRlbmQtcHJpdmF0ZS9hcHBzL2Rlc2t0b3Avdml0ZS5jb25maWcudHNcIjsvKlxuICogQEF1dGhvcjogamFja25pbmcgMjcwNTgwMTU2QHFxLmNvbVxuICogQERhdGU6IDIwMjQtMDEtMTMgMDI6Mzk6NDlcbiAqIEBMYXN0RWRpdG9yczogamFja25pbmcgMjcwNTgwMTU2QHFxLmNvbVxuICogQExhc3RFZGl0VGltZTogMjAyNS0wMy0yNyAxNjo1NToxN1xuICogQERlc2NyaXB0aW9uOiBieXRlZGVzay5jb20gaHR0cHM6Ly9naXRodWIuY29tL0J5dGVkZXNrL2J5dGVkZXNrXG4gKiAgIFBsZWFzZSBiZSBhd2FyZSBvZiB0aGUgQlNMIGxpY2Vuc2UgcmVzdHJpY3Rpb25zIGJlZm9yZSBpbnN0YWxsaW5nIEJ5dGVkZXNrIElNIFx1MjAxM1xuICogIHNlbGxpbmcsIHJlc2VsbGluZywgb3IgaG9zdGluZyBCeXRlZGVzayBJTSBhcyBhIHNlcnZpY2UgaXMgYSBicmVhY2ggb2YgdGhlIHRlcm1zIGFuZCBhdXRvbWF0aWNhbGx5IHRlcm1pbmF0ZXMgeW91ciByaWdodHMgdW5kZXIgdGhlIGxpY2Vuc2UuXG4gKiAgXHU0RUM1XHU2NTJGXHU2MzAxXHU0RjAxXHU0RTFBXHU1MTg1XHU5MEU4XHU1NDU4XHU1REU1XHU4MUVBXHU3NTI4XHVGRjBDXHU0RTI1XHU3OTgxXHU3OUMxXHU4MUVBXHU3NTI4XHU0RThFXHU5NTAwXHU1NTJFXHUzMDAxXHU0RThDXHU2QjIxXHU5NTAwXHU1NTJFXHU2MjE2XHU4MDA1XHU5MEU4XHU3RjcyU2FhU1x1NjVCOVx1NUYwRlx1OTUwMFx1NTUyRVxuICogIEJ1c2luZXNzIFNvdXJjZSBMaWNlbnNlIDEuMTogaHR0cHM6Ly9naXRodWIuY29tL0J5dGVkZXNrL2J5dGVkZXNrL2Jsb2IvbWFpbi9MSUNFTlNFXG4gKiAgY29udGFjdDogMjcwNTgwMTU2QHFxLmNvbVxuICogXHU4MDU0XHU3Q0ZCXHVGRjFBMjcwNTgwMTU2QHFxLmNvbVxuICogQ29weXJpZ2h0IChjKSAyMDI0IGJ5IGJ5dGVkZXNrLmNvbSwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqL1xuaW1wb3J0IHsgcm1TeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24tdml0ZS92aXRlLXBsdWdpbi1lbGVjdHJvblxuLy8gaW1wb3J0IGVsZWN0cm9uIGZyb20gXCJ2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGVcIjtcbi8vIGltcG9ydCBwa2cgZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIHJtU3luYyhcImRpc3QtZWxlY3Ryb25cIiwgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pO1xuICAvL1xuICBjb25zdCBpc1NlcnZlID0gY29tbWFuZCA9PT0gXCJzZXJ2ZVwiO1xuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gXCJidWlsZFwiO1xuICBjb25zdCBzb3VyY2VtYXAgPSBpc1NlcnZlIHx8ICEhcHJvY2Vzcy5lbnYuVlNDT0RFX0RFQlVHO1xuICAvLyBjb25zdCBpc0VsZWN0cm9uUHJvZCA9IGlzQnVpbGQgJiYgIXByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRztcbiAgLy8gY29uc3QgY29uZmlnRW52ID0gaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ09ORklHX0VOViB8fCBcInByb2RcIjtcbiAgLy8gY29uc29sZS5sb2coXCJjb25maWdFbnZcIiwgY29uZmlnRW52KTtcbiAgY29uc29sZS5sb2coXCJpc1NlcnZlOlwiLCBpc1NlcnZlLCBcImlzQnVpbGQ6XCIsIGlzQnVpbGQsIFwic291cmNlbWFwOlwiLCBzb3VyY2VtYXApO1xuICAvLyBcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTY2MkYgRWxlY3Ryb24gXHU2Nzg0XHU1RUZBXG4gIGNvbnN0IGlzRWxlY3Ryb24gPSBtb2RlID09PSAnZWxlY3Ryb24nIHx8IHByb2Nlc3MuZW52LlZJVEVfQVBQX0VOViA9PT0gJ2VsZWN0cm9uJztcbiAgY29uc29sZS5sb2coXCJpc0VsZWN0cm9uOlwiLCBpc0VsZWN0cm9uLCBcIm1vZGU6XCIsIG1vZGUpO1xuICAvLyBcbiAgcmV0dXJuIHtcbiAgICAvLyBcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdThCQkVcdTdGNkVcdTRFMERcdTU0MENcdTc2ODQgYmFzZVxuICAgIGJhc2U6IGlzRWxlY3Ryb24gPyAnLi8nIDogJy9hZ2VudCcsIC8vIEVsZWN0cm9uIFx1NEY3Rlx1NzUyOFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NFx1RkYwQ1dlYiBcdTRGN0ZcdTc1MjggL2FnZW50XG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICAvLyBcdTVGMDBcdTU0MkYgRWxlY3Ryb24gXHU4QzAzXHU4QkQ1XG4gICAgICAvLyBlbGVjdHJvbih7XG4gICAgICAvLyAgIG1haW46IHtcbiAgICAgIC8vICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQubGliLmVudHJ5YFxuICAgICAgLy8gICAgIGVudHJ5OiBcImVsZWN0cm9uL21haW4vaW5kZXgudHNcIixcbiAgICAgIC8vICAgICBvbnN0YXJ0KGFyZ3MpIHtcbiAgICAgIC8vICAgICAgIGlmIChwcm9jZXNzLmVudi5WU0NPREVfREVCVUcpIHtcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJbc3RhcnR1cF0gRWxlY3Ryb24gQXBwXCIsXG4gICAgICAvLyAgICAgICAgICk7XG4gICAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgICAgLy8gICAgICAgICBhcmdzLnN0YXJ0dXAoKTtcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHZpdGU6IHtcbiAgICAgIC8vICAgICAgIGJ1aWxkOiB7XG4gICAgICAvLyAgICAgICAgIHNvdXJjZW1hcCxcbiAgICAgIC8vICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxuICAgICAgLy8gICAgICAgICBvdXREaXI6IFwiZGlzdC1lbGVjdHJvbi9tYWluXCIsXG4gICAgICAvLyAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoXG4gICAgICAvLyAgICAgICAgICAgICBcImRlcGVuZGVuY2llc1wiIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSxcbiAgICAgIC8vICAgICAgICAgICApLFxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgfSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICBwcmVsb2FkOiB7XG4gICAgICAvLyAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxuICAgICAgLy8gICAgIC8vIFByZWxvYWQgc2NyaXB0cyBtYXkgY29udGFpbiBXZWIgYXNzZXRzLCBzbyB1c2UgdGhlIGBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0YCBpbnN0ZWFkIGBidWlsZC5saWIuZW50cnlgLlxuICAgICAgLy8gICAgIGlucHV0OiBcImVsZWN0cm9uL3ByZWxvYWQvaW5kZXgudHNcIixcbiAgICAgIC8vICAgICB2aXRlOiB7XG4gICAgICAvLyAgICAgICBidWlsZDoge1xuICAgICAgLy8gICAgICAgICBzb3VyY2VtYXA6IHNvdXJjZW1hcCA/IFwiaW5saW5lXCIgOiB1bmRlZmluZWQsIC8vICMzMzJcbiAgICAgIC8vICAgICAgICAgbWluaWZ5OiBpc0J1aWxkLFxuICAgICAgLy8gICAgICAgICBvdXREaXI6IFwiZGlzdC1lbGVjdHJvbi9wcmVsb2FkXCIsXG4gICAgICAvLyAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoXG4gICAgICAvLyAgICAgICAgICAgICBcImRlcGVuZGVuY2llc1wiIGluIHBrZyA/IHBrZy5kZXBlbmRlbmNpZXMgOiB7fSxcbiAgICAgIC8vICAgICAgICAgICApLFxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgfSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICAvLyBQbG95ZmlsbCB0aGUgRWxlY3Ryb24gYW5kIE5vZGUuanMgQVBJIGZvciBSZW5kZXJlciBwcm9jZXNzLlxuICAgICAgLy8gICAvLyBJZiB5b3Ugd2FudCB1c2UgTm9kZS5qcyBpbiBSZW5kZXJlciBwcm9jZXNzLCB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgbmVlZHMgdG8gYmUgZW5hYmxlZCBpbiB0aGUgTWFpbiBwcm9jZXNzLlxuICAgICAgLy8gICAvLyBTZWUgXHVEODNEXHVEQzQ5IGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi12aXRlL3ZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyXG4gICAgICAvLyAgIHJlbmRlcmVyOiB7fSxcbiAgICAgIC8vIH0pLFxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaXNFbGVjdHJvbjogaXNFbGVjdHJvblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgXSxcbiAgICAvLyBcdTUzMDVcdTU0MkJcdTU5MDRcdTc0MDYgQ1NTIFx1NjU4N1x1NEVGNlx1NzY4NFx1OTE0RFx1N0Y2RVxuICAgIC8vIGNzczoge1xuICAgIC8vICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgIC8vICAgICBzY3NzOiB7XG4gICAgLy8gICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwic3JjL3BhZ2VzL0Rhc2hib2FyZC9Ib21lL2NoYXRQYWdlLmNzc1wiO2BcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfVxuICAgIC8vIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAncHJvY2Vzcy5lbnYnOiBwcm9jZXNzLmVudixcbiAgICB9LFxuICAgIC8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvc2VydmVyLW9wdGlvbnNcbiAgICAvLyBlbGVjdHJvblx1OEMwM1x1OEJENSwgcHJvY2Vzcy5lbnZcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODNcdTRFMERcdTUzRUZcdTc1MjhcbiAgICAvLyBzZXJ2ZXI6XG4gICAgLy8gICBwcm9jZXNzLmVudi5WU0NPREVfREVCVUcgJiZcbiAgICAvLyAgICgoKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGtnLmRlYnVnLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKTtcbiAgICAvLyAgICAgcmV0dXJuIHtcbiAgICAvLyAgICAgICBob3N0OiB1cmwuaG9zdG5hbWUsXG4gICAgLy8gICAgICAgcG9ydDogK3VybC5wb3J0LFxuICAgIC8vICAgICB9O1xuICAgIC8vICAgfSkoKSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDkwMDVcbiAgICB9LFxuICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICAvLyBvcHRpbWl6ZURlcHM6IHsgZXhjbHVkZTogW1wiZnNldmVudHNcIl0gfSxcbiAgICAvLyBvcHRpbWl6ZURlcHM6IHtcbiAgICAvLyAgIGV4Y2x1ZGU6IFtcIkBmZm1wZWcvZmZtcGVnXCIsIFwiQGZmbXBlZy91dGlsXCJdLFxuICAgIC8vIH0sXG4gICAgLy8gaHR0cHM6Ly9jbi52aXRlanMuZGV2L2d1aWRlL2J1aWxkI211bHRpLXBhZ2UtYXBwXG4gICAgLy8gX19kaXJuYW1lIFx1NzY4NFx1NTAzQ1x1NEUzQSB2aXRlLmNvbmZpZy5qcyBcdTY1ODdcdTRFRjZcdTYyNDBcdTU3MjhcdTc2ODRcdTc2RUVcdTVGNTVcbiAgICAvLyBidWlsZDoge1xuICAgIC8vICAgcm9sbHVwT3B0aW9uczoge1xuICAgIC8vICAgICBpbnB1dDoge1xuICAgIC8vICAgICAgIGluZGV4OiByZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxuICAgIC8vICAgICAgIC8vIHNjcmVlblJlY29yZGVyOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29tcG9uZW50cy9TY3JlZW5SZWNvcmRlci9pbmRleC5odG1sXCIsKSxcbiAgICAvLyAgICAgICAvLyByZWNvcmRlclNjcmVlbjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3BhZ2VzL3JlY29yZGVyU2NyZWVuLmh0bWxcIiksXG4gICAgLy8gICAgIH0sXG4gICAgLy8gICB9LFxuICAgIC8vICAgb3V0RGlyOiByZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpLFxuICAgIC8vIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgZXh0ZXJuYWw6IFsvXnNyY1xcL2VudHJpZXNcXC8uKi9dLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbzogeyB0eXBlOiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IHNvdXJjZT86IHN0cmluZyB8IFVpbnQ4QXJyYXkgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFhc3NldEluZm8ubmFtZSkgcmV0dXJuICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgbGV0IGV4dFR5cGUgPSBpbmZvW2luZm8ubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgIGlmICgvXFwuKG1wNHx3ZWJtfG9nZ3xtcDN8d2F2fGZsYWN8YWFjKShcXD8uKik/JC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XG4gICAgICAgICAgICAgIGV4dFR5cGUgPSAnbWVkaWEnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFwuKHBuZ3xqcGU/Z3xnaWZ8c3ZnfGljb3x3ZWJwKShcXD8uKik/JC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XG4gICAgICAgICAgICAgIGV4dFR5cGUgPSAnaW1nJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcLih3b2ZmMj98ZW90fHR0ZnxvdGYpKFxcPy4qKT8kL2kudGVzdChhc3NldEluZm8ubmFtZSkpIHtcbiAgICAgICAgICAgICAgZXh0VHlwZSA9ICdmb250cyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9cXC4oY3NzfGxlc3N8c2Nzc3xzYXNzKShcXD8uKik/JC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XG4gICAgICAgICAgICAgIGV4dFR5cGUgPSAnY3NzJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGAke2lzRWxlY3Ryb24gPyAnJyA6ICdhZ2VudC8nfWFzc2V0cy8ke2V4dFR5cGV9L1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGAke2lzRWxlY3Ryb24gPyAnJyA6ICdhZ2VudC8nfWFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzYCxcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogYCR7aXNFbGVjdHJvbiA/ICcnIDogJ2FnZW50Lyd9YXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanNgLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQWNBLFNBQVMsY0FBYztBQUN2QixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBSWxCLFNBQVMsd0JBQXdCO0FBckJqQyxJQUFNLG1DQUFtQztBQXdCekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUNqRCxTQUFPLGlCQUFpQixFQUFFLFdBQVcsTUFBTSxPQUFPLEtBQUssQ0FBQztBQUV4RCxRQUFNLFVBQVUsWUFBWTtBQUM1QixRQUFNLFVBQVUsWUFBWTtBQUM1QixRQUFNLFlBQVksV0FBVyxDQUFDLENBQUMsUUFBUSxJQUFJO0FBSTNDLFVBQVEsSUFBSSxZQUFZLFNBQVMsWUFBWSxTQUFTLGNBQWMsU0FBUztBQUU3RSxRQUFNLGFBQWEsU0FBUyxjQUFjLFFBQVEsSUFBSSxpQkFBaUI7QUFDdkUsVUFBUSxJQUFJLGVBQWUsWUFBWSxTQUFTLElBQUk7QUFFcEQsU0FBTztBQUFBO0FBQUEsSUFFTCxNQUFNLGFBQWEsT0FBTztBQUFBO0FBQUEsSUFDMUIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLEtBQUssa0NBQVcsS0FBSztBQUFBLE1BQ2pDO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BaUROLGlCQUFpQjtBQUFBLFFBQ2YsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFVBQ04sTUFBTTtBQUFBLFlBQ0o7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFTQSxRQUFRO0FBQUEsTUFDTixlQUFlLFFBQVE7QUFBQSxJQUN6QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVlBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWlCYixPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixVQUFVLENBQUMsbUJBQW1CO0FBQUEsUUFDOUIsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCLENBQUMsY0FBNkU7QUFDNUYsZ0JBQUksQ0FBQyxVQUFVLEtBQU0sUUFBTztBQUU1QixrQkFBTSxPQUFPLFVBQVUsS0FBSyxNQUFNLEdBQUc7QUFDckMsZ0JBQUksVUFBVSxLQUFLLEtBQUssU0FBUyxDQUFDO0FBRWxDLGdCQUFJLDZDQUE2QyxLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQ3JFLHdCQUFVO0FBQUEsWUFDWixXQUFXLDBDQUEwQyxLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQ3pFLHdCQUFVO0FBQUEsWUFDWixXQUFXLGtDQUFrQyxLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQ2pFLHdCQUFVO0FBQUEsWUFDWixXQUFXLGtDQUFrQyxLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQ2pFLHdCQUFVO0FBQUEsWUFDWjtBQUVBLG1CQUFPLEdBQUcsYUFBYSxLQUFLLFFBQVEsVUFBVSxPQUFPO0FBQUEsVUFDdkQ7QUFBQSxVQUNBLGdCQUFnQixHQUFHLGFBQWEsS0FBSyxRQUFRO0FBQUEsVUFDN0MsZ0JBQWdCLEdBQUcsYUFBYSxLQUFLLFFBQVE7QUFBQSxRQUMvQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
