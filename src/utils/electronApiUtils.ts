/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-27 14:51:46
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 17:39:18
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 统一将electronAPI放到此处调用，用于函数内部区分是否运行在electron环境下

import { IS_ELECTRON } from "./constants";
// import emitter from "./eventEmitter";


const openDocs = () => {
  const url = "https://www.weiyuai.cn/docs/zh-CN/";
  openUrl(url);
};

const openUrl = (url: string) => {
  if (IS_ELECTRON) {
    window.electronAPI.openUrl(url);
  } else {
    window.open(url, "_blank");
  }
};

const sendMulticastMessage = (message: string) => {
  if (message === null || message === "") return;
  if (IS_ELECTRON) {
    window.electronAPI.sendMulticastMessage(message);
  } else {
    console.log("not electron");
  }
}

const sendNotificationMessage = (message: string) => {
  if (message === null || message === "") return;
  if (IS_ELECTRON) {
    window.electronAPI.sendNotificationMessage(message);
  } else {
    console.log("not electron");
  }
}

const getSystemInfo = async () => {
  if (IS_ELECTRON) {
    const systemInfo = await window.electronAPI.getSystemInfo();
    console.log("systemInfo:", systemInfo);
  } else {
    console.log("not electron");
    return {
      platform: "web",
    };
  }
};

const getIpAddress = async () => {
  if (IS_ELECTRON) {
    const ipAddress: string[] = await window.electronAPI.getIpAddress();
    // console.log("ipAddress:", ipAddress);
    return ipAddress;
  } else {
    console.log("not electron");
    return [];
  }
};

const isWindowActive = async () => {
  if (IS_ELECTRON) {
    const isWindowActive = await window.electronAPI.isWindowActive();
    console.log("isWindowActive:", isWindowActive);
    return isWindowActive;
  }
  return null;
};

const showElectronNotification = (title: string, body: string) => {
  if (IS_ELECTRON) {
    window.electronAPI.showElectronNotification(title, body);
  }
};

const setThemeModeElectron = (value: string) => {
  // 设置electron主题模式
  if (IS_ELECTRON) {
    window.electronAPI.setThemeMode(value);
  } else {
    console.log("not electron");
  }
};

const requestMicrophoneAccess = async () => {
  // 请求麦克风权限
  if (IS_ELECTRON) {
    const status = await window.electronAPI.requestMediaAccess('microphone');
    console.log("requestMicrophoneAccess:", status);
  } else {
    console.log("not electron");
  }
}

const requestCameraAccess = async () => {
  // 请求摄像头权限
  if (IS_ELECTRON) {
    const status = await window.electronAPI.requestMediaAccess('camera');
    console.log("requestCameraAccess:", status);
  } else {
    console.log("not electron");
  }
}

const createNewWindow = (content: string) => {
  if (IS_ELECTRON) {
    window.electronAPI.createNewWindow(content);
  } else {
    console.log("not electron");
  }
}

const startCaptureScreen = () => {
  if (IS_ELECTRON) {
    window.electronAPI.screenshotCapture();
  } else {
    console.log("not electron");
    // getShotScreenImg();
  }
}

// async function getShotScreenImg() {
//   navigator.mediaDevices
//     .getDisplayMedia({ video: true })
//     .then((stream) => {
//       const canvas = document.createElement("canvas");
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;

//       const videoElement = document.createElement("video");
//       videoElement.srcObject = stream;
//       videoElement.play();

//       videoElement.addEventListener("loadedmetadata", () => {
//         const context = canvas.getContext("2d");
//         context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
//         // 将canvas的内容转化为PNG格式的DataURL
//         const dataURL = canvas.toDataURL("image/png");
//         console.log("dataURL:", dataURL);
//         // emitter.emit(EVENT_BUS_SCREEN_CAPTURE_IMAGE, dataURL);
//         // setScreenShotImg(canvas.toDataURL("image/png"));
//         stream.getTracks().forEach((track) => track.stop());
//       });
//     })
//     .catch((error) => {
//       console.error("Error accessing screen:", error);
//     });
// }

const loginSuccess = () => { 
  if (IS_ELECTRON) {
    window.electronAPI.loginSuccess();
  }
}

const logoutSuccess = () => {
  if (IS_ELECTRON) {
    window.electronAPI.logoutSuccess();
  }
};

const testPuppeteer = () => {
  if (IS_ELECTRON) {
    window.electronAPI.testPuppeteer();
  } else {
    console.log("not electron");
  }
}

export {
  openDocs,
  openUrl,
  sendMulticastMessage,
  getSystemInfo,
  getIpAddress,
  isWindowActive,
  showElectronNotification,
  setThemeModeElectron,
  requestMicrophoneAccess,
  requestCameraAccess,
  createNewWindow,
  startCaptureScreen,
  loginSuccess,
  logoutSuccess,
  testPuppeteer,
};
