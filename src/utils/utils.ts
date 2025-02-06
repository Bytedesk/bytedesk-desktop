/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-23 22:36:47
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 12:54:51
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { version } from "../../package.json";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import {
  ACCESS_TOKEN,
  HTTP_CLIENT,
  MESSAGE_TYPE_AUDIO,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_VIDEO,
  NETWORK_STATUS_NOTIFICATION,
  PLAY_AUDIO,
  SOUND_DINGDONG_URL,
  THREAD_TYPE_AGENT,
  THREAD_TYPE_GROUP,
  THREAD_TYPE_MEMBER,
  // THREAD_TYPE_KB,
  THREAD_TYPE_WORKGROUP,
  TOPIC_ORG_AGENT_PREFIX,
  TOPIC_ORG_GROUP_PREFIX,
  TOPIC_ORG_MEMBER_PREFIX,
  TOPIC_ORG_ROBOT_PREFIX,
  TOPIC_ORG_WORKGROUP_PREFIX,
  UPLOAD_TYPE_CHAT,
  // THREAD_TYPE_LLM,
  // THREAD_TYPE_KBDOC,
  MESSAGE_TYPE_AUTO_CLOSED,
  MESSAGE_TYPE_AGENT_CLOSED,
  THREAD_STATE_CLOSED,
  THREAD_TYPE_LLM,
  TICKET_STATUS_ASSIGNED,
  TICKET_STATUS_CANCELLED,
  TICKET_STATUS_CLOSED,
  TICKET_STATUS_IN_PROGRESS,
  TICKET_STATUS_NEW,
  TICKET_STATUS_ON_HOLD,
  TICKET_STATUS_PENDING,
  TICKET_STATUS_REOPENED,
  TICKET_STATUS_RESOLVED,
  TICKET_PRIORITY_CRITICAL,
  TICKET_PRIORITY_HIGH,
  TICKET_PRIORITY_LOW,
  TICKET_PRIORITY_MEDIUM,
  TICKET_PRIORITY_URGENT,
} from "./constants";
// import axios from "axios";
import { getUploadUrl } from "./configUtils";

export function getVersion() {
  return version;
}
export function getClient() {
  return HTTP_CLIENT;
}

// 消息提示音
export function playAudio() {
  const playAudio = localStorage.getItem(PLAY_AUDIO);
  if (playAudio === null || playAudio === "true") {
    const audio = new Audio(SOUND_DINGDONG_URL);
    audio.play();
  }
}

export function showNetworkStatusNotification(title: string, body: string) {
  console.log('showNetworkStatusNotification:', title, body);
  const showNetworkStatusNotification = localStorage.getItem(
    NETWORK_STATUS_NOTIFICATION,
  );
  if (
    showNetworkStatusNotification == null &&
    showNetworkStatusNotification === "true"
  ) {
    //
  }
}

export function currentTimestamp() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
  // return '2989-01-01 00:12:12'
}

export function getUUid() {
  return uuidv4().replaceAll(/-/g, "");
}

export function generateAvatar(uid: string) {
  return createAvatar(lorelei, {
    seed: uid,
    size: 40,
    // ... other options
  }).toDataUriSync();
}

// 去掉字符串开头 http://或https://
export function removeProtocol(str: string): string {
  const protocolRegex = /^(https?:\/\/)/;
  if (protocolRegex.test(str)) {
    return str.replace(protocolRegex, "");
  }
  return str;
}

// 去掉字符串末尾 '/'
export function removeTrailingSlash(str: string): string {
  if (str.endsWith("/")) {
    return str.slice(0, -1);
  }
  return str;
}

// 将日期过滤为 hour:minutes
export const shortTimeFormat = (value) => {
  if (typeof value === "string") {
    const now = moment(); // 获取当前时间
    const parsedDate = moment(value); // 解析给定的时间字符串

    // 检查给定时间是否为今天
    if (parsedDate.isSame(now, "day")) {
      // 如果是今天，则只返回小时和分钟
      return parsedDate.format("HH:mm");
    } else {
      // 否则，按照原来的格式返回
      return parsedDate.format("MM-DD HH:mm");
    }
  } else {
    return value;
  }
};

export function truncateString(str: string, length) {
  return str.length > length ? str.slice(0, length - 3) + "..." : str;
}

// 定义回调函数类型
type CallbackFunction = (result: MESSAGE.HttpUploadResult) => void;

export function handleUpload(file: File, callback: CallbackFunction) {
  const file_name = moment(new Date()).format("YYYYMMDDHHmmss") + "_" + file.name;
  //
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", file_name);
  formData.append("file_type", file.type);
  formData.append("is_avatar", "false");
  formData.append("kb_type", UPLOAD_TYPE_CHAT);
  // formData.append(
  //   "category_uid",
  //   currentCategory?.uid === "all" ? "" : currentCategory?.uid,
  // );
  // formData.append("kb_uid", currentKbase?.uid);
  formData.append("client", HTTP_CLIENT);
  console.log("handleUpload formData", formData);
  //
  fetch(getUploadUrl(), {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
    },
    body: formData,
  })
    .then((response) => {
      // console.log("upload response:", response);
      return response.json();
    })
    .then((result: MESSAGE.HttpUploadResult) => {
      console.log("upload data:", result);
      callback(result);
    });
}

export function isImageFileByType(file: File): boolean {
  return /^image\/(jpeg|png|gif|bmp|svg\+xml)$/.test(file.type);
}

export const isMemberThread = (thread: THREAD.ThreadResponse) => {
  return thread?.type === THREAD_TYPE_MEMBER;
};

export const isGroupThread = (thread: THREAD.ThreadResponse) => {
  return thread?.type === THREAD_TYPE_GROUP;
};

export const isCustomerServiceThread = (thread: THREAD.ThreadResponse) => {
  return (
    thread?.type === THREAD_TYPE_AGENT || thread?.type === THREAD_TYPE_WORKGROUP
  );
};

export const isRobotThread = (thread: THREAD.ThreadResponse) => {
  return (
    // thread?.type === THREAD_TYPE_KB ||
    // thread?.type === THREAD_TYPE_KBDOC ||
    thread?.type === THREAD_TYPE_LLM
  );
};

export const isThreadClosed = (thread: THREAD.ThreadResponse) => {
  return thread?.state === THREAD_STATE_CLOSED;
};

export function shouldSendReceipt(type: string) {
  if (
    MESSAGE_TYPE_TEXT === type ||
    MESSAGE_TYPE_IMAGE === type ||
    MESSAGE_TYPE_FILE === type ||
    MESSAGE_TYPE_AUDIO === type ||
    MESSAGE_TYPE_VIDEO === type
    // MESSAGE_TYPE_STREAM === type
  ) {
    return true;
  }
}
// TODO: 增加更多类型
export function isMessageTypeNotification(type: string) {
  return (
    type === MESSAGE_TYPE_AUTO_CLOSED ||
    type === MESSAGE_TYPE_AGENT_CLOSED
  );
}
export function isMessageTypeClosed(type: string) {
  return (
    type === MESSAGE_TYPE_AUTO_CLOSED ||
    type === MESSAGE_TYPE_AGENT_CLOSED
  );
}
//
export function isOrgMemberTopic(topic: string) {
  return topic.startsWith(TOPIC_ORG_MEMBER_PREFIX);
}
export function getOrgMemberTopicReverse(topic: string): string {
  const parts = topic.split('/');
  if (parts.length !== 4) {
      throw new Error(`Invalid private topic: ${topic}`);
  }
  // 交换第3个和第2个元素的位置
  [parts[2], parts[3]] = [parts[3], parts[2]];
  return parts.join('/');
}

export function isOrgGroupTopic(topic: string) {
  return topic.startsWith(TOPIC_ORG_GROUP_PREFIX);
}
export function isOrgRobotTopic(topic: string) {
  return topic.startsWith(TOPIC_ORG_ROBOT_PREFIX);
}
export function isOrgAgentTopic(topic: string) {
  return topic.startsWith(TOPIC_ORG_AGENT_PREFIX);
}
export function isOrgWorkgroupTopic(topic: string) {
  return topic.startsWith(TOPIC_ORG_WORKGROUP_PREFIX);
}

export function bytedeskBanner() {
  // log bytedesk
  console.log(
    "%cWelcome to Bytedesk",
    "font-family:Arial; color:#3370ff ; font-size:18px; font-weight:bold;",
    `GitHub：https://github.com/bytedesk/bytedesk`,
  );
}

// 检查消息内容是否为富文本
export const isRichText = (content: string) => {
  return content && (
    content.includes('<p>') || 
    content.includes('<div>') || 
    content.includes('<h') ||
    content.includes('<ul>') ||
    content.includes('<ol>')
  );
};

export function getTicketStatusColor(status: string) {
  switch (status) {
    case TICKET_STATUS_NEW:
      return 'blue';
    case TICKET_STATUS_ASSIGNED:
      return 'purple';
    case TICKET_STATUS_IN_PROGRESS:
      return 'green';
    case TICKET_STATUS_PENDING:
      return 'orange';
    case TICKET_STATUS_ON_HOLD:
      return 'gold';
    case TICKET_STATUS_REOPENED:
      return 'magenta';
    case TICKET_STATUS_RESOLVED:
      return 'cyan';
    case TICKET_STATUS_CLOSED:
      return 'default';
    case TICKET_STATUS_CANCELLED:
      return 'red';
    default:
      return 'default';
  }
};

export function getTicketPriorityColor(priority: string) {
  switch (priority) {
    case TICKET_PRIORITY_LOW:
      return 'blue';
    case TICKET_PRIORITY_MEDIUM:
      return 'purple';
    case TICKET_PRIORITY_HIGH:
      return 'red';
    case TICKET_PRIORITY_URGENT:
      return 'orange';
    case TICKET_PRIORITY_CRITICAL:
      return 'default';
    default:
      return 'default';
  }
};
