import { message } from "@/AntdGlobalComp";
import { isGroupThread, isMemberThread, isRobotThread } from "@/utils/utils";

export const useHeaderHandlers = (
  currentThread: any,
  setIsGroupInfoDrawerOpen: (open: boolean) => void,
  setIsMemberInfoDrawerOpen: (open: boolean) => void,
  setIsRobotInfoDrawerOpen: (open: boolean) => void,
  setIsTransferThreadModelOpen: (open: boolean) => void,
  setIsTicketCreateModelOpen: (open: boolean) => void,
  showCloseThreadConfirm: () => void
) => {
  const handleMenuClick = () => {
    if (isGroupThread(currentThread)) {
      setIsGroupInfoDrawerOpen(true);
    } else if (isMemberThread(currentThread)) {
      setIsMemberInfoDrawerOpen(true);
    } else if (isRobotThread(currentThread)) {
      setIsRobotInfoDrawerOpen(true);
    } else {
      message.warning("当前聊天对象类型不支持");
    }
  };

  return {
    handleMenuClick,
    handleTransferClick: () => setIsTransferThreadModelOpen(true),
    handleTicketClick: () => setIsTicketCreateModelOpen(true),
    handleCloseClick: showCloseThreadConfirm
  };
}; 