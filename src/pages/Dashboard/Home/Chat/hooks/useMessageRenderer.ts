// /*
//  * @Author: jackning 270580156@qq.com
//  * @Date: 2025-02-07 11:46:08
//  * @LastEditors: jackning 270580156@qq.com
//  * @LastEditTime: 2025-02-07 13:35:49
//  * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
//  *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
//  *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
//  *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
//  *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
//  *  contact: 270580156@qq.com 
//  * 联系：270580156@qq.com
//  * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
//  */
// import React from 'react';
// import { 
//   MessageProps, 
//   Bubble, 
//   FileCard, 
//   Video, 
//   Card, 
//   Goods
// } from "@/components/ChatUI";
// import { MessageStatus, IMessageStatus } from "@/components/ChatUI/components/MessageStatus";
// import { PhotoView } from "react-photo-view";
// import { isRichText, isGroupThread } from "@/utils/utils";
// import {
//   MESSAGE_TYPE_WELCOME,
//   MESSAGE_TYPE_TEXT,
//   MESSAGE_TYPE_IMAGE,
//   MESSAGE_TYPE_FILE,
//   MESSAGE_TYPE_VIDEO,
//   MESSAGE_TYPE_GOODS,
//   MESSAGE_TYPE_CARD,
//   MESSAGE_TYPE_NOTICE,
//   MESSAGE_TYPE_STREAM,
//   MESSAGE_TYPE_LEAVE_MSG,
//   MESSAGE_TYPE_FAQ,
//   MESSAGE_TYPE_ROBOT,
//   MESSAGE_TYPE_TRANSFER
// } from "@/utils/constants";

// // Bubble components
// import StreamQa from "@/components/Bubbles/StreamQa";
// import NoticeMsg from "@/components/Bubbles/NoticeMsg";
// import LeaveMsg from "@/components/Bubbles/LeaveMsg";
// import { FaqQa } from "@/components/Bubbles/FaqQa";
// import RobotQa from "@/components/Bubbles/RobotQa";
// import TransferBubble from "@/components/Bubbles/TransferBubble";

// interface MessageRendererProps {
//   currentThread: THREAD.ThreadResponse;
//   handleContextMenu: (event: React.MouseEvent, message: MessageProps) => void;
//   handleResendMessage: (message: MessageProps) => void;
// }

// export const useMessageRenderer = ({
//   currentThread,
//   handleContextMenu,
//   handleResendMessage
// }: MessageRendererProps) => {

//   const renderMessageStatus = (message: MessageProps): React.ReactNode => {  
//     const { position, status } = message;
//     if (position === "right" && !isGroupThread(currentThread)) {
//       return (
//         <MessageStatus
//           status={status as IMessageStatus}
//           onRetry={() => handleResendMessage(message)}
//         />
//       );
//     }
//     return null;
//   };

//   const renderMessageContent = (message: MessageProps): React.ReactNode => {
//     const { _id, type, content } = message;

//     const commonBubbleProps = {
//       onContextMenu: (e: React.MouseEvent) => handleContextMenu(e, message)
//     };

//     switch (type) {
//       case MESSAGE_TYPE_WELCOME:
//       case MESSAGE_TYPE_TEXT:
//         return (
//           <>
//             <Bubble
//               {...commonBubbleProps}
//               content={content}
//               isRichText={isRichText(content)}
//             />
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_IMAGE:
//         return (
//           <>
//             <Bubble type="image" {...commonBubbleProps}>
//               <PhotoView src={content}>
//                 <img src={content} alt="图片消息" />
//               </PhotoView>
//             </Bubble>
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_FILE:
//         return (
//           <>
//             <FileCard file={content} {...commonBubbleProps} />
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_VIDEO:
//         return (
//           <>
//             <Video src={content} {...commonBubbleProps} />
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_GOODS:
//         return (
//           <>
//             <Goods data={content} {...commonBubbleProps} />
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_CARD:
//         return (
//           <>
//             <Card data={content} {...commonBubbleProps} />
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_NOTICE:
//         return <NoticeMsg content={content} />;

//       case MESSAGE_TYPE_STREAM:
//         return (
//           <>
//             <StreamQa 
//               uid={_id.toString()} 
//               content={content} 
//               thread={currentThread} 
//             />
//             {renderMessageStatus(message)}
//           </>
//         );

//       case MESSAGE_TYPE_LEAVE:
//         return <LeaveMsg content={content} />;

//       case MESSAGE_TYPE_FAQ:
//         return <FaqQa content={content} />;

//       case MESSAGE_TYPE_ROBOT:
//         return <RobotQa content={content} />;

//       case MESSAGE_TYPE_TRANSFER:
//         return <TransferBubble content={content} />;

//       default:
//         return (
//           <>
//             <Bubble content={content} {...commonBubbleProps} />
//             {renderMessageStatus(message)}
//           </>
//         );
//     }
//   };

//   return {
//     renderMessageContent
//   };
// }; 