/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 11:09:02
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:37:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/* eslint-disable */
// import { fetchEventSource } from "@microsoft/fetch-event-source";
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

/** */
export async function queryMessagesByThreadTopic(pageParam: MESSAGE.HttpRequest,) {
  return request<MESSAGE.HttpPageResult>("/api/v1/message/query/topic", {
    method: "GET",
    params: {
      ...pageParam,
    },
  });
}

//
export async function queryRobotMessage(pageParams: AUTH.PageParams) {
  return request<AUTH.PageResultRobot>("/api/user/robot", {
    method: "GET",
    params: {
      pageNumber: pageParams.pageNumber,
      pageSize: pageParams.pageSize,
      client: HTTP_CLIENT,
    },
  });
}

export async function sendPingMessage(uid: string) {
  return request<MESSAGE.HttpPingResult>("/api/v1/message/ping", {
    method: "GET",
    params: {
      uid,
      client: HTTP_CLIENT,
    },
  });
}

export async function getMessageUnread(userUid: string) {
  return request<MESSAGE.HttpListResult>("/api/v1/message_unread/query", {
    method: "GET",
    params: {
      userUid,
      client: HTTP_CLIENT,
    },
  });
}

export async function getTranslation(msgUid: string, content: string) {
  return request<MESSAGE.HttpTranslateResult>("/api/v1/vip/trans/baidu/translate",
    {
      method: "GET",
      params: {
        msgUid,
        content,
        client: HTTP_CLIENT,
      },
    },
  );
}


export async function sendRestMessage(json: string) {
  return request<MESSAGE.HttpResult>("/api/v1/message/rest/send", {
    method: "POST",
    data: {
      json,
      client: HTTP_CLIENT,
    },
  });
}

// 无授权accessToken
// https://tr.javascript.info/server-sent-events
// export async function sendSseMessage(
//   message: MESSAGE.AskMessage,
//   callback: (jsonContent: string) => void,
// ) {
//   console.log("sendMessageSSE: ", message);
//   //
//   const url = `${API_BASE_URL}/visitor/api/v1/zhipuai/sse?uid=${message.uid}&sid=${message.sid}&q=${message.question}`;
//   // const url = `${API_BASE_URL}/visitor/api/v1/zhipuai/sse?json=${message}`;
//   const eventSource = new EventSource(url, {
//     withCredentials: false,
//   });
//   eventSource.onopen = (event) => {
//     console.log("onopen:", event.target);
//     // sse = event.target;
//   };
//   eventSource.onmessage = (event) => {
//     // onmessage: {"id": "8059178098561234419", "answer": " 根据", "type": "add"}
//     // onmessage: {"id": "8059178098561234419", "answer": "", "type": "finish"}
//     // console.log("onmessage:", event.data);
//     callback(event.data);
//     //
//     const json_data = JSON.parse(event.data);
//     if (json_data.type == "finish") {
//       if (eventSource) {
//         eventSource.close();
//       }
//       return;
//     }
//   };
//   eventSource.onerror = (event) => {
//     console.log("onerror:", event);
//     // sse = event.target;
//     if (eventSource.readyState === EventSource.CLOSED) {
//       console.log("connection is closed");
//     } else {
//       console.log("Error occured", event);
//     }
//     eventSource.close();
//   };
//   //
//   eventSource.addEventListener("customEventName", (event) => {
//     console.log("Message id is " + event.lastEventId);
//   });
// }

//
// https://github.com/Azure/fetch-event-source
// export async function sendMessageSSE(pageParams: AUTH.PageParams) {
//   await fetchEventSource("http://localhost:7861/chat/knowledge_base_chat/api/sse",
//     {
//       onmessage(ev) {
//         console.log(ev.data);
//       },
//     }
//   );
// }
