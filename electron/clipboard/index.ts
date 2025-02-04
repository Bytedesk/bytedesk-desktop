/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-16 11:21:19
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-03-16 12:36:54
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 监听系统剪贴板内容变化
import { clipboard } from "electron";
import ClipboardWatcher from "./watcher";

let clipboardWatcher;

const startClipboardWatcher = () => {
  console.log("startClipboardWatcher");
  clipboardWatcher = ClipboardWatcher({
    // 每隔1秒钟，检查一次 (optional) delay in ms between polls
    watchDelay: 1000,
    // handler for when image data is copied into the clipboard
    onImageChange: function (nativeImage) {
      console.log("onImageChange", nativeImage);
    },
    // handler for when text data is copied into the clipboard
    onTextChange: function (text) {
      console.log("onTextChange", text);
    },
  });
};

// https://www.electronjs.org/zh/docs/latest/api/clipboard
const copyText = (content: string) => {
  console.log("copyText", content);
  clipboard.writeText(content);
};

const copyImage = (image: Electron.NativeImage) => {
  console.log("copyImage", image);
  clipboard.writeImage(image);
};

const copyFile = (filepath: string) => {
  console.log("copyFile", filepath);
  clipboard.writeBuffer(
    "public.file-url",
    Buffer.from(`file://${encodeURI(filepath)}`, "utf-8"),
  );
};

const clearClipboard = () => {
  console.log("clearClipboard");
  clipboard.clear();
};

const stopClipboardWatcher = () => {
  console.log("stopClipboardWatcher");
  if (clipboardWatcher) {
    clipboardWatcher.stop();
  }
};

//
export default {
  startClipboardWatcher,
  copyText,
  copyImage,
  copyFile,
  clearClipboard,
  stopClipboardWatcher,
};
