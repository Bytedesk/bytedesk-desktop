/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-13 20:45:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-14 10:09:39
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved.
 */
//
import AutoReplyModel from "@/components/AutoReplyModel";
import ScreenRecorderModel from "@/components/ScreenRecorderModel";
import BlockModel from "@/components/Vip/BlockModel";
import ForwardMessageModel from "@/components/Vip/ForwardMessageModel";
import HistoryMessageModel from "@/components/Vip/HistoryMessageModel";
import TransferMessageModel from "@/components/Vip/TransferMessageModel";
import TransferThreadModel from "@/components/Vip/TransferThreadModel";
import WebRtcModel from "@/components/Vip/WebRtcModel";
import TicketCreateDrawer from "@/pages/Vip/Ticket/components/TicketCreateDrawer";
import EmojiPicker from "@emoji-mart/react";
import GroupInfoDrawer from "../../RightPanel/GroupInfo";
import MemberInfoDrawer from "../../RightPanel/MemberInfo";
import RobotInfoDrawer from "../../RightPanel/RobotInfo";

interface ChatModelsProps {
  fromTicketTab?: boolean;
  chatThread: THREAD.ThreadResponse;
  isAutoReplyModelOpen: boolean;
  handleAutoReplyModelOk: () => void;
  handleAutoReplyModelCancel: () => void;
  isTransferThreadModelOpen: boolean;
  handleTransferThreadModelOk: () => void;
  handleTransferThreadModelCancel: () => void;
  isForwardMessageModelOpen: boolean;
  handleForwardMessageModelOk: () => void;
  handleForwardMessageModelCancel: () => void;
  isTransferMessageModelOpen: boolean;
  handleTransferMessageModelOk: () => void;
  handleTransferMessageModelCancel: () => void;
  isHistoryMessageModelOpen: boolean;
  handleHistoryMessageModelOk: () => void;
  handleHistoryMessageModelCancel: () => void;
  isTicketCreateModelOpen: boolean;
  handleTicketCreateModelSuccess: () => void;
  handleTicketCreateModelCancel: () => void;
  isBlockModelOpen: boolean;
  handleBlockModelOk: () => void;
  handleBlockModelCancel: () => void;
  isWebRtcModelOpen: boolean;
  handleWebRtcModelOk: () => void;
  handleWebRtcModelCancel: () => void;
  isScreenRecorderModelOpen: boolean;
  screenShotImg: string;
  handleScreenRecorderModelOk: () => void;
  handleScreenRecorderModelCancel: () => void;
  isGroupInfoDrawerOpen: boolean;
  setIsGroupInfoDrawerOpen: (isOpen: boolean) => void;
  isMemberInfoDrawerOpen: boolean;
  setIsMemberInfoDrawerOpen: (isOpen: boolean) => void;
  isRobotInfoDrawerOpen: boolean;
  setIsRobotInfoDrawerOpen: (isOpen: boolean) => void;
  showEmoji: boolean;
  handleEmojiSelect: (emoji: string) => void;
  setShowEmoji: (isOpen: boolean) => void;
}

const ChatModels = ({
  fromTicketTab = false,
  // chatThread,
  isAutoReplyModelOpen,
  handleAutoReplyModelOk,
  handleAutoReplyModelCancel,
  isTransferThreadModelOpen,
  handleTransferThreadModelOk,
  handleTransferThreadModelCancel,
  isForwardMessageModelOpen,
  handleForwardMessageModelOk,
  handleForwardMessageModelCancel,
  isTransferMessageModelOpen,
  handleTransferMessageModelOk,
  handleTransferMessageModelCancel,
  isHistoryMessageModelOpen,
  handleHistoryMessageModelOk,
  handleHistoryMessageModelCancel,
  isTicketCreateModelOpen,
  handleTicketCreateModelSuccess,
  handleTicketCreateModelCancel,
  isBlockModelOpen,
  handleBlockModelOk,
  handleBlockModelCancel,
  isWebRtcModelOpen,
  handleWebRtcModelOk,
  handleWebRtcModelCancel,
  isScreenRecorderModelOpen,
  screenShotImg,
  handleScreenRecorderModelOk,
  handleScreenRecorderModelCancel,
  isGroupInfoDrawerOpen,
  setIsGroupInfoDrawerOpen,
  isMemberInfoDrawerOpen,
  setIsMemberInfoDrawerOpen,
  isRobotInfoDrawerOpen,
  setIsRobotInfoDrawerOpen,
  showEmoji,
  handleEmojiSelect,
  setShowEmoji,
}: ChatModelsProps) => {
  console.log("ChatModels fromTicketTab", fromTicketTab);

  return (
    <>
      {isAutoReplyModelOpen && (
        <AutoReplyModel
          open={isAutoReplyModelOpen}
          onOk={handleAutoReplyModelOk}
          onCancel={handleAutoReplyModelCancel}
        />
      )}
      {isTransferThreadModelOpen && (
        <TransferThreadModel
          open={isTransferThreadModelOpen}
          onOk={handleTransferThreadModelOk}
          onCancel={handleTransferThreadModelCancel}
        />
      )}
      {isForwardMessageModelOpen && (
        <ForwardMessageModel
          open={isForwardMessageModelOpen}
          onOk={handleForwardMessageModelOk}
          onCancel={handleForwardMessageModelCancel}
        />
      )}
      {isTransferMessageModelOpen && (
        <TransferMessageModel
          open={isTransferMessageModelOpen}
          onOk={handleTransferMessageModelOk}
          onCancel={handleTransferMessageModelCancel}
        />
      )}
      {isHistoryMessageModelOpen && (
        <HistoryMessageModel
          open={isHistoryMessageModelOpen}
          onOk={handleHistoryMessageModelOk}
          onCancel={handleHistoryMessageModelCancel}
        />
      )}
      {isTicketCreateModelOpen && (
        <TicketCreateDrawer
          open={isTicketCreateModelOpen}
          onSuccess={handleTicketCreateModelSuccess}
          onCancel={handleTicketCreateModelCancel}
        />
      )}
      {isBlockModelOpen && (
        <BlockModel
          open={isBlockModelOpen}
          onOk={handleBlockModelOk}
          onCancel={handleBlockModelCancel}
        />
      )}
      {isWebRtcModelOpen && (
        <WebRtcModel
          open={isWebRtcModelOpen}
          onOk={handleWebRtcModelOk}
          onCancel={handleWebRtcModelCancel}
        />
      )}
      {isScreenRecorderModelOpen && (
        <ScreenRecorderModel
          open={isScreenRecorderModelOpen}
          screenShotImg={screenShotImg}
          onOk={handleScreenRecorderModelOk}
          onCancel={handleScreenRecorderModelCancel}
        />
      )}
      {/* 群组资料 */}
      {isGroupInfoDrawerOpen && (
        <GroupInfoDrawer
          open={isGroupInfoDrawerOpen}
          onClose={() => setIsGroupInfoDrawerOpen(false)}
        />
      )}
      {/* 成员资料 */}
      {isMemberInfoDrawerOpen && (
        <MemberInfoDrawer
          open={isMemberInfoDrawerOpen}
          onClose={() => setIsMemberInfoDrawerOpen(false)}
        />
      )}
      {/* 大模型设置 */}
      {isRobotInfoDrawerOpen && (
        <RobotInfoDrawer
          open={isRobotInfoDrawerOpen}
          onClose={() => setIsRobotInfoDrawerOpen(false)}
        />
      )}
      {showEmoji && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmoji(false)}
        />
      )}
    </>
  );
};

export default ChatModels;
