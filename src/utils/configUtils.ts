/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-11 13:31:34
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-20 16:29:03
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import axios from "axios";
import {
  API_BASE_URL,
  CHAT_CLIENT_URL,
  CONFIG_API_URL,
  CONFIG_CUSTOM_API_URL,
  CONFIG_CUSTOM_ENABLED,
  CONFIG_CUSTOM_WEBSOCKET_URL,
  CONFIG_ENABLED,
  CONFIG_HTML_URL,
  CONFIG_WEBSOCKET_URL,
  IS_DEBUG,
  MQTT_WSS_URL,
  SERVER_MODE,
  SERVER_MODE_OPEN,
} from "./constants";

// 修改 loadConfig 函数，使其返回 Promise
export async function loadConfig() {
  // 线上动态读取配置
  try {
    const response = await axios.get("/agent/config.json");
    const config: MYCONFIG.Config = response.data;
    if (config.enabled) {
      console.log("config enabled: ", config);
      localStorage.setItem(CONFIG_ENABLED, "true");
      localStorage.setItem(CONFIG_API_URL, config.apiUrl);
      localStorage.setItem(CONFIG_WEBSOCKET_URL, config.websocketUrl);
      localStorage.setItem(CONFIG_HTML_URL, config.htmlUrl);
    } else if (SERVER_MODE === SERVER_MODE_OPEN) {
      console.log("config opensource");
      // 读取浏览器URL域名和端口号
      const port = window.location.port;
      const apiUrl =
        window.location.protocol + "//" + window.location.hostname + ":" + port;
      const websocketUrl = "ws://" + window.location.hostname + ":9885/websocket";
      console.log("apiUrl: ", apiUrl, " port:", port, " websocketUrl:", websocketUrl);
      localStorage.setItem(CONFIG_ENABLED, "true");
      localStorage.setItem(CONFIG_API_URL, apiUrl);
      localStorage.setItem(CONFIG_WEBSOCKET_URL, websocketUrl);
      localStorage.setItem(CONFIG_HTML_URL, apiUrl);
    } else {
      console.log("config disabled");
      localStorage.setItem(CONFIG_ENABLED, "false");
      localStorage.removeItem(CONFIG_API_URL);
      localStorage.removeItem(CONFIG_WEBSOCKET_URL);
      localStorage.removeItem(CONFIG_HTML_URL);
    }
  } catch (error) {
    console.log("loadConfig error: ", error);
  }
}

export function getApiUrl() {
  // 自定义服务器
  const custom_enabled = localStorage.getItem(CONFIG_CUSTOM_ENABLED);
  console.log("custom_enabled: ", custom_enabled);
  if (custom_enabled === "true") {
    const apiUrl = localStorage.getItem(CONFIG_CUSTOM_API_URL);
    if (apiUrl === null) {
      return API_BASE_URL;
    } else {
      return apiUrl;
    }
  }
  // 配置服务器
  const config_enabled = localStorage.getItem(CONFIG_ENABLED);
  // console.log("config_enabled: ", config_enabled);
  if (config_enabled === "true") {
    const apiUrl = localStorage.getItem(CONFIG_API_URL);
    if (apiUrl === null) {
      return API_BASE_URL;
    } else {
      return apiUrl;
    }
  }
  return API_BASE_URL;
}

export function getUploadUrl() {
  return getApiUrl() + "/api/v1/upload/file";
}

export function getHtmlUrl() {
  const config_enabled = localStorage.getItem(CONFIG_ENABLED);
  // console.log("config_enabled: ", config_enabled);
  if (config_enabled === "true") {
    const htmlUrl = localStorage.getItem(CONFIG_HTML_URL);
    if (htmlUrl === null) {
      return CHAT_CLIENT_URL;
    } else  {
      return htmlUrl;
    }
  }
  return CHAT_CLIENT_URL;
}

export function getAdminUrl() {
  if (IS_DEBUG) {
    return "http://127.0.0.1:9004/admin";
  }
  return getHtmlUrl() + "/admin/";
}

export function getAgentUrl() {
  if (IS_DEBUG) {
    return "http://127.0.0.1:9005/agent";
  }
  return getHtmlUrl() + "/agent/";
}

export function getChatUrl() {
  return getHtmlUrl() + "/chat/";
}

export function getChatFrameUrl() {
  return getHtmlUrl() + "/chat/iframe.html";
}

export function getChatFloatUrl() {
  return getHtmlUrl() + "/chat/float.html";
}

export function getChatCenterUrl() {
  return getHtmlUrl() + "/chat/center";
}

export function getChatFloatJsUrl() {
  return getHtmlUrl() + "/chat/assets/js/float/index.min.js";
}

export function getAgentClientUrl() {
  return getHtmlUrl() + "/agent";
}


export function getMqttWssHost() {
  // 自定义服务器
  const custom_enabled = localStorage.getItem(CONFIG_CUSTOM_ENABLED);
  console.log("custom_enabled: ", custom_enabled);
  if (custom_enabled === "true") {
    const websocketUrl = localStorage.getItem(CONFIG_CUSTOM_WEBSOCKET_URL);
    if (websocketUrl === null) {
      return MQTT_WSS_URL;
    } else {
      return websocketUrl;
    }
  }
  // 配置服务器
  const config_enabled = localStorage.getItem(CONFIG_ENABLED);
  // console.log("config_enabled: ", config_enabled);
  const websocketUrl = localStorage.getItem(CONFIG_WEBSOCKET_URL);
  if (config_enabled === "true") {
    return websocketUrl;
  } else {
    return MQTT_WSS_URL;
  }
}
