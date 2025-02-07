import { useIntl } from "react-intl";
import { message } from "antd";
import { useThreadStore } from "@/stores/core/thread";
import { closeThread } from "@/apis/core/thread";

export const useThreadHandlers = () => {
  const intl = useIntl();
  const { currentThread, setCurrentThread } = useThreadStore((state) => ({
    currentThread: state.currentThread,
    setCurrentThread: state.setCurrentThread,
  }));

  const handleCloseThread = async () => {
    message.loading(
      intl.formatMessage({
        id: "chat.thread.closing",
        defaultMessage: "结束会话中...",
      }),
    );
    const response = await closeThread(currentThread);
    if (response.data.code === 200) {
      setCurrentThread(response?.data?.data);
      message.destroy();
      message.success(
        intl.formatMessage({
          id: "chat.thread.close.success",
          defaultMessage: "结束会话成功",
        }),
      );
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };

  return {
    currentThread,
    setCurrentThread,
    handleCloseThread,
  };
}; 