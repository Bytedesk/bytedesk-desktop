import AutoReplyModel from "@/components/AutoReplyModel";
import TransferThreadModel from "@/components/Vip/TransferThreadModel";
import ForwardMessageModel from "@/components/Vip/ForwardMessageModel";
import TransferMessageModel from "@/components/Vip/TransferMessageModel";
import HistoryMessageModel from "@/components/Vip/HistoryMessageModel";
import TicketCreateDrawer from "@/pages/Vip/Ticket/components/TicketCreateDrawer";
import BlockModel from "@/components/Vip/BlockModel";
import WebRtcModel from "@/components/Vip/WebRtcModel";
import ScreenRecorderModel from "@/components/ScreenRecorderModel";

interface ChatModalsProps {
  isAutoReplyModelOpen: boolean;
  isTransferThreadModelOpen: boolean;
  isForwardMessageModelOpen: boolean;
  isTransferMessageModelOpen: boolean;
  isHistoryMessageModelOpen: boolean;
  isTicketCreateModelOpen: boolean;
  isBlockModelOpen: boolean;
  isWebRtcModelOpen: boolean;
  isScreenRecorderModelOpen: boolean;
  screenShotImg?: string;
  onAutoReplyModelOk: () => void;
  onAutoReplyModelCancel: () => void;
  onTransferThreadModelOk: () => void;
  onTransferThreadModelCancel: () => void;
  onForwardMessageModelOk: () => void;
  onForwardMessageModelCancel: () => void;
  onTransferMessageModelOk: () => void;
  onTransferMessageModelCancel: () => void;
  onHistoryMessageModelOk: () => void;
  onHistoryMessageModelCancel: () => void;
  onTicketCreateModelSuccess: () => void;
  onTicketCreateModelCancel: () => void;
  onBlockModelOk: () => void;
  onBlockModelCancel: () => void;
  onWebRtcModelOk: () => void;
  onWebRtcModelCancel: () => void;
  onScreenRecorderModelOk: () => void;
  onScreenRecorderModelCancel: () => void;
}

const ChatModals = ({
  isAutoReplyModelOpen,
  isTransferThreadModelOpen,
  isForwardMessageModelOpen,
  isTransferMessageModelOpen,
  isHistoryMessageModelOpen,
  isTicketCreateModelOpen,
  isBlockModelOpen,
  isWebRtcModelOpen,
  isScreenRecorderModelOpen,
  screenShotImg,
  onAutoReplyModelOk,
  onAutoReplyModelCancel,
  onTransferThreadModelOk,
  onTransferThreadModelCancel,
  onForwardMessageModelOk,
  onForwardMessageModelCancel,
  onTransferMessageModelOk,
  onTransferMessageModelCancel,
  onHistoryMessageModelOk,
  onHistoryMessageModelCancel,
  onTicketCreateModelSuccess,
  onTicketCreateModelCancel,
  onBlockModelOk,
  onBlockModelCancel,
  onWebRtcModelOk,
  onWebRtcModelCancel,
  onScreenRecorderModelOk,
  onScreenRecorderModelCancel,
}: ChatModalsProps) => {
  return (
    <>
      {isAutoReplyModelOpen && (
        <AutoReplyModel
          open={isAutoReplyModelOpen}
          onOk={onAutoReplyModelOk}
          onCancel={onAutoReplyModelCancel}
        />
      )}
      {isTransferThreadModelOpen && (
        <TransferThreadModel
          open={isTransferThreadModelOpen}
          onOk={onTransferThreadModelOk}
          onCancel={onTransferThreadModelCancel}
        />
      )}
      {isForwardMessageModelOpen && (
        <ForwardMessageModel
          open={isForwardMessageModelOpen}
          onOk={onForwardMessageModelOk}
          onCancel={onForwardMessageModelCancel}
        />
      )}
      {isTransferMessageModelOpen && (
        <TransferMessageModel
          open={isTransferMessageModelOpen}
          onOk={onTransferMessageModelOk}
          onCancel={onTransferMessageModelCancel}
        />
      )}
      {isHistoryMessageModelOpen && (
        <HistoryMessageModel
          open={isHistoryMessageModelOpen}
          onOk={onHistoryMessageModelOk}
          onCancel={onHistoryMessageModelCancel}
        />
      )}
      {isTicketCreateModelOpen && (
        <TicketCreateDrawer
          open={isTicketCreateModelOpen}
          onSuccess={onTicketCreateModelSuccess}
          onCancel={onTicketCreateModelCancel}
        />
      )}
      {isBlockModelOpen && (
        <BlockModel
          open={isBlockModelOpen}
          onOk={onBlockModelOk}
          onCancel={onBlockModelCancel}
        />
      )}
      {isWebRtcModelOpen && (
        <WebRtcModel
          open={isWebRtcModelOpen}
          onOk={onWebRtcModelOk}
          onCancel={onWebRtcModelCancel}
        />
      )}
      {isScreenRecorderModelOpen && (
        <ScreenRecorderModel
          open={isScreenRecorderModelOpen}
          screenShotImg={screenShotImg}
          onOk={onScreenRecorderModelOk}
          onCancel={onScreenRecorderModelCancel}
        />
      )}
    </>
  );
};

export default ChatModals; 