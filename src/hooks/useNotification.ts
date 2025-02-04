/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 22:25:16
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-11 11:48:16
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 获取浏览器通知权限
import { IS_ELECTRON, NETWORK_STATUS_NOTIFICATION } from "@/utils/constants";
import {
  isWindowActive,
  showElectronNotification,
} from "@/utils/electronApiUtils";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import useTranslate from "./useTranslate";

function useNotification() {
  const isNetworkOnline = useNetworkStatus();
  const { translateString } = useTranslate();
  const [isNotificationGranted, setIsNotificationGranted] =
    useState<boolean>(false);
  const [isBrowserTabHidden, setIsBrowserTabHidden] = useState(false);

  const showNotification = async (title, content) => {
    if (IS_ELECTRON) {
      const isActive = await isWindowActive();
      if (!isActive) {
        // 显示桌面通知
        //  console.log("handleNewMessage not isWindowActive");
        showElectronNotification(title, content);
      } else {
        console.log("handleNewMessage isWindowActive");
      }
    } else {
      if (isBrowserTabHidden) {
        // 显示浏览器通知
        // console.log("handleNewMessage isBrowserTabHidden");
        showWebNotification(title, content);
      } else {
        console.log("handleNewMessage not isBrowserTabHidden");
      }
    }
  };

  // 显示通知
  // http://javascript.ruanyifeng.com/bom/notification.html
  const showWebNotification = (title, content) => {
    // this.notificationGranted(result)
    console.log("showWebNotification");
    var notification = new Notification(title, {
      // dir: 'auto',
      // lang: 'zh-CN',
      body: content,
      // tag: 'tag',
      icon: "./logo.png",
    });
    // notification.title // '收到新邮件'
    // notification.body // '您总共有3封未读邮件。'
    //
    notification.onshow = function () {
      console.log("Notification shown");
      // 自动关闭
      // setTimeout(notification.close.bind(notification), 5000)
    };
    //
    notification.onclick = function () {
      console.log("notification click");
      // notification.close() //不需要手动关闭，点击之后自会关闭
    };
    //
    notification.onclose = function () {
      console.log("notification close");
    };
    //
    notification.onerror = function () {
      console.log("notification error");
    };
  };

  useEffect(() => {
    if (!IS_ELECTRON) {
      if (window.Notification && Notification.permission !== "granted") {
        //
        Notification.requestPermission(function (status) {
          if (status === "granted") {
            // console.log("Notification permission granted.");
            setIsNotificationGranted(true);
          } else {
            // console.log("notification denied");
            setIsNotificationGranted(false);
          }
        });
      } else {
        console.log("已经授权或浏览器不支持通知");
        setIsNotificationGranted(true);
      }
      //
      document.addEventListener(
        "visibilitychange",
        () => {
          // console.log("visibilitychange:", document.visibilityState);
          if (document.visibilityState === "hidden") {
            // console.log("隐藏");
            setIsBrowserTabHidden(true);
            // TODO: 在隐藏当前tab之后，收到新消息时需要页面tab标题滚动
          } else if (document.visibilityState === "visible") {
            // console.log("显示");
            setIsBrowserTabHidden(false);
            // this.shouldScrollBrowserTitle = false
            // this.restoreBrowserTitle();
          }
        },
        false,
      );
    }

    return () => {
      document.removeEventListener("visibilitychange", () => {});
    };
  }, []);

  //
  useEffect(() => {
    console.log("useNotification useEffect isNetworkOnline", isNetworkOnline);
    if (isNetworkOnline) {
      //
      const showNetNotif = localStorage.getItem(NETWORK_STATUS_NOTIFICATION);
      if (showNetNotif == null || showNetNotif === "true") {
        showNotification(
          translateString("i18n.tip.title"),
          translateString("i18n.tip.network.disconnected"),
        );
      }
    } else {
      //
      const showNetNotif = localStorage.getItem(NETWORK_STATUS_NOTIFICATION);
      if (showNetNotif == null || showNetNotif === "true") {
        showNotification(
          translateString("i18n.tip.title"),
          translateString("i18n.tip.network.connected"),
        );
      }
    }
  }, [isNetworkOnline]);

  return {
    isNotificationGranted,
    showWebNotification,
    showNotification,
  };
}

export default useNotification;
