/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTranslation } from "@/apis/core/message";
import { message } from "antd";
import { IMessageStatus } from "@/components/ChatUI/components/MessageStatus";

export const useTranslation = (messageList: any[], updateMessage: any, updateMsg: any, contextMessage: any) => {
  const handleTranslate = async (msgUid: string, content: string) => {
    const response = await getTranslation(msgUid, content);
    if (response.data.code === 200) {
      const msgUid = response?.data?.data.msgUid;
      const result = response?.data?.data.result;
      const messageItem = messageList.find((item) => item.uid === msgUid);
      if (messageItem) {
        messageItem.content = messageItem.content + "\n" + result;
        updateMessage(messageItem);
        updateMsg(msgUid, {
          _id: contextMessage?._id,
          type: contextMessage?.type,
          hasTime: contextMessage?.hasTime,
          createdAt: contextMessage?.createdAt,
          content: messageItem?.content,
          position: contextMessage?.position,
          user: contextMessage?.user,
          status: messageItem?.type as IMessageStatus,
        });
      }
    } else {
      message.error(response?.data?.message);
    }
  };

  return {
    handleTranslate
  };
}; 