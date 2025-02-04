/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-06 16:30:34
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-02 17:18:40
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://github.com/developit/mitt
import mitt from "mitt";

type EmitterEvents = {
  EVENT_BUS_SERVER_ERROR_500?: string;
  EVENT_BUS_TOKEN_INVALID?: string;
  // EVENT_BUS_SWITCH_CHAT_RIGHT_PANEL?: boolean;
  EVENT_BUS_SWITCH_THEME?: boolean;
  EVENT_BUS_MULTICAST_MESSAGE_RECEIVED?: string;
  EVENT_BUS_MULTICAST_BIND_SUCCESS?: string;
  EVENT_BUS_SEND_IMAGE_MESSAGE?: string;
  EVENT_BUS_SEND_FILE_MESSAGE?: string;
  //
  EVENT_BUS_MQTT_MESSAGE?: MESSAGE.MessageResponse;
  EVENT_BUS_MQTT_CONNECTED?: string;
  EVENT_BUS_MQTT_OFFLINE?: string;
  EVENT_BUS_MQTT_CLOSE?: string;
  EVENT_BUS_MQTT_DISCONNECTED?: string;
  EVENT_BUS_MQTT_ERROR?: string;
  EVENT_BUS_MQTT_END?: string;
  //
  EVENT_BUS_MESSAGE_TYPE_STATUS?: string;
  EVENT_BUS_MESSAGE_TYPE_TYPING?: string;
  EVENT_BUS_MESSAGE_TYPE_PROCESSING?: string;
  EVENT_BUS_MESSAGE_TYPE_STREAM?: string;
  EVENT_BUS_MESSAGE_TYPE_PREVIEW?: string;
  EVENT_BUS_MESSAGE_TYPE_TRANSFER?: string;
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT?: string;
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT?: string;
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL?: string;
  //
  EVENT_BUS_SCREEN_CAPTURE_IMAGE?: string;
  EVENT_BUS_QUICKREPLY_SEND?: string;
  EVENT_BUS_QUICKREPLY_ADD?: string;
};

// https://github.com/developit/mitt
const emitter = mitt<EmitterEvents>();

export default emitter;
