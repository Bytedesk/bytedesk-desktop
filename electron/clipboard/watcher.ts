/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-16 11:23:23
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-06 13:06:42
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://www.electronjs.org/docs/latest/api/clipboard
// https://github.com/joshwnj/electron-clipboard-watcher/blob/master/index.js
// https://github.com/kenan2002/electron-clipboard-ex
// https://juejin.cn/post/7155749919419498527
import { clipboard } from "electron";

// "text/plain";
// 'image/png'
// "text/html",
// "application/vnd.code.copymetadata"
// "vscode-editor-data";

// https://github.com/sindresorhus/Pasteboard-Viewer
// private static var typeExclusions = [
// 		"NSStringPboardType": "public.utf8-plain-text",
// 		"NSFilenamesPboardType": "public.file-url",
// 		"NeXT TIFF v4.0 pasteboard type": "public.tiff",
// 		"NeXT Rich Text Format v1.0 pasteboard type": "public.rtf",
// 		"NeXT RTFD pasteboard type": "com.apple.flat-rtfd",
// 		"Apple HTML pasteboard type": "public.html",
// 		"Apple Web Archive pasteboard type": "com.apple.webarchive",
// 		"Apple URL pasteboard type": "public.url",
// 		"Apple PDF pasteboard type": "com.adobe.pdf",
// 		"Apple PNG pasteboard type": "public.png",
// 		"NSColor pasteboard type": "com.apple.cocoa.pasteboard.color",
// 		"iOS rich content paste pasteboard type": "com.apple.uikit.attributedstring"
// 	]

type ClipboardWatcherOptions = {
  watchDelay?: number;
  onTextChange?: (text: string) => void;
  onHtmlChange?: (html: string) => void;
  onImageChange?: (image: Electron.NativeImage) => void;
  onRTFChange?: (rtf: string) => void;
  onBookmarkChange?: (bookmark: Electron.ReadBookmark) => void;
  onFindTextChange?: (findText: string) => void;
};

//
const ClipboardWatcher = (opts: ClipboardWatcherOptions) => {
  opts = opts || {};
  const watchDelay = opts.watchDelay || 1000;

  let lastText = clipboard.readText();
  let lastHtml = clipboard.readHTML();
  let lastImage = clipboard.readImage();
  let lastRTF = clipboard.readRTF();
  let lastBookmark = clipboard.readBookmark();
  let lastFindText = clipboard.readFindText();

  const intervalId = setInterval(() => {
    const text = clipboard.readText();
    const html = clipboard.readHTML();
    const image = clipboard.readImage();
    const rtf = clipboard.readRTF();
    const bookmark = clipboard.readBookmark();
    const findtext = clipboard.readFindText();

    if (opts.onImageChange && imageHasDiff(image, lastImage)) {
      const formats = clipboard.availableFormats();
      console.log("image clipboard formats:", formats); // [ 'text/html', 'image/png' ]
      //
      lastImage = image;
      return opts.onImageChange(image);
    }

    if (opts.onTextChange && textHasDiff(text, lastText)) {
      const formats = clipboard.availableFormats();
      console.log("text clipboard formats:", formats); // [ 'text/html', 'image/png' ]
      //
      lastText = text;
      return opts.onTextChange(text);
    }

    // TODO:
    if (opts.onHtmlChange && htmlHasDiff(html, lastHtml)) {
      lastHtml = html;
      return opts.onHtmlChange(html);
    }

    // TODO:
    if (opts.onRTFChange && rtfHasDiff(rtf, lastRTF)) {
      lastRTF = rtf;
      return opts.onRTFChange(rtf);
    }

    // TODO:
    if (opts.onBookmarkChange && bookmarkHasDiff(bookmark, lastBookmark)) {
      lastBookmark = bookmark;
      return opts.onBookmarkChange(bookmark);
    }

    // TODO:
    if (opts.onFindTextChange && findTextHasDiff(findtext, lastFindText)) {
      lastFindText = findtext;
      return opts.onFindTextChange(findtext);
    }
  }, watchDelay);

  return {
    stop: () => clearInterval(intervalId),
  };
};

/*
Tell if there is any difference between 2 images
*/
function imageHasDiff(a: Electron.NativeImage, b: Electron.NativeImage) {
  return !a.isEmpty() && b.toDataURL() !== a.toDataURL();
}

/*
Tell if there is any difference between 2 strings
*/
function textHasDiff(a, b) {
  return a && b !== a;
}

function htmlHasDiff(a, b) {
  return a && b !== a;
}

function rtfHasDiff(a, b) {
  return a && b !== a;
}

function bookmarkHasDiff(a, b) {
  return a && b !== a;
}

function findTextHasDiff(a, b) {
  return a && b !== a;
}

export default ClipboardWatcher;
