/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:46:16
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:31:28
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useContextMenu as useReactContextify } from "react-contexify";
import { useIntl } from "react-intl";
import { message } from "antd";
import { createNewWindow, openUrl } from "@/utils/electronApiUtils";
import emitter from "@/utils/eventEmitter";
import { EVENT_BUS_QUICKREPLY_ADD } from "@/utils/constants";
import { mqttSendRecallMessage } from "@/network/mqtt";

export const useContextMenu = (currentThread: any) => {
  const intl = useIntl();
  const MENU_ID = "message_list_item";
  const { show } = useReactContextify({ id: MENU_ID });

  const handleRightClick = async ({ id }: any, contextMessage: any, handleTranslate: any, handleAddQuickReply: any) => {
    const messageUid = contextMessage?._id.toString();
    
    switch (id) {
      case "copy":
        navigator.clipboard.writeText(contextMessage?.content)
          .then(() => {
            message.success(intl.formatMessage({
              id: "chat.copy.success",
              defaultMessage: "复制成功",
            }));
          })
          .catch((err) => {
            console.error("无法复制文本: ", err);
            message.error(err);
          });
        break;

      case "enlarge":
        createNewWindow(contextMessage?.content);
        break;

      case "translate":
        handleTranslate(messageUid, contextMessage?.content);
        break;

      case "browser-open":
        openUrl(contextMessage?.content);
        break;

      case "recall":
        mqttSendRecallMessage(messageUid, currentThread);
        break;

      case "addquickreply":
        handleAddQuickReply(contextMessage);
        break;

      default:
        message.warning("TODO: 即将上线，敬请期待");
        break;
    }
  };

  return {
    MENU_ID,
    show,
    handleRightClick
  };
}; 