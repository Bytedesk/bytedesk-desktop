/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-07 10:55:40
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-04 18:10:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { CONTACT_TYPE_DEVICE, EVENT_BUS_SCREEN_CAPTURE_IMAGE, IS_ELECTRON, SCREENSHOT_OK } from "@/utils/constants";
import { useEffect } from "react";
import { useUserStore } from "@/stores/core/user";
import { useContactStore } from "@/stores/core/contact";
import { useNavigate } from "react-router-dom";
import { message } from "@/AntdGlobalComp";
import emitter from "@/utils/eventEmitter";

//
function useElectronApi() {
  console.log("useElectronApi");
  const navigate = useNavigate();
  const userInfo = useUserStore((state) => state.userInfo);
  // const addDevice = useDeviceStore((state) => state.addDevice);
  const addDevice = useContactStore((state) => state.addDevice);

  useEffect(() => {
    console.log("useElectronApi useEffect");
    // 监听来自electron的消息
    if (IS_ELECTRON) {
      // FIXME: 在放大阅读窗口打开之后，会重置主窗口位置，需要去掉此副作用
      window.electronAPI.loginSuccess();
      // 聊天记录右键：放大阅读
      window.electronAPI.onNewWindowCreated((content) => {
        console.log("Dashboard onNewWindowCreated content:", content);
        navigate("/enlarge", { state: { content: content } });
        // 假设 arg 是你想要显示的内容或数据
        // document.body.innerText = content; // 或者根据 arg 更新 DOM 的其他部分
      })
      // 监听来自electron的消息
      window.electronAPI.onMulticastMessage((messageContent) => {
        // console.log("Dashboard onMulticastMessage content:", value);
        const messageObject: MULTICAST.MessageObject = JSON.parse(messageContent);
        if (messageObject.user.uid !== userInfo.uid) {
          // 过滤掉自己广播的消息
          console.log("EVENT_BUS_MULTICAST_MESSAGE_RECEIVED", messageContent);
          // 添加到通讯录
          const contact: CONTACT.Contact = {
            type: CONTACT_TYPE_DEVICE,
            device: messageObject.device,
            // address: messageObject.address,
            user: messageObject.user,
            createdAt: messageObject.createdAt,
          };
          addDevice(contact);
        } else {
          // console.log('receive self multicast')
        }
        // 发送消息到electron-main
        // window.electronAPI.sendMulticastMessage(value);
      });
      window.electronAPI.onWebSocketMessage((messageContent) => {
        console.log("Dashboard onWebSocketMessage content:", messageContent);
        // 发送消息到electron-main
        // window.electronAPI.sendWebSocketMessage(value);
      });
      window.electronAPI.onHttpMessage((messageContent) => {
        console.log("Dashboard onHttpMessage content:", messageContent);
        // 发送消息到electron-main
        // window.electronAPI.sendHttpMessage(value);
      });
      window.electronAPI.onNotificationMessage((messageContent) => {
        console.log("Dashboard onNotificationMessage content:", messageContent);
        if (messageContent.type === SCREENSHOT_OK) {
          message.success("截图成功");
          // 剪贴板图片
          const image = messageContent.data;
          // console.log("图片内容：", image.toDataURL());
          emitter.emit(EVENT_BUS_SCREEN_CAPTURE_IMAGE, image.toDataURL());
        }
      });
    } else {
      console.log("not electron - in browser");
      // checkWebNotification()
    }

    return () => {
      console.log("un - useEffect");
      //
      if (IS_ELECTRON) {
        window.electronAPI.offNewWindowCreated();
        window.electronAPI.offMulticastMessageAll();
        window.electronAPI.offWebSocketMessageAll();
        window.electronAPI.offHttpMessageAll();
        window.electronAPI.offNotificationMessageAll();
      } else {
        console.log("not electron");
      }
    };
    //
  }, []);
}

export default useElectronApi;
