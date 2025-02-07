/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageProps } from "@/components/ChatUI";
import { mqttSendMessage } from "@/network/mqtt";

export const useResendMessage = (currentThread: any) => {
  const handleResendMessage = (message: MessageProps) => {
    const { _id, type, content } = message;
    mqttSendMessage(_id.toString(), type, content, currentThread);
  };

  return {
    handleResendMessage
  };
}; 