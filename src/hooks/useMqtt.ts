/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-05 11:17:42
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-14 08:00:47
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { useAuthStore } from "@/stores/core/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  mqttConnect,
  mqttConnected,
  mqttDisconnect,
} from "@/network/mqtt";
import { useNetworkStatus } from "./useNetworkStatus";
import { useUserStore } from "@/stores/core/user";
import {
  EVENT_BUS_MQTT_CONNECTED,
  I18N_NEW_MESSAGE,
  EVENT_BUS_MQTT_MESSAGE,
  EVENT_BUS_MQTT_CLOSE,
  EVENT_BUS_MQTT_DISCONNECTED,
  EVENT_BUS_MQTT_OFFLINE,
  EVENT_BUS_MQTT_ERROR,
  EVENT_BUS_MQTT_END,
  MESSAGE_TYPE_STREAM,
  MESSAGE_TYPE_CONTINUE,
  MESSAGE_TYPE_AUTO_CLOSED,
  MESSAGE_TYPE_AGENT_CLOSED,
  MESSAGE_TYPE_SYSTEM,
} from "@/utils/constants";
import emitter from "@/utils/eventEmitter";
import { playAudio } from "@/utils/utils";
import useTranslate from "./useTranslate";
import useNotification from "./useNotification";
import { useAgentStore } from "@/stores/service/agent";
import { useThreadStore } from "@/stores/core/thread";

function useMqtt() {
  // const isConnecting = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInfo);
  const agentInfo = useAgentStore((state) => state.agentInfo);
  const isNetworkOnline = useNetworkStatus();
  const [isMqttConnected, setMqttConnected] = useState(false);
  const { showNotification } = useNotification();
  const { translateString } = useTranslate();
  const threads = useThreadStore((state) => state.threads);
  const [threadList, setThreadList] = useState(threads);

  const autoCheckConnection = useCallback(() => {
    if (isNetworkOnline && accessToken) {
      return setInterval(() => {
        console.log("useMqtt autoCheckConnection");
        if (!mqttConnected() && isNetworkOnline && accessToken) {
          doConnect();
        }
      }, 10000);
    } else {
      console.log(
        "useMqtt autoCheckConnection isNetworkOnline:",
        isNetworkOnline,
        " accessToken:",
        accessToken,
      );
    }
  }, [isNetworkOnline, accessToken]);

  // const getAgentMessageUnread = async (uid: string) => {
  //   if (isLoadingUnreadMessage.current) {
  //     console.log(
  //       "useMqtt getAgentMessageUnread isLoadingUnreadMessage:",
  //       isLoadingUnreadMessage,
  //     );
  //     return;
  //   }
  //   isLoadingUnreadMessage.current = true;
  //   // 拉取未读消息
  //   const responseMessageList = await getMessageUnread(uid);
  //   console.log("getAgentMessageUnread response:", responseMessageList?.data);
  //   responseMessageList?.data?.data?.forEach((item) => {
  //     console.log("getAgentMessageUnread item:", item);
  //     addMessage(item);
  //     const thread = updateThreadContent(item.threadTopic, item.content);
  //     // 发送送达回执
  //     if (thread) {
  //       mqttSendReceiptReceivedMessage(item?.uid, thread);
  //     }
  //   });
  //   isLoadingUnreadMessage.current = false;
  // };

  const getPingUnread = async () => {
    // console.log("isPingLoading", isPingLoading);
    // if (isPingLoading) {
    //   console.log("useMqtt getPingUnread isPingLoading:", isPingLoading);
    //   return;
    // }
    // setPingLoading(true);
    // //
    // const response = await sendPingMessage(currentUidRef.current);
    // console.log(
    //   "useMqtt autoPingMessage response:",
    //   currentUidRef.current,
    //   response?.data,
    // );
    // if (response?.data?.data > 0) {
    //   // 拉取未读消息
    //   getAgentMessageUnread(currentUidRef.current);
    // }
    // setPingLoading(false);
    // console.log("isPingLoading", isPingLoading);
  };

  // 假设 userInfo 和 agentInfo 是已经定义好的状态或变量，包含 uid 属性
  // 假设 sendPingMessage, isMqttConnected, accessToken 也是已经定义好的

  // 使用 useRef 创建一个 ref 变量来存储 currentUid
  const currentUidRef = useRef(agentInfo?.uid);

  const autoPingMessage = useCallback(() => {
    // 已经登录，而且长连接断开的情况下，自动发送心跳包
    if (!isMqttConnected && accessToken) {
      // 清除之前的定时器（如果有的话），避免重复设置定时器
      // 假设你有一个清除定时器的逻辑，这里用 clearIntervalAsNeeded 代表
      // clearIntervalAsNeeded();
      return setInterval(async () => {
        // 使用 currentUidRef.current 代替 currentUid
        if (currentUidRef.current) {
          // getPingUnread(currentUidRef.current);
          // setPingLoading(isPingLoading => !isPingLoading);
          getPingUnread();
        } else {
          console.log(
            "useMqtt autoPingMessage currentUidRef.current:",
            currentUidRef.current,
          );
        }
        // 修改 ref 的值
        // currentUidRef.current =
        //   currentUidRef.current === userInfo?.uid
        //     ? agentInfo?.uid
        //     : userInfo?.uid;
      }, 10000);
    } else {
      console.log(
        "useMqtt autoPingMessage isNetworkOnline:",
        isNetworkOnline,
        " accessToken:",
        accessToken,
      );
    }
  }, [isMqttConnected, accessToken, userInfo, agentInfo]); // 依赖项中添加了 currentUid, userInfo?.uid, agentInfo?.uid

  const doConnect = () => {
    console.log("useMqtt doConnect");
    mqttConnect({
      uid: userInfo.uid,
      username: userInfo.username,
      accessToken,
    });
  };

  const doDisconnect = () => {
    console.log("useMqtt useEffect doDisconnect");
    mqttDisconnect();
  };

  const handlePlayAudio = (message: MESSAGE.MessageResponse) => {
    if (message?.type === MESSAGE_TYPE_AUTO_CLOSED) {
      return
    }
    // 
    if (message?.user?.uid !== userInfo?.uid &&
      message?.user?.uid !== agentInfo?.uid) {
      // 播放提示音
      playAudio();
      console.log("playAudio");
    }
  };

  //
  useEffect(() => {
    console.log("useMqtt useEffect isNetworkOnline", isNetworkOnline);
    if (isNetworkOnline) {
      doConnect();
    } else {
      mqttDisconnect();
    }
  }, [isNetworkOnline]);

  useEffect(() => {
    if (agentInfo?.uid) {
      currentUidRef.current = agentInfo?.uid;
      const autoPing = autoPingMessage();
      // 
      return () => {
        clearInterval(autoPing);
      };
    } else {
      currentUidRef.current = null;
    }
  }, [agentInfo]);

  useEffect(() => {
    console.log("useMqtt useEffect accessToken");
    doConnect();
    const autoCheck = autoCheckConnection();
    //
    return () => {
      mqttDisconnect();
      clearInterval(autoCheck);
    };
  }, [accessToken, userInfo]);

  useEffect(() => {
    console.log("useMqtt threads change");
    setThreadList(threads);
  }, [threads]);

  useEffect(() => {
    const handleNewMessage = function (message: MESSAGE.MessageResponse) {
      console.log("useMqtt handleNewMessage", message);
      // 机器人stream消息不显示通知
      if (message.type === MESSAGE_TYPE_STREAM ||
        message.type === MESSAGE_TYPE_SYSTEM ||
        message.type === MESSAGE_TYPE_CONTINUE ||
        message.type === MESSAGE_TYPE_AUTO_CLOSED ||
        message.type === MESSAGE_TYPE_AGENT_CLOSED
      ) {
        return;
      }
      const threadTopic = message.threadTopic;
      //
      // 暂时不显示具体消息内容，只显示新消息提示，否则图片会显示连接地址
      // 查找与消息主题匹配的thread，并检查其mute属性
      const matchingThread = threadList.find(
        (thread) => thread.topic === threadTopic,
      );
      // 如果没有找到匹配的thread
      if (!matchingThread) {
        console.log("useMqtt matchingThread no");
        // 调用showNotification来显示通知，可以是不同的通知或者相同的通知
        showNotification(
          translateString(I18N_NEW_MESSAGE),
          translateString(I18N_NEW_MESSAGE),
        );
        //
        handlePlayAudio(message);
      } else if (!matchingThread.mute) {
        console.log("useMqtt matchingThread no mute", threadTopic);
        // 如果找到了匹配的thread且其mute属性为false，则显示通知
        showNotification(
          translateString(I18N_NEW_MESSAGE),
          translateString(I18N_NEW_MESSAGE),
        );
        //
        handlePlayAudio(message);
      } else {
        console.log("useMqtt matchingThread muted", threadTopic);
      }
    };
    emitter.on(EVENT_BUS_MQTT_MESSAGE, handleNewMessage);

    return () => {
      emitter.off(EVENT_BUS_MQTT_MESSAGE);
    };
  }, [threadList]);

  useEffect(() => {
    console.log("useMqtt useEffect");
    // console.log("hash:", hash, " pathname:", pathname, " search:", search);
    //
    const handleMqttConnected = function () {
      console.log("handleMqttConnected");
      setMqttConnected(true);
    };
    const handleMqttDisconnected = function () {
      console.log("handleMqttDisconnected");
      setMqttConnected(false);
    };
    emitter.on(EVENT_BUS_MQTT_CONNECTED, handleMqttConnected);
    emitter.on(EVENT_BUS_MQTT_CLOSE, handleMqttDisconnected);
    emitter.on(EVENT_BUS_MQTT_DISCONNECTED, handleMqttDisconnected);
    emitter.on(EVENT_BUS_MQTT_OFFLINE, handleMqttDisconnected);
    emitter.on(EVENT_BUS_MQTT_ERROR, handleMqttDisconnected);
    emitter.on(EVENT_BUS_MQTT_END, handleMqttDisconnected);
    //
    return () => {
      console.log("un - useEffect mqttDisconnect");
      // emitter.off(EVENT_BUS_MULTICAST_MESSAGE_RECEIVED)
      emitter.off(EVENT_BUS_MQTT_CONNECTED);
      emitter.off(EVENT_BUS_MQTT_CLOSE);
      emitter.off(EVENT_BUS_MQTT_DISCONNECTED);
      emitter.off(EVENT_BUS_MQTT_OFFLINE);
      emitter.off(EVENT_BUS_MQTT_ERROR);
      emitter.off(EVENT_BUS_MQTT_END);
    };
  }, []);

  // useEffect(() => {
  //    console.log("useMqtt useEffect");
  //   const autoCheck = autoCheckConnection();
  //   return () => {
  //     clearInterval(autoCheck);
  //   };
  // }, []);

  return {
    doConnect,
    doDisconnect,
    isMqttConnected,
  };
}

export default useMqtt;
