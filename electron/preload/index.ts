import { ipcRenderer, contextBridge } from "electron";
import {
  HTTP_MESSAGE,
  MULTICAST_MESSAGE,
  NOTIFICATION_MESSAGE,
  WEBSOCKET_MESSAGE,
} from "../utils/constants";
// import testPuppeteer from "electron/puppet";
// import { requestMediaAccess } from "electron/main/requestMediaAccess";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", withPrototype(ipcRenderer));
// 设置窗口标题
contextBridge.exposeInMainWorld("electronAPI", {
  // https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
  open: () => ipcRenderer.send("shell:open"),
  //
  setTitle: (title) => ipcRenderer.send("set-title", title),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  chooseImage: () => ipcRenderer.invoke("dialog:chooseImage"),
  openUrl: (url) => ipcRenderer.send("url:open", url),
  //
  screenshotCapture: () => ipcRenderer.send("screenshot:capture"),
  //
  showRightPanel: (show) => ipcRenderer.send("right-panel:show", show),
  //
  setOpenAtLogin: (openAtLogin) =>
    ipcRenderer.send("open-at-login:set", openAtLogin),
  getOpenAtLogin: () => ipcRenderer.invoke("open-at-login:get"),
  //
  setThemeMode: (mode) => ipcRenderer.send("theme-mode:set", mode),
  // toggleTheme: () => ipcRenderer.invoke('dark-mode:toggle'),
  // systemTheme: () => ipcRenderer.invoke('dark-mode:system'),
  requestMediaAccess: (mediaType) =>
    ipcRenderer.invoke("request-media-access", mediaType),
  //
  loginSuccess: () => ipcRenderer.send("login:success"),
  logoutSuccess: () => ipcRenderer.send("logout:success"),
  //
  getSystemInfo: () => ipcRenderer.invoke("system:info"),
  getIpAddress: () => ipcRenderer.invoke("system:ip"),
  isWindowActive: () => ipcRenderer.invoke("window-is-active"),
  showElectronNotification: (title, content) =>
    ipcRenderer.send("notification:show", title, content),
  //
  startDrag: (fileName) => ipcRenderer.send("ondragstart", fileName),
  //
  cancelBluetoothRequest: () => ipcRenderer.send("cancel-bluetooth-request"),
  bluetoothPairingRequest: (callback) =>
    ipcRenderer.on("bluetooth-pairing-request", () => callback()),
  bluetoothPairingResponse: (response) =>
    ipcRenderer.send("bluetooth-pairing-response", response),
  //
  createNewWindow: (content) => ipcRenderer.send("create-new-window", content),
  onNewWindowCreated: (callback) =>
    ipcRenderer.on("initialize-window", (_event, value) => callback(value)),
  offNewWindowCreated: () =>
    ipcRenderer.removeAllListeners("initialize-window"),
  //
  sendMulticastMessage: (message) =>
    ipcRenderer.send(MULTICAST_MESSAGE, message),
  // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererremovelistenerchannel-listener
  onMulticastMessage: (callback) =>
    ipcRenderer.on(MULTICAST_MESSAGE, (_event, value) => callback(value)),
  offMulticastMessage: (callback) =>
    ipcRenderer.off(MULTICAST_MESSAGE, callback),
  offMulticastMessageAll: () =>
    ipcRenderer.removeAllListeners(MULTICAST_MESSAGE),
  //
  sendWebSocketMessage: (message) =>
    ipcRenderer.send(WEBSOCKET_MESSAGE, message),
  onWebSocketMessage: (callback) =>
    ipcRenderer.on(WEBSOCKET_MESSAGE, (_event, value) => callback(value)),
  offWebSocketMessage: (callback) =>
    ipcRenderer.off(WEBSOCKET_MESSAGE, callback),
  offWebSocketMessageAll: () =>
    ipcRenderer.removeAllListeners(WEBSOCKET_MESSAGE),
  //
  sendHttpMessage: (message) => ipcRenderer.send(HTTP_MESSAGE, message),
  onHttpMessage: (callback) =>
    ipcRenderer.on(HTTP_MESSAGE, (_event, value) => callback(value)),
  offHttpMessage: (callback) => ipcRenderer.off(HTTP_MESSAGE, callback),
  offHttpMessageAll: () => ipcRenderer.removeAllListeners(HTTP_MESSAGE),
  //
  sendNotificationMessage: (message) =>
    ipcRenderer.send(NOTIFICATION_MESSAGE, message),
  // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererremovelistenerchannel-listener
  onNotificationMessage: (callback) =>
    ipcRenderer.on(NOTIFICATION_MESSAGE, (_event, value) => callback(value)),
  offNotificationMessage: (callback) =>
    ipcRenderer.off(NOTIFICATION_MESSAGE, callback),
  offNotificationMessageAll: () =>
    ipcRenderer.removeAllListeners(NOTIFICATION_MESSAGE),
  //
  testPuppeteer: () => ipcRenderer.send("test-puppeteer"),
});

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === "function") {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

// --------- Preload scripts loading ---------
function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"],
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}
// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 1000);
