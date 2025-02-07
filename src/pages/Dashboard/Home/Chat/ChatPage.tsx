// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// // 引入ChatUI组件
// // https://chatui.io/sdk/getting-started
// // https://chatui.io/docs/customize-theme
// // 自定义主题颜色: https://market.m.taobao.com/app/chatui/theme-builder/index.html
// // 自定义主题颜色: http://localhost:8908/
// import "@/components/ChatUI/styles/index.less";
// // import "./css/chatbox.css";
// // import { useSettingsStore } from '@/stores/setting';
// import {
//   mqttSendTypingMessage,
// } from "@/network/mqtt";
// import { Empty } from "antd";
// import {
//   IS_ELECTRON,
// } from "@/utils/constants";
// import DropUpload from "../../../../components/Upload/DropUpload";
// // https://github.com/nfl/react-helmet
// import { Helmet } from "react-helmet-async";
// import { useIntl } from "react-intl";
// import {
//   startCaptureScreen,
// } from "@/utils/electronApiUtils";
// import useTranslate from "@/hooks/useTranslate";
// // https://www.npmjs.com/package/use-debounce
// // https://fkhadra.github.io/react-contexify/
// // https://github.com/fkhadra/react-contexify
// import {
//   useContextMenu,
// } from "react-contexify";
// import "react-contexify/ReactContexify.css";
// // https://react-photo-view.vercel.app/
// import "react-photo-view/dist/react-photo-view.css";
// import "./chatPage.css";
// // https://www.npmjs.com/package/file-saver
// // import { saveAs } from "file-saver";
// // import { useRightPanelStore } from "@/stores/ui/rightPanel";
// import MessageList from "./components/MessageList";
// import ChatToolbar from "./components/ChatToolbar";
// import ChatHeader from "./components/ChatHeader";
// import ChatInput from "./components/ChatInput";
// import ChatModals from "./components/ChatModals";
// import { useMessageHandlers } from "./hooks/useMessageHandlers";
// import { useInputHandlers } from "./hooks/useInputHandlers";
// import { useFileHandlers } from "./hooks/useFileHandlers";
// import { useModalStates } from "./hooks/useModalStates";
// import { useEventHandlers } from "./hooks/useEventHandlers";
// import { useMessageRenderer } from "./hooks/useMessageRenderer";
// import { useScreenshot } from "./hooks/useScreenshot";
// import { useThreadHandlers } from "./hooks/useThreadHandlers";
// import { useDrawerStates } from "./hooks/useDrawerStates";
// import { useMessageList } from "./hooks/useMessageList";
// import { usePreviewState } from "./hooks/usePreviewState";
// import { useToolbarButtons } from "./hooks/useToolbarButtons";
// import { useQuickReply } from "./hooks/useQuickReply";
// import { useTranslation } from "./hooks/useTranslation";
// import { useI18n } from "./hooks/useI18n";
// import { useResendMessage } from "./hooks/useResendMessage";
// import { useCloseThread } from "./hooks/useCloseThread";
// import { useMentionOptions } from "./hooks/useMentionOptions";
// import { useTheme } from "./hooks/useTheme";
// import { useNetwork } from "./hooks/useNetwork";
// import { useModalHandlers } from "./hooks/useModalHandlers";
// import { usePageInit } from "./hooks/usePageInit";
// import { useModalProps } from "./hooks/useModalProps";
// import { useFileInputs } from "./hooks/useFileInputs";
// import { useDrawers } from "./hooks/useDrawers";
// import { useHeaderHandlers } from "./hooks/useHeaderHandlers";

// const ChatPage = () => {
//   const intl = useIntl();
//   const { translateString } = useTranslate();
//   const { isDarkMode, locale, darkThemeCss } = useTheme();
//   const { hasRoleAgent } = useNetwork();

//   // 状态相关的 hooks
//   const [pageNumber, setPageNumber] = useState(0);

//   // 消息处理相关的 hooks
//   const {
//     messages,
//     appendMsg,
//     updateMsg,
//     resetList,
//     contextMessage,
//     getHistoryMessages,
//     handleSend,
//     handleContextMenu
//   } = useMessageHandlers();

//   // 消息列表相关
//   const { messageList, updateMessage } = useMessageList(resetList, translateString);

//   // 线程相关
//   const { currentThread, handleCloseThread } = useThreadHandlers();
//   const { showCloseThread } = useCloseThread(currentThread, handleCloseThread);

//   // 消息渲染相关
//   const { handleResendMessage } = useResendMessage(currentThread);
//   const { handleRightClick } = useContextMenu(currentThread);
//   const { renderMessageContent } = useMessageRenderer(currentThread, handleContextMenu, handleResendMessage);

//   // 输入相关
//   const {
//     inputText,
//     setInputText,
//     showEmoji,
//     setShowEmoji,
//     composerRef,
//     handleEmojiSelect
//   } = useInputHandlers();

//   // 预览状态相关
//   const {
//     typing,
//     loadMoreText,
//     msgRef
//   } = usePreviewState();

//   // 初始化和事件处理
//   useEventHandlers({
//     messages,
//     updateMsg,
//     appendMsg,
//     setTyping,
//     translateString
//   });

//   usePageInit(
//     setPageNumber,
//     setLoadMoreText,
//     messageList,
//     getHistoryMessages,
//     msgRef,
//     translateString,
//     currentThread,
//     locale
//   );

//   // 其他功能 hooks
//   const { handleAddQuickReply } = useQuickReply();
//   const { mentionOptions } = useMentionOptions();
//   useI18n(currentThread);

//   const {
//     imageInputRef,
//     fileInputRef,
//     handleImageChange,
//     handleFileChange,
//     handleDropSend,
//   } = useFileHandlers();

//   const {
//     isGroupInfoDrawerOpen,
//     setIsGroupInfoDrawerOpen,
//     isMemberInfoDrawerOpen,
//     setIsMemberInfoDrawerOpen,
//     isRobotInfoDrawerOpen,
//     setIsRobotInfoDrawerOpen,
//   } = useDrawerStates();

//   const {
//     isAutoReplyModelOpen,
//     setIsAutoReplyModelOpen,
//     isTransferThreadModelOpen,
//     setIsTransferThreadModelOpen,
//     isForwardMessageModelOpen,
//     setIsForwardMessageModelOpen,
//     isTransferMessageModelOpen,
//     setIsTransferMessageModelOpen,
//     isHistoryMessageModelOpen,
//     setIsHistoryMessageModelOpen,
//     isTicketCreateModelOpen,
//     setIsTicketCreateModelOpen,
//     isBlockModelOpen,
//     setIsBlockModelOpen,
//     isWebRtcModelOpen,
//     setIsWebRtcModelOpen,
//     isScreenRecorderModelOpen,
//     setIsScreenRecorderModelOpen,
//     screenShotImg,
//     setScreenShotImg,
//     contextHolder,
//     showCloseThreadConfirm
//   } = useModalStates();

//   const { toolbarQuickButtons } = useToolbarButtons(currentThread, intl.locale);

//   const { getShotScreenImg } = useScreenshot(setScreenShotImg, setIsScreenRecorderModelOpen);

//   const modalSetters = {
//     setIsAutoReplyModelOpen,
//     setIsTransferThreadModelOpen,
//     setIsForwardMessageModelOpen,
//     setIsTransferMessageModelOpen,
//     setIsHistoryMessageModelOpen,
//     setIsTicketCreateModelOpen,
//     setIsBlockModelOpen,
//     setIsWebRtcModelOpen,
//     setIsScreenRecorderModelOpen,
//   };

//   const handleModalClose = useModalHandlers(modalSetters);

//   const modalProps = useModalProps({
//     isAutoReplyModelOpen,
//     isTransferThreadModelOpen,
//     isForwardMessageModelOpen,
//     isTransferMessageModelOpen,
//     isHistoryMessageModelOpen,
//     isTicketCreateModelOpen,
//     isBlockModelOpen,
//     isWebRtcModelOpen,
//     isScreenRecorderModelOpen,
//     screenShotImg
//   }, handleModalClose);

//   const fileInputProps = useFileInputs(handleImageChange, handleFileChange);

//   const drawers = useDrawers(
//     isGroupInfoDrawerOpen,
//     isMemberInfoDrawerOpen,
//     isRobotInfoDrawerOpen,
//     showEmoji,
//     setIsGroupInfoDrawerOpen,
//     setIsMemberInfoDrawerOpen,
//     setIsRobotInfoDrawerOpen,
//     setShowEmoji,
//     handleEmojiSelect
//   );

//   const headerHandlers = useHeaderHandlers(
//     currentThread,
//     setIsGroupInfoDrawerOpen,
//     setIsMemberInfoDrawerOpen,
//     setIsRobotInfoDrawerOpen,
//     setIsTransferThreadModelOpen,
//     setIsTicketCreateModelOpen,
//     showCloseThreadConfirm
//   );

//   return (
//     <>
//       {isDarkMode && (
//         <Helmet>
//           <link rel="stylesheet" type="text/css" href={darkThemeCss}></link>
//         </Helmet>
//       )}
//       <input {...fileInputProps.imageInput} />
//       <input {...fileInputProps.fileInput} />
//       <DropUpload onImageSend={handleDropSend}>
//         <ChatHeader 
//           currentThread={currentThread}
//           onMenuClick={headerHandlers.handleMenuClick}
//           onTransferClick={headerHandlers.handleTransferClick}
//           onTicketClick={headerHandlers.handleTicketClick}
//           onCloseClick={headerHandlers.handleCloseClick}
//         />
//         {currentThread?.topic === "" ? (
//           <Empty style={{ marginTop: 200 }} description={false} />
//         ) : (
//           <>
//             <MessageList
//               messages={messages}
//               renderMessageContent={renderMessageContent}
//               loadMoreText={loadMoreText}
//               onRefresh={getHistoryMessages}
//               typing={typing}
//               hasRoleAgent={hasRoleAgent}
//               isDarkMode={isDarkMode}
//               onRightClick={handleRightClick}
//               contextMessage={contextMessage}
//             />
//             <ChatToolbar
//               onEmojiClick={() => setShowEmoji(true)}
//               onImageClick={() => imageInputRef.current?.click()}
//               onFileClick={() => fileInputRef.current?.click()}
//               onScreenshotClick={() => {
//                 startCaptureScreen();
//                 if (!IS_ELECTRON) {
//                   getShotScreenImg();
//                 }
//               }}
//             />
//             <ChatInput
//               value={inputText}
//               onChange={setInputText}
//               onSend={handleSend}
//               composerRef={composerRef}
//               mentionOptions={mentionOptions}
//             />
//             <ChatModals {...modalProps} />
//             {drawers}
//           </>
//         )}
//         {contextHolder}
//       </DropUpload>
//     </>
//   );
// };

// export default ChatPage;
