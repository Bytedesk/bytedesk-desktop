/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-13 20:45:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-13 20:47:55
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

interface ChatModelsProps {
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
}
        
const ChatModels = ({ 
    isAutoReplyModelOpen, handleAutoReplyModelOk, handleAutoReplyModelCancel, 
    isTransferThreadModelOpen, handleTransferThreadModelOk, handleTransferThreadModelCancel, 
    isForwardMessageModelOpen, handleForwardMessageModelOk, handleForwardMessageModelCancel, 
    isTransferMessageModelOpen, handleTransferMessageModelOk, handleTransferMessageModelCancel, 
    isHistoryMessageModelOpen, handleHistoryMessageModelOk, handleHistoryMessageModelCancel, 
    isTicketCreateModelOpen, handleTicketCreateModelSuccess, handleTicketCreateModelCancel, 
    isBlockModelOpen, handleBlockModelOk, handleBlockModelCancel, 
    isWebRtcModelOpen, handleWebRtcModelOk, handleWebRtcModelCancel,  
  }: ChatModelsProps) => {
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

