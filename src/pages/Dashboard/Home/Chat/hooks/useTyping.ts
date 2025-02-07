/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { mqttSendTypingMessage } from "@/network/mqtt";

export const useTyping = (currentThread: any, previewContent: string) => {
  useEffect(() => {
    if (
      currentThread?.topic.length > 0 &&
      previewContent.trim().length > 0
    ) {
      mqttSendTypingMessage(currentThread);
    }
  }, [previewContent, currentThread]);
}; 