/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-22 14:37:08
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-21 09:05:25
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import * as constants from "@/utils/constants";
import mqtt, { IClientOptions, Packet } from "mqtt";
//
import { default as messageProto } from "@/network/protobuf/message_pb";
import { default as threadProto } from "@/network/protobuf/thread_pb";
import { default as userProto } from "@/network/protobuf/user_pb";
//
import { useThreadStore } from "@/stores/core/thread";
import { currentTimestamp, getUUid, isOrgGroupTopic, shouldSendReceipt } from "@/utils/utils";
import { useMessageStore } from "@/stores/core/message";
import { useUserStore } from "@/stores/core/user";
import { sendRestMessage } from "@/apis/core/message";
import emitter from "@/utils/eventEmitter";
import { useAgentStore } from "@/stores/service/agent";
import { message } from "@/AntdGlobalComp";
import { getMqttWssHost } from "@/utils/configUtils";
import { myIndexedDb } from "@/db/IndexedDbService";
// import { useIndexedDB } from "@/db/useIndexedDB";

let mqttClient: mqtt.MqttClient;
let userInfo: USER.UserResponse;
let agentInfo: AGENT.AgentResponse;
// let mqttConnectTimes = 0;
let isConnecting = false;

type mqttConnectOptions = {
  uid: string;
  username: string;
  accessToken: string;
};

// https://github.com/mqttjs/MQTT.js
export const mqttConnect = ({
  uid,
  username,
  accessToken,
}: mqttConnectOptions) => {
  // 匿名用户，不连接mqtt
  if (accessToken === "" || accessToken == null) {
    console.log("accessToken is empty, don't connect mqtt");
    return;
  }
  userInfo = useUserStore.getState().userInfo;
  agentInfo = useAgentStore.getState().agentInfo;
  //
  if (isConnecting) {
    console.log("mqtt is connecting");
    return;
  }
  //
  if (mqttClient && mqttClient.connected) {
    console.log("mqtt already connected");
    return;
  }
  if (mqttClient && mqttClient.reconnecting) {
    console.log("mqtt already reconnecting");
    return;
  }
  isConnecting = true;
  const deviceUid = useUserStore.getState().deviceUid;
  const clientId = uid + "/" + constants.HTTP_CLIENT + "/" + deviceUid;
  const options: IClientOptions = {
    keepalive: 30, // 秒，设置0为禁用
    clientId: clientId, // 客户端id 唯一标识你的客户端的身份
    username: username, // 用户名
    password: accessToken, // 密码
    // protocolId: 'MQTT',  // 和下面的参数指定mqtt的版本
    // protocolVersion: 4,
    clean: false, // 设置为 false 可以在离线时接收 QoS 1 和 2 消息；
    path: "/websocket",
    reconnectPeriod: 5000, // ms, 设置多长时间进行重新连接 单位毫秒, 通过设置0禁用自动重新连接。
    connectTimeout: 30 * 1000, // ms, 设置超时时间
    reschedulePings: true, // 发送数据包后重新安排 ping 消息（默认true）
    rejectUnauthorized: false,
    log(...args) {
      if (constants.IS_DEBUG) {
        console.log("mqtt debug log", ...args);
      }
    },
  };
  console.log("mqtt start connect:", options);
  mqttClient = mqtt.connect(getMqttWssHost(), options);

  // on connected
  mqttClient.on("connect", () => {
    console.log("mqtt event connected");
    isConnecting = false;
    emitter.emit(constants.EVENT_BUS_MQTT_CONNECTED);
  });

  // received message
  mqttClient.on("message", async function (topic, messageBinary, packet) {
    console.log("mqtt receive message topic:", topic, packet);
    // 解析protobuf, 解密消息内容
    const messageProtobuf = messageProto.Message.deserializeBinary(messageBinary);
    const currentThread = useThreadStore.getState().currentThread;
    //
    const thread: THREAD.ThreadResponse = {
      uid: messageProtobuf.getThread().getUid(),
      type: messageProtobuf.getThread().getType(),
      topic: messageProtobuf.getThread().getTopic(),
      content: messageProtobuf.getContent(),
      updatedAt: messageProtobuf.getCreatedat(),
      unreadCount: 0,
      user: {
        uid: messageProtobuf.getThread().getUser().getUid(),
        nickname: messageProtobuf.getThread().getUser().getNickname(),
        avatar: messageProtobuf.getThread().getUser().getAvatar(),
      },
    };
    //
    const message: MESSAGE.MessageResponse = {
      uid: messageProtobuf.getUid(),
      createdAt: messageProtobuf.getCreatedat(),
      client: messageProtobuf.getClient(),
      type: messageProtobuf.getType(),
      status: messageProtobuf.getStatus(),
      user: {
        uid: messageProtobuf.getUser().getUid(),
        nickname: messageProtobuf.getUser().getNickname(),
        avatar: messageProtobuf.getUser().getAvatar(),
      },
      // 所有消息类型均放到content里面处理，复杂类型存储json
      content: messageProtobuf.getContent(),
      threadTopic: messageProtobuf.getThread().getTopic(),
    };
    //
    if (!isSelfSent(messageProtobuf, userInfo, agentInfo)) {
      // 非自己发送的消息
      switch (messageProtobuf.getType()) {
        case constants.MESSAGE_TYPE_READ:
        case constants.MESSAGE_TYPE_DELIVERED: // 回执消息
          updateMessageStatus(messageProtobuf);
          return;
        case constants.MESSAGE_TYPE_TYPING:
        case constants.MESSAGE_TYPE_PROCESSING: // 非自己发送的：正在输入
          handleTypingMessage(currentThread, thread, messageProtobuf.getType());
          return;
        case constants.MESSAGE_TYPE_STREAM:
          handleTypingMessage(currentThread, thread, messageProtobuf.getType());
          break;
        case constants.MESSAGE_TYPE_PREVIEW: // 非自己发送的：消息预知
          handlePreviewMessage(messageProtobuf, currentThread, thread);
          return;
        case constants.MESSAGE_TYPE_FAQ_UP:
        case constants.MESSAGE_TYPE_FAQ_DOWN:
        case constants.MESSAGE_TYPE_ROBOT_UP:
        case constants.MESSAGE_TYPE_ROBOT_DOWN:
        case constants.MESSAGE_TYPE_RATE_SUBMIT:
        case constants.MESSAGE_TYPE_RATE_CANCEL:
          // 访客提交评价或取消评价
          updateMessageStatus(messageProtobuf);
          return;
        case constants.MESSAGE_TYPE_TRANSFER: // 转接
          console.log("transfer message");
          handleTransferMessage(message, thread);
          break;
        case constants.MESSAGE_TYPE_TRANSFER_ACCEPT: // 转接被接受
          console.log("transfer accept message");
          handleTransferAcceptMessage(message, thread);
          return;
        case constants.MESSAGE_TYPE_TRANSFER_REJECT: // 转接被拒绝
          console.log("transfer reject message");
          handleTransferRejectMessage(message, thread);
          return;
        case constants.MESSAGE_TYPE_RECALL: // 撤回
          console.log("recall message");
          handleRecallMessage(message);
          return;
        case constants.MESSAGE_TYPE_AUTO_CLOSED: // 自动关闭
        case constants.MESSAGE_TYPE_AGENT_CLOSED: // 客服关闭
          console.log("thread closed message");
          useThreadStore.getState().closeThread(thread.topic);
          break;
        default:
          // 向服务器发送消息送达回执
          console.log("send receive message type", messageProtobuf.getType());
          sendReceiptReceivedMessage(messageProtobuf, currentThread, thread);
      }
    } else {
      // 自己发送的消息
      switch (messageProtobuf.getType()) {
        case constants.MESSAGE_TYPE_READ:
        case constants.MESSAGE_TYPE_DELIVERED:
          // 自己发送的消息回执
          updateMessageStatus(messageProtobuf);
          return;
        case constants.MESSAGE_TYPE_TYPING:
        case constants.MESSAGE_TYPE_PROCESSING:
          // 自己发送的：正在输入
          return;
        case constants.MESSAGE_TYPE_PREVIEW:
          // 自己发送的消息预知
          return;
        case constants.MESSAGE_TYPE_TRANSFER:
          // 转接
          console.log("self transfer message");
          handleTransferMessage(message, thread);
          break;
        case constants.MESSAGE_TYPE_TRANSFER_ACCEPT:
          // 转接被接受
          console.log("self transfer accept message");
          handleTransferAcceptMessage(message, thread);
          return;
        case constants.MESSAGE_TYPE_TRANSFER_REJECT:
          // 转接被拒绝
          console.log("self transfer reject message");
          handleTransferRejectMessage(message, thread);
          return;
        case constants.MESSAGE_TYPE_RECALL: 
          // 撤回
          console.log("self recall message");
          handleRecallMessage(message);
          return;
        case constants.MESSAGE_TYPE_AGENT_CLOSED: 
          // 客服关闭
          console.log("thread closed message");
          useThreadStore.getState().closeThread(thread.topic);
          break;
        default:
          // 收到从服务器返回自己发的消息，发送成功
          messageProtobuf.setStatus(constants.MESSAGE_STATUS_SUCCESS);
      }
    }
    console.log("mqtt message received", topic, message, thread);
    useMessageStore.getState().addMessage(message);
    emitter.emit(constants.EVENT_BUS_MQTT_MESSAGE, message);
    const unreadCount = useThreadStore.getState().addThreadWithMessage(thread, message);
    console.log("unreadCount", unreadCount);
    // TODO:将消息存储到indexedDB

    // 存储消息到 IndexedDB
    try {
      await myIndexedDb.createMessage(message);
      console.log('Sent message stored in IndexedDB:', message);
    } catch (error) {
      console.error('Error storing sent message in IndexedDB:', error);
    }
  });

  // 当MQTT客户端发送一个数据包时，会触发"packetsend"事件。
  mqttClient.on("packetsend", (packet: Packet) => {
    console.log("mqtt event packetsend", packet);
  });

  // 当MQTT客户端接收到一个数据包时，会触发"packetreceive"事件
  mqttClient.on("packetreceive", (packet: Packet) => {
    console.log("mqtt event packetreceive", packet, packet.cmd);
    if (packet.cmd === "publish") {
    //   let messageProtobuf = messageProto.Message.deserializeBinary(packet.payload);
    //   console.log("messageProtobuf", messageProtobuf.getContent());
    } else if (packet.cmd === "pingresp") {
      console.log("mqtt event packetreceive pingresp");
    }
  });

  mqttClient.on("reconnect", () => {
    console.log("mqtt event reconnect");
  });

  mqttClient.on("close", () => {
    console.log("mqtt event close");
    isConnecting = false;
    emitter.emit(constants.EVENT_BUS_MQTT_CLOSE);
  });

  mqttClient.on("disconnect", () => {
    console.error("mqtt event disconnected");
    isConnecting = false;
    emitter.emit(constants.EVENT_BUS_MQTT_DISCONNECTED);
  });

  mqttClient.on("offline", () => {
    console.log("mqtt event offline");
    isConnecting = false;
    emitter.emit(constants.EVENT_BUS_MQTT_OFFLINE);
  });

  mqttClient.on("error", () => {
    console.log("mqtt event error");
    emitter.emit(constants.EVENT_BUS_MQTT_ERROR);
  });

  mqttClient.on("end", () => {
    console.log("mqtt event end");
    emitter.emit(constants.EVENT_BUS_MQTT_END);
  });
};

export const mqttSendTextMessage = (
  messageUid: string,
  messageContent: string,
) => {
  console.log("mqtt mqttSendTextMessage", messageContent);
  const currentThread = useThreadStore.getState().currentThread;
  mqttSendMessage(
    messageUid,
    constants.MESSAGE_TYPE_TEXT,
    messageContent,
    currentThread,
  );
};

export const mqttSendImageMessage = (
  messageUid: string,
  messageContent: string,
) => {
  console.log("mqtt mqttSendImageMessage", messageContent);
  const currentThread = useThreadStore.getState().currentThread;
  mqttSendMessage(
    messageUid,
    constants.MESSAGE_TYPE_IMAGE,
    messageContent,
    currentThread,
  );
};

export const mqttSendFileMessage = (
  messageUid: string,
  messageContent: string,
) => {
  console.log("mqtt mqttSendFileMessage", messageContent);
  const currentThread = useThreadStore.getState().currentThread;
  mqttSendMessage(
    messageUid,
    constants.MESSAGE_TYPE_FILE,
    messageContent,
    currentThread,
  );
};

// 对每一条消息messageProtobuf.getUid()仅发送一次回执， 需要缓存messageProtobuf.getUid()，避免重复发送
const sentReceivedUIDs = new Set<string>(); // 创建一个Set来存储已发送的UID
export const mqttSendReceiptReceivedMessage = (
  messageContent: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendReceiptReceivedMessage", messageContent);
  if (!sentReceivedUIDs.has(messageContent)) {
    // 检查UID是否已经在Set中
    sentReceivedUIDs.add(messageContent); // 添加到Set中
    // 
    mqttSendMessage(
      getUUid(),
      constants.MESSAGE_TYPE_DELIVERED,
      messageContent,
      thread,
    );
  }
};

// 对每一条消息messageProtobuf.getUid()仅发送一次回执， 需要缓存messageProtobuf.getUid()，避免重复发送
const sentReadUIDs = new Set<string>(); // 创建一个Set来存储已发送的UID
export const mqttSendReceiptReadMessage = (
  messageContent: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendReceiptReadMessage", messageContent);
  if (!sentReadUIDs.has(messageContent)) {
    // 检查UID是否已经在Set中
    sentReadUIDs.add(messageContent); // 添加到Set中
    // 
    mqttSendMessage(
      getUUid(),
      constants.MESSAGE_TYPE_READ,
      messageContent,
      thread,
    );
  }
};

export const mqttSendRateInviteMessage = (thread: THREAD.ThreadResponse) => {
  console.log("mqtt mqttSendRateInviteMessage");
  mqttSendMessage(
    getUUid(),
    constants.MESSAGE_TYPE_RATE_INVITE,
    "i18n.rate.invite",
    thread,
  );
};

export const mqttSendTypingMessage = (thread: THREAD.ThreadResponse) => {
  console.log("mqtt mqttSendTypingMessage");
  mqttSendMessage(getUUid(), constants.MESSAGE_TYPE_TYPING, "", thread);
};

export const mqttSendQuotationMessage = (
  content: string,
  quotation: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendQuotationMessage");
  // TODO: 引用消息
  mqttSendMessage(getUUid(), constants.MESSAGE_TYPE_QUOTATION, content, thread);
};
export const mqttSendTransferMessage = (
  content: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendTransferMessage");
  mqttSendMessage(getUUid(), constants.MESSAGE_TYPE_TRANSFER, content, thread);
};

export const mqttSendTransferAcceptMessage = (
  content: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendTransferAcceptMessage");
  mqttSendMessage(
    getUUid(),
    constants.MESSAGE_TYPE_TRANSFER_ACCEPT,
    content,
    thread,
  );
};

export const mqttSendTransferRejectMessage = (
  content: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendTransferRejectMessage");
  mqttSendMessage(
    getUUid(),
    constants.MESSAGE_TYPE_TRANSFER_REJECT,
    content,
    thread,
  );
};

export const mqttSendRecallMessage = (
  recallMessageUid: string,
  thread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendRecallMessage", recallMessageUid);
  mqttSendMessage(
    getUUid(),
    constants.MESSAGE_TYPE_RECALL,
    recallMessageUid,
    thread,
  );
};

export const mqttSendMessage = async (
  messageUid: string,
  messageType: string,
  messageContent: string,
  currentThread: THREAD.ThreadResponse,
) => {
  console.log("mqtt mqttSendMessage", messageContent);
  const timestamp = currentTimestamp();
  // 发送消息
  if (mqttClient && mqttClient.connected) {
    //
    const thread = new threadProto.Thread();
    thread.setUid(currentThread.uid);
    thread.setType(currentThread.type);
    thread.setTopic(currentThread.topic);
    //
    const threadUser = new userProto.User();
    threadUser.setUid(currentThread.user?.uid);
    threadUser.setNickname(currentThread.user?.nickname);
    threadUser.setAvatar(currentThread.user?.avatar);
    thread.setUser(threadUser);
    //
    const user = new userProto.User();
    if (
      agentInfo?.uid != "" &&
      (currentThread?.type === constants.THREAD_TYPE_AGENT ||
        currentThread?.type === constants.THREAD_TYPE_WORKGROUP)
    ) {
      // 只有客服会话，才使用客服头像昵称等信息
      user.setUid(agentInfo.uid);
      user.setNickname(agentInfo.nickname);
      user.setAvatar(agentInfo.avatar);
      user.setType(constants.USER_TYPE_AGENT);
    } else {
      // 同事、个人、群聊、机器人等对话均使用个人头像
      user.setUid(userInfo.uid);
      user.setNickname(userInfo.nickname);
      user.setAvatar(userInfo.avatar);
      user.setType(constants.USER_TYPE_USER);
    }
    //
    const messageExtra = {
      orgUid: userInfo?.currentOrganization?.uid,
    };
    const message = new messageProto.Message();
    message.setUid(messageUid);
    message.setType(messageType);
    message.setStatus(constants.MESSAGE_STATUS_SENDING);
    message.setCreatedat(timestamp);
    message.setClient(constants.HTTP_CLIENT);
    message.setContent(messageContent);
    message.setUser(user);
    message.setThread(thread);
    message.setExtra(JSON.stringify(messageExtra));
    //
    const messageData = message.serializeBinary();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mqttClient.publish(currentThread.topic, messageData);

    // 存储发送的消息到 IndexedDB
    try {
      const messageResponse: MESSAGE.MessageResponse = {
        uid: message.getUid(),
        type: message.getType(),
        content: message.getContent(),
        client: message.getClient(),
        createdAt: message.getCreatedat(),
        status: message.getStatus(),
        threadTopic: message.getThread().getTopic(),
        user: {
          uid: message.getUser().getUid(),
          nickname: message.getUser().getNickname(),
          avatar: message.getUser().getAvatar()
        }
      };
      await myIndexedDb.createMessage(messageResponse);
      console.log('Sent message stored in IndexedDB:', messageResponse);
    } catch (error) {
      console.error('Error storing sent message in IndexedDB:', error);
    }
  } else {
    // 长链接断开时，使用http发送
    console.log("mqttClient is disconnect, use http rest api");
    const thread: THREAD.ThreadResponse = {
      uid: currentThread.uid,
      type: currentThread.type,
      topic: currentThread.topic,
      user: {
        uid: currentThread.user?.uid,
        nickname: currentThread.user?.nickname,
        avatar: currentThread.user?.avatar,
      },
    };
    //
    let user: USER.UserProtobuf;
    if (
      agentInfo?.uid != "" &&
      (currentThread?.type === constants.THREAD_TYPE_AGENT ||
        currentThread?.type === constants.THREAD_TYPE_WORKGROUP)
    ) {
      user = {
        uid: agentInfo.uid,
        nickname: agentInfo.nickname,
        avatar: agentInfo.avatar,
        type: constants.USER_TYPE_AGENT,
      };
    } else {
      user = {
        uid: userInfo.uid,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        type: constants.USER_TYPE_USER,
      };
    }
    const messageExtra = {
      orgUid: userInfo?.currentOrganization?.uid,
    };
    const message: MESSAGE.MessageProtobuf = {
      uid: messageUid,
      type: messageType,
      status: constants.MESSAGE_STATUS_SENDING,
      createdAt: timestamp,
      client: constants.HTTP_CLIENT,
      content: messageContent,
      extra: JSON.stringify(messageExtra),
      user: user,
      thread: thread,
    };
    sendHttpMessage(message);
  }
};

export const mqttSubscribe = (topic) => {
  // 订阅
  if (mqttClient && mqttClient.connected) {
    mqttClient.subscribe(topic, { qos: 0 });
  } else {
    console.log("mqttClient is null");
  }
};

export const mqttUnsubscribe = (topic) => {
  //
  if (mqttClient && mqttClient.connected) {
    mqttClient.unsubscribe(topic);
  } else {
    console.log("mqttClient is null");
  }
};

export const mqttDisconnect = () => {
  //  && mqttClient.connected
  if (mqttClient) {
    mqttClient.end();
  } else {
    console.log("mqttClient is null");
  }
};

export const mqttConnected = () => {
  return mqttClient && mqttClient.connected;
};

//
const sendHttpMessage = async (messageObject: MESSAGE.MessageProtobuf) => {
  // console.log("sendHttpMessage:", message);
  const messageString = JSON.stringify(messageObject);
  const response = await sendRestMessage(messageString);
  console.log("sendHttpMessage:", response.data);
  if (response.data.code === 200) {
    // 发送成功，设置本地消息状态为success
    useMessageStore
      .getState()
      .updateMessageStatus(
        messageObject?.uid,
        constants.MESSAGE_STATUS_SUCCESS,
      );
    //
    const uidTypeObject = {
      uid: messageObject?.uid,
      type: constants.MESSAGE_STATUS_SUCCESS,
    };
    emitter.emit(
      constants.EVENT_BUS_MESSAGE_TYPE_STATUS,
      JSON.stringify(uidTypeObject),
    );
  } else {
    message.error(response.data.message);
  }
};

// 辅助函数：判断消息是否为自己发送
const isSelfSent = (
  messageProtobuf: proto.Message,
  userInfo: USER.UserResponse,
  agentInfo: AGENT.AgentResponse,
): boolean => {
  return (
    messageProtobuf.getUser().getUid() === userInfo?.uid ||
    messageProtobuf.getUser().getUid() === agentInfo?.uid
  );
};

// 辅助函数：处理回执消息
function updateMessageStatus(messageProtobuf: proto.Message) {
  console.log(
    "update message status:",
    messageProtobuf.getContent(),
    messageProtobuf.getType(),
  );
  useMessageStore
    .getState()
    .updateMessageStatus(
      messageProtobuf.getContent(),
      messageProtobuf.getType(),
    );
  const uidTypeObject = {
    uid: messageProtobuf.getContent(),
    type: messageProtobuf.getType(),
  };
  emitter.emit(
    constants.EVENT_BUS_MESSAGE_TYPE_STATUS,
    JSON.stringify(uidTypeObject),
  );
}

// 辅助函数：处理正在输入的消息
function handleTypingMessage(
  currentThread: THREAD.ThreadResponse,
  thread: THREAD.ThreadResponse,
  typing: string,
) {
  if (currentThread?.topic === thread?.topic) {
    if (typing === constants.MESSAGE_TYPE_TYPING) {
      emitter.emit(constants.EVENT_BUS_MESSAGE_TYPE_TYPING);
    } else if (typing === constants.MESSAGE_TYPE_PROCESSING) {
      emitter.emit(constants.EVENT_BUS_MESSAGE_TYPE_PROCESSING);
    } else if (typing === constants.MESSAGE_TYPE_STREAM) {
      emitter.emit(constants.EVENT_BUS_MESSAGE_TYPE_STREAM);
    }
  }
}

// 辅助函数：处理消息预知
function handlePreviewMessage(
  messageProtobuf: proto.Message,
  currentThread: THREAD.ThreadResponse,
  thread: THREAD.ThreadResponse,
) {
  if (currentThread?.topic === thread?.topic) {
    emitter.emit(
      constants.EVENT_BUS_MESSAGE_TYPE_PREVIEW,
      messageProtobuf.getContent(),
    );
  }
}

// 处理转接会话消息
function handleTransferMessage(
  message: MESSAGE.MessageResponse,
  thread: THREAD.ThreadResponse,
) {
  const contentObject: MESSAGE.TransferMessage = {
    message: message,
    thread: thread,
  };
  emitter.emit(
    constants.EVENT_BUS_MESSAGE_TYPE_TRANSFER,
    JSON.stringify(contentObject),
  );
}
function handleTransferAcceptMessage(
  message: MESSAGE.MessageResponse,
  thread: THREAD.ThreadResponse,
) {
  const transferObject: MESSAGE.TransferConfirmObject = JSON.parse(
    message?.content,
  );
  useMessageStore
    .getState()
    .updateMessageStatus(
      transferObject.uid,
      constants.MESSAGE_STATUS_TRANSFER_ACCEPT,
    );
  // 更新会话
  const contentObject = {
    message: message,
    thread: thread,
  };
  emitter.emit(
    constants.EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT,
    JSON.stringify(contentObject),
  );
}
function handleTransferRejectMessage(
  message: MESSAGE.MessageResponse,
  thread: THREAD.ThreadResponse,
) {
  const transferObject: MESSAGE.TransferConfirmObject = JSON.parse(
    message?.content,
  );
  useMessageStore
    .getState()
    .updateMessageStatus(
      transferObject.uid,
      constants.MESSAGE_STATUS_TRANSFER_REJECT,
    );
  //
  const contentObject = {
    message: message,
    thread: thread,
  };
  emitter.emit(
    constants.EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT,
    JSON.stringify(contentObject),
  );
}

function handleRecallMessage(message: MESSAGE.MessageResponse) {
  console.log("handleRecallMessage", message?.uid, message?.content);
  useMessageStore.getState().recallMessage(message?.content);
}

// 辅助函数：发送送达回执
function sendReceiptReceivedMessage(
  messageProtobuf: proto.Message,
  currentThread: THREAD.ThreadResponse,
  thread: THREAD.ThreadResponse,
) {
  // 群组消息不用发送回执
  if (
    !isOrgGroupTopic(thread?.topic) &&
    shouldSendReceipt(messageProtobuf?.getType())
  ) {
    const uid = messageProtobuf?.getUid();
    // 非自己发送的消息，发送送达回执
    mqttSendReceiptReceivedMessage(uid, thread);
    if (currentThread?.topic === thread?.topic) {
      // 当前会话，发送已读
      mqttSendReceiptReadMessage(uid, thread);
    }
  }
}
