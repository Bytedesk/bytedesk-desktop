/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from "react";
// 引入ChatUI组件
// https://chatui.io/sdk/getting-started
import Chat, {
  Bubble,
  MessageProps,
  QuickReplyItemProps,
  useMessages,
  FileCard,
  MessageStatus,
  Video,
  Goods,
  Card,
} from "@/components/ChatUI";
// https://chatui.io/docs/customize-theme
// 自定义主题颜色: https://market.m.taobao.com/app/chatui/theme-builder/index.html
// 自定义主题颜色: http://localhost:8908/
import "@/components/ChatUI/styles/index.less";
// import "./css/chatbox.css";
// import { useSettingsStore } from '@/stores/setting';
import {
  mqttSendFileMessage,
  mqttSendImageMessage,
  mqttSendMessage,
  mqttSendRateInviteMessage,
  mqttSendRecallMessage,
  // mqttSendReceiptReadMessage,
  mqttSendTextMessage,
  mqttSendTypingMessage,
} from "@/network/mqtt";
import { useThreadStore } from "@/stores/core/thread";
import {
  getOrgMemberTopicReverse,
  getUUid,
  handleUpload,
  isCustomerServiceThread,
  isGroupThread,
  isOrgMemberTopic,
  isRichText,
  isRobotThread,
} from "@/utils/utils";
import {
  getTranslation,
  queryMessagesByThreadTopic,
} from "@/apis/core/message";
import { Button, Empty, Modal } from "antd";
import moment from "moment";
import { useMessageStore } from "@/stores/core/message";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import emitter from "@/utils/eventEmitter";
import {
  CHATUI_THEME_DARK_CSS,
  EVENT_BUS_MESSAGE_TYPE_PREVIEW,
  EVENT_BUS_MESSAGE_TYPE_PROCESSING,
  EVENT_BUS_MESSAGE_TYPE_STATUS,
  EVENT_BUS_MESSAGE_TYPE_STREAM,
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT,
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL,
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT,
  EVENT_BUS_MESSAGE_TYPE_TYPING,
  EVENT_BUS_QUICKREPLY_ADD,
  EVENT_BUS_QUICKREPLY_SEND,
  EVENT_BUS_SCREEN_CAPTURE_IMAGE,
  EVENT_BUS_SEND_FILE_MESSAGE,
  EVENT_BUS_SEND_IMAGE_MESSAGE,
  IS_DEBUG,
  IS_ELECTRON,
  MESSAGE_STATUS_SENDING,
  MESSAGE_TYPE_FAQ,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_GOODS,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_LEAVE_MSG,
  MESSAGE_TYPE_NOTICE,
  MESSAGE_TYPE_RATE,
  MESSAGE_TYPE_RATE_INVITE,
  MESSAGE_TYPE_ROBOT,
  MESSAGE_TYPE_STREAM,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_TRANSFER,
  MESSAGE_TYPE_TRANSFER_ACCEPT,
  MESSAGE_TYPE_TRANSFER_REJECT,
  MESSAGE_TYPE_VIDEO,
  MESSAGE_TYPE_WELCOME,
} from "@/utils/constants";
import DropUpload from "../../../../components/Upload/DropUpload";
import { AppContext, useAppContext } from "@/context/AppContext";
// https://github.com/nfl/react-helmet
import { Helmet } from "react-helmet-async";
import { useUserStore } from "@/stores/core/user";
import { useIntl } from "react-intl";
import { message } from "@/AntdGlobalComp";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  createNewWindow,
  openUrl,
  startCaptureScreen,
} from "@/utils/electronApiUtils";
import useTranslate from "@/hooks/useTranslate";
import { closeThread } from "@/apis/core/thread";
import { useAgentStore } from "@/stores/service/agent";
// https://www.npmjs.com/package/use-debounce
import { useDebounce } from "use-debounce";
// https://fkhadra.github.io/react-contexify/
// https://github.com/fkhadra/react-contexify
import {
  Menu,
  Item,
  useContextMenu,
  ItemParams,
  Separator,
} from "react-contexify";
import "react-contexify/ReactContexify.css";
import RateBubble from "@/components/Bubbles/Rate";
// https://react-photo-view.vercel.app/
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import AutoReplyModel from "@/components/AutoReplyModel";
import TransferThreadModel from "@/components/Vip/TransferThreadModel";
import ForwardMessageModel from "@/components/Vip/ForwardMessageModel";
import LeaveMsg from "@/components/Bubbles/LeaveMsg";
import EmojiPicker from "@/components/EmojiPicker";
import RobotQa from "@/components/Bubbles/RobotQa";
import "./chatpage.css";
import { FaqQa } from "@/components/Bubbles/FaqQa";
import TransferMessageModel from "@/components/Vip/TransferMessageModel";
import TransferBubble from "@/components/Bubbles/TransferBubble";
import ScreenRecorderModel from "@/components/ScreenRecorderModel";
// https://www.npmjs.com/package/file-saver
// import { saveAs } from "file-saver";
import HistoryMessageModel from "@/components/Vip/HistoryMessageModel";
import BlockModel from "@/components/Vip/BlockModel";
import WebRtcModel from "@/components/Vip/WebRtcModel";
import NoticeMsg from "@/components/Bubbles/NoticeMsg";
import { IMessageStatus } from "@/components/ChatUI/components/MessageStatus";
import StreamQa from "@/components/Bubbles/StreamQa";
import TicketCreateDrawer from "@/pages/Vip/Ticket/components/TicketCreateDrawer";
import MemberInfoDrawer from "../RightPanel/MemberInfo";
import GroupInfoDrawer from "../RightPanel/GroupInfo";
import RobotInfoDrawer from "../RightPanel/RobotInfo";
import ChatHeader from "./components/ChatHeader";
import ChatModels from "./components/ChatModels";

const ChatPage = () => {
  const intl = useIntl();
  const { translateString } = useTranslate();
  const isNetworkOnline = useNetworkStatus();
  const { hasRoleAgent } = useAppContext();
  // 消息列表 setTyping
  const [previewText, setPreviewText] = useState<string>("");
  const [debouncedPreviewText] = useDebounce(previewText, 1000);
  const userInfo = useUserStore((state) => state.userInfo);
  const agentInfo = useAgentStore((state) => state.agentInfo);
  // const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const { messages, appendMsg, updateMsg, resetList } = useMessages([]);
  const { currentThread, setCurrentThread,} =
    useThreadStore((state) => {
      return {
        currentThread: state.currentThread,
        setCurrentThread: state.setCurrentThread,
      };
    });
  const [typing, setTyping] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [loadMoreText, setLoadMoreText] = useState(
    translateString("i18n.load.more"),
  );
  const msgRef = useRef(null);
  const composerRef = useRef(null);
  const isLoadingMessage = useRef(false);
  // 使用ref来引用input元素
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode, locale } = useContext(AppContext);
  const [contextMessage, setContextMessage] = useState<MessageProps>(null);
  const [confirmModel, contextHolder] = Modal.useModal();
  const [inputText, setInputText] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [isAutoReplyModelOpen, setIsAutoReplyModelOpen] = useState(false);
  const [isTransferThreadModelOpen, setIsTransferThreadModelOpen] =
    useState(false);
  const [isForwardMessageModelOpen, setIsForwardMessageModelOpen] =
    useState(false);
  const [isTransferMessageModelOpen, setIsTransferMessageModelOpen] =
    useState(false);
  const [isHistoryMessageModelOpen, setIsHistoryMessageModelOpen] =
    useState(false);
  const [isTicketCreateModelOpen, setIsTicketCreateModelOpen] = useState(false);
  const [isBlockModelOpen, setIsBlockModelOpen] = useState(false);
  const [isWebRtcModelOpen, setIsWebRtcModelOpen] = useState(false);
  const [screenShotImg, setScreenShotImg] = useState("");
  const [isScreenRecorderModelOpen, setIsScreenRecorderModelOpen] =
    useState(false);
  const [isGroupInfoDrawerOpen, setIsGroupInfoDrawerOpen] = useState(false);
  const [isMemberInfoDrawerOpen, setIsMemberInfoDrawerOpen] = useState(false);
  const [isRobotInfoDrawerOpen, setIsRobotInfoDrawerOpen] = useState(false);
  //
  const {
    messageList,
    addMessageList,
    updateMessage,
  } = useMessageStore((state) => {
    return {
      messageList: state.messageList,
      addMessageList: state.addMessageList,
      updateMessage: state.updateMessage,
    };
  });
  // 默认快捷短语，可选
  // https://chatui.io/components/icon
  let defaultQuickButtons: QuickReplyItemProps[] = [
    {
      name: intl.formatMessage({
        id: "chat.toolbar.emoji",
        defaultMessage: "表情",
      }),
      type: "emoji",
      code: "emoji",
      icon: "smile",
      isHighlight: false,
    },
    {
      name: intl.formatMessage({
        id: "chat.toolbar.image",
        defaultMessage: "图片",
      }),
      type: "image",
      code: "image",
      icon: "image",
      isHighlight: false,
    },
    {
      name: intl.formatMessage({
        id: "chat.toolbar.file",
        defaultMessage: "文件",
      }),
      type: "file",
      code: "file",
      icon: "file",
      isHighlight: false,
    },
    {
      name: intl.formatMessage({
        id: "chat.toolbar.screenshot",
        defaultMessage: "截图",
      }),
      type: "screenshot",
      code: "screenshot",
      icon: "camera",
      isHighlight: false,
    },
    {
      name: intl.formatMessage({
        id: "chat.toolbar.autoreply",
        defaultMessage: "自动回复",
      }),
      type: "autoreply",
      code: "autoreply",
      icon: "apps",
    },
  ];
  const [toolbarQuickButtons, setToolbarQuickButtons] =
    useState<QuickReplyItemProps[]>(defaultQuickButtons);
  // https://github.com/fkhadra/react-contexify
  const MENU_ID = "message_list_item";
  const { show } = useContextMenu({ id: MENU_ID });
  const handleContextMenu = (event: any, message: MessageProps) => {
    console.log("handleContextMenu:", event, " item:", message);
    setContextMessage(message);
    show({
      event,
      props: {
        key: message?._id.toString(),
      },
    });
  };
  // I'm using a single event handler for all items but you don't have too :)
  const handleRightClick = ({ id, event, props }: ItemParams) => {
    console.log("handleRightClick:", id, event, props);
    const messageUid = contextMessage?._id.toString();
    switch (id) {
      case "copy":
        // navigator.clipboard.writeText(translateString(contextMessage?.content));
        navigator.clipboard
          .writeText(translateString(contextMessage?.content))
          .then(() => {
            message.success(
              intl.formatMessage({
                id: "chat.copy.success",
                defaultMessage: "复制成功",
              }),
            );
          })
          .catch((err) => {
            console.error("无法复制文本: ", err);
            message.error(err);
          });
        break;
      case "enlarge":
        createNewWindow(contextMessage?.content);
        break;
      case "translate":
        handleTranslate(messageUid, contextMessage?.content);
        break;
      case "forward":
        setIsForwardMessageModelOpen(true);
        break;
        // case "download":
        //   const url = new URL(contextMessage.content);
        //   const fileName = url.pathname.split("/").pop();
        //   console.log("download:", fileName);
        //   saveAs(contextMessage?.content, fileName);
        break;
      case "browser-open":
        openUrl(contextMessage?.content);
        break;
      case "recall":
        // deleteMessage(messageUid);
        mqttSendRecallMessage(messageUid, currentThread);
        break;
      case "addquickreply":
        handleAddQuickReply();
        break;
      case "collect":
      case "quote":
      case "delete":
      default:
        message.warning("TODO: 即将上线，敬请期待");
        break;
    }
  };

  const handleTranslate = async (msgUid: string, content: string) => {
    // console.log("handleTranslate", msgUid, content);
    const response = await getTranslation(msgUid, content);
    console.log("handleTranslate", response.data);
    if (response.data.code === 200) {
      const msgUid = response?.data?.data.msgUid;
      const result = response?.data?.data.result;
      // message.success(result);
      // 从messageList中查找uid==msgUid的消息
      const messageItem = messageList.find((item) => item.uid === msgUid);
      if (messageItem) {
        // console.log("handleTranslate", messageItem);
        // 界面暂时没有调试好，暂时使用拼接字符串
        messageItem.content = messageItem.content + "\n" + result;
        //
        // let msgExtra = messageItem?.extra;
        // if (msgExtra === undefined) {
        //   msgExtra = {
        //     translation: ""
        //   } as MESSAGE.MessageExtra;
        // }
        // msgExtra.translation = result;
        // messageItem.extra = msgExtra;
        updateMessage(messageItem);
        //
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
  //
  const handleAddQuickReply = () => {
    const content = JSON.stringify(contextMessage);
    emitter.emit(EVENT_BUS_QUICKREPLY_ADD, content);
  };
  //
  const handleCloseThread = async () => {
    message.loading(
      intl.formatMessage({
        id: "chat.thread.closing",
        defaultMessage: "结束会话中...",
      }),
    );
    const response = await closeThread(currentThread);
    console.log("handleCloseThread", response.data);
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
  //
  const showCloseThreadConfirm = () => {
    confirmModel.confirm({
      title: intl.formatMessage({
        id: "chat.thread.close.confirm.title",
        defaultMessage: "确定要结束会话?",
      }),
      icon: <ExclamationCircleFilled />,
      content: <>{currentThread?.user?.nickname}</>,
      onOk() {
        console.log("OK");
        handleCloseThread();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  //
  const getHistoryMessages = async () => {
    if (isLoadingMessage.current) {
      return;
    }
    isLoadingMessage.current = true;
    message.loading(translateString("i18n.loading"));
    //
    const messageRequest: MESSAGE.HttpRequest = {
      pageNumber: pageNumber,
      pageSize: 20,
      //
      threadTopic: currentThread?.topic,
    };
    const response = await queryMessagesByThreadTopic(messageRequest);
    console.log("queryMessages: ", response.data, messageRequest);
    message.destroy();
    if (response.data.code === 200) {
      addMessageList(response.data.data.content);
      //
      if (!response.data.data.last) {
        // 还有更多聊天记录待拉取
        setPageNumber(pageNumber + 1);
        // setRefreshing(false);
      } else {
        setLoadMoreText("");
        message.success(translateString("i18n.load.nomore"));
      }
    } else if (response.data.code === 601) {
      // 匿名访问拦截
    } else {
      message.error(response.data.message);
    }
    isLoadingMessage.current = false;
  };
  //
  useEffect(() => {
    setPageNumber(0);
    setLoadMoreText(translateString("i18n.load.more"));
    // resetList();
    // console.log("useEffect 1: ", currentThread.user.nickname, messages.length);
    if (messageList.length === 0) {
      getHistoryMessages();
    }
    //
    let moreToolbarQuickButtons = [];
    if (IS_DEBUG) {
      const audioQuickButton = {
        name: intl.formatMessage({
          id: "chat.toolbar.audio",
          defaultMessage: "录音",
        }),
        type: "audio",
        code: "audio",
        icon: "mic",
        isHighlight: false,
      };
      moreToolbarQuickButtons.push(audioQuickButton);
      //
      const webrtcQuickButton = {
        name: intl.formatMessage({
          id: "chat.toolbar.webrtc",
          defaultMessage: "视频会话",
        }),
        type: "webrtc",
        code: "webrtc",
        icon: "play-circle",
        isHighlight: false,
      };
      moreToolbarQuickButtons.push(webrtcQuickButton);
    }
    if (isCustomerServiceThread(currentThread)) {
      // 评价按钮
      const rateQuickButton = {
        name: intl.formatMessage({
          id: "chat.toolbar.invite.rate",
          defaultMessage: "邀请评价",
        }),
        type: MESSAGE_TYPE_RATE_INVITE,
        code: MESSAGE_TYPE_RATE_INVITE,
        icon: "thumbs-up",
        isHighlight: false,
      };
      moreToolbarQuickButtons.push(rateQuickButton);
      // 拉黑
      const blockButton = {
        name: intl.formatMessage({
          id: "chat.toolbar.block",
          defaultMessage: "拉黑",
        }),
        type: "block",
        code: "block",
        icon: "thumbs-down",
      };
      moreToolbarQuickButtons.push(blockButton);
      //
      if (IS_DEBUG) {
        // 历史消息
        const historyButton = {
          name: intl.formatMessage({
            id: "chat.toolbar.history",
            defaultMessage: "历史消息",
          }),
          type: "history",
          code: "history",
          icon: "message",
        };
        moreToolbarQuickButtons.push(historyButton);
      }
    }
    if (isRobotThread(currentThread)) {
      defaultQuickButtons = [];
      moreToolbarQuickButtons = [];
    }
    setToolbarQuickButtons([
      ...defaultQuickButtons,
      ...moreToolbarQuickButtons,
    ]);
    if (msgRef.current) {
      msgRef.current.scrollToEnd();
    }
  }, [currentThread, locale]);

  // 输入框回车发送消息
  const handleSend = (type: string, content: string) => {
    console.log("handleSend", type, content);
    setInputText("");
    // TODO: 但给出消息发送状态转圈提示
    if (!isNetworkOnline) {
      message.error(
        intl.formatMessage({
          id: "chat.network.error",
          defaultMessage: "网络连接失败，请检查网络",
        }),
      );
      return;
    }
    if (type === MESSAGE_TYPE_TEXT.toLowerCase() && content.trim()) {
      handleSendText(content);
    } else {
      message.error("暂不支持消息类型");
    }
  };

  // 发送文字消息
  const handleSendText = (content: string) => {
    const uid = getUUid();
    appendMsg({
      _id: uid,
      type: MESSAGE_TYPE_TEXT,
      status: MESSAGE_STATUS_SENDING,
      hasTime: true,
      createdAt: moment().toDate().getTime(),
      content: content,
      position: "right",
      user: {
        avatar: isCustomerServiceThread(currentThread)
          ? agentInfo.avatar
          : userInfo.avatar,
      },
    });
    mqttSendTextMessage(uid, content);
    //
    msgRef.current.scrollToEnd();
    console.log("scrollToEnd:", msgRef);
  };
  //
  useEffect(() => {
    console.log("debouncedPreviewText", debouncedPreviewText);
    // 客服端不能发送preview消息，发送typing状态消息
    if (
      currentThread?.topic.length > 0 &&
      debouncedPreviewText.trim().length > 0
    ) {
      mqttSendTypingMessage(currentThread);
    }
  }, [debouncedPreviewText, currentThread]);

  // 输入框内容变化
  const handleInputChange = (content: string) => {
    // console.log("handleInputChange", content);
    setInputText(content);
    setPreviewText(content);
  };

  // 在输入框 ctrl + v 粘贴图片
  const handleImageSend = (file: File): Promise<any> => {
    console.log("handleImageSend", file);
    handleUpload(file, (result: MESSAGE.HttpUploadResult) => {
      handleDropSend(result.data.fileUrl, MESSAGE_TYPE_IMAGE);
    });
    return null;
  };

  // 点击工具栏图片按钮
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImageChange event: ", event);
    const file = event.target.files?.item(0);
    if (file) {
      console.log("handleImageChange file: ", file);
      handleUpload(file, (result: MESSAGE.HttpUploadResult) => {
        handleDropSend(result.data.fileUrl, MESSAGE_TYPE_IMAGE);
      });
    }
  };

  // 点击工具栏文件按钮
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange event: ", event);
    const file = event.target.files?.item(0);
    if (file) {
      console.log("handleFileChange file: ", file);
      handleUpload(file, (result: MESSAGE.HttpUploadResult) => {
        handleDropSend(result.data.fileUrl, MESSAGE_TYPE_FILE);
      });
    }
  };

  // 发送图片和文件
  const handleDropSend = (url: string, type: string) => {
    console.log("handleImageDropSend", url);
    const uid = getUUid();
    appendMsg({
      _id: uid,
      type: type,
      status: MESSAGE_STATUS_SENDING,
      hasTime: true,
      createdAt: moment().toDate().getTime(),
      content: url,
      position: "right",
      user: {
        avatar: userInfo.avatar,
      },
    });
    mqttSendMessage(uid, type, url, currentThread);
    //
    msgRef.current.scrollToEnd();
    console.log("scrollToEnd:", msgRef);
  };

  const handleAutoReplyModelOk = () => {
    console.log("handleAutoReplyModelOk");
    setIsAutoReplyModelOpen(false);
  };

  const handleAutoReplyModelCancel = () => {
    console.log("handleAutoReplyModelCancel");
    setIsAutoReplyModelOpen(false);
  };

  const handleTransferThreadModelOk = () => {
    console.log("handleTransferThreadModelOk");
    setIsTransferThreadModelOpen(false);
  };

  const handleTransferThreadModelCancel = () => {
    console.log("handleTransferThreadModelCancel");
    setIsTransferThreadModelOpen(false);
  };

  const handleForwardMessageModelOk = () => {
    console.log("handleForwardMessageModelOk");
    setIsForwardMessageModelOpen(false);
  };

  const handleForwardMessageModelCancel = () => {
    console.log("handleForwardMessageModelCancel");
    setIsForwardMessageModelOpen(false);
  };

  const handleTransferMessageModelOk = () => {
    console.log("handleTransferMessageModelOk");
    setIsTransferMessageModelOpen(false);
  };

  const handleTransferMessageModelCancel = () => {
    console.log("handleTransferMessageModelCancel");
    setIsTransferMessageModelOpen(false);
  };

  const handleHistoryMessageModelOk = () => {
    console.log("handleHistoryMessageModelOk");
    setIsHistoryMessageModelOpen(false);
  };

  const handleHistoryMessageModelCancel = () => {
    console.log("handleHistoryMessageModelCancel");
    setIsHistoryMessageModelOpen(false);
  };

  const handleTicketCreateModelSuccess = () => {
    console.log("handleTicketCreateModelSuccess");
    setIsTicketCreateModelOpen(false);
  };

  const handleTicketCreateModelCancel = () => {
    console.log("handleTicketCreateModelCancel");
    setIsTicketCreateModelOpen(false);
  };

  const handleBlockModelOk = () => {
    console.log("handleBlockModelOk");
    setIsBlockModelOpen(false);
  };

  const handleBlockModelCancel = () => {
    console.log("handleBlockModelCancel");
    setIsBlockModelOpen(false);
  };

  const handleWebRtcModelOk = () => {
    console.log("handleWebRtcModelOk");
    setIsWebRtcModelOpen(false);
  };

  const handleWebRtcModelCancel = () => {
    console.log("handleWebRtcModelCancel");
    setIsWebRtcModelOpen(false);
  };

  const handleScreenRecorderModelOk = () => {
    console.log("handleScreenRecorderModelOk");
    setIsScreenRecorderModelOpen(false);
  };

  const handleScreenRecorderModelCancel = () => {
    console.log("handleScreenRecorderModelCancel");
    setIsScreenRecorderModelOpen(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log("handleEmojiSelect", emoji);
    setShowEmoji(false);
    setInputText(inputText + emoji);
    composerRef.current.setText(inputText + emoji);
  };

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  const handleQuickButtonClick = (item: QuickReplyItemProps, index: number) => {
    console.log("QuickButton:", item, index);
    if (item.code === MESSAGE_TYPE_RATE_INVITE) {
      // 发起邀请评价
      confirmModel.confirm({
        title: intl.formatMessage({
          id: "chat.rate.invite.confirm.title",
          defaultMessage: "确认要邀请评价？",
        }),
        // icon: <ExclamationCircleOutlined />,
        // content: "Bla bla ...",
        okText: intl.formatMessage({
          id: "common.confirm",
          defaultMessage: "确认",
        }),
        cancelText: intl.formatMessage({
          id: "common.cancel",
          defaultMessage: "取消",
        }),
        onOk: () => {
          mqttSendRateInviteMessage(currentThread);
        },
        onCancel: () => {
          console.log("onCancel");
        },
      });
    } else if (item.code === "autoreply") {
      // 自动回复
      setIsAutoReplyModelOpen(true);
    } else if (item.type === "emoji") {
      // 表情
      setShowEmoji(true);
    } else if (item.type === "image") {
      // 图片
      imageInputRef.current.click();
    } else if (item.type === "file") {
      // 文件
      fileInputRef.current.click();
    } else if (item.type === "screenshot") {
      // 截图
      startCaptureScreen();
      // setIsScreenRecorderModelOpen(true);
      if (!IS_ELECTRON) {
        getShotScreenImg();
      }
    } else if (item.type === "audio") {
      // TODO: 设置语音消息
      setIsWebRtcModelOpen(true);
    } else if (item.type === "webrtc") {
      setIsWebRtcModelOpen(true);
    } else if (item.type === "history") {
      setIsHistoryMessageModelOpen(true);
    } else if (item.type === "block") {
      setIsBlockModelOpen(true);
    }
  };

  const getMessagePosition = (item: MESSAGE.MessageResponse) => {
    // 访客留言显示在左侧
    if (item?.type === MESSAGE_TYPE_LEAVE_MSG) {
      return "left";
    }
    if (isCustomerServiceThread(currentThread)) {
      return item?.user?.uid === agentInfo?.uid ? "right" : "left";
    }
    return item?.user?.uid === userInfo?.uid ? "right" : "left";
  };

  useEffect(() => {
    // console.log("useEffect 2:", currentThread.user.nickname, messages.length);
    const list = [];
    messageList.forEach((item) => {
      let flag = false;
      if (isOrgMemberTopic(currentThread?.topic)) {
        const reverseTopic = getOrgMemberTopicReverse(currentThread?.topic);
        console.log(
          "useEffect messageList :",
          item?.threadTopic,
          currentThread?.topic,
          reverseTopic,
        );
        if (item?.threadTopic === currentThread?.topic) {
          flag = true;
        } else if (item?.threadTopic === reverseTopic) {
          flag = true;
        }
      } else if (item?.threadTopic === currentThread?.topic) {
        flag = true;
      }
      if (flag) {
        list.push({
          _id: item?.uid,
          type: item?.type,
          status: item?.status,
          hasTime: true,
          createdAt: moment(item?.createdAt).toDate().getTime(),
          content: translateString(item?.content),
          position: getMessagePosition(item),
          user: {
            avatar: item?.user?.avatar,
            name: translateString(item?.user?.nickname),
          },
        });
      }
    });
    resetList(list);
  }, [messageList, currentThread]);

  //
  const handleResendMessage = (message: MessageProps) => {
    // 点击发送失败红点，重试发送消息
    console.log("handleResendMessage", message);
    const { _id, type, content } = message;
    mqttSendMessage(_id.toString(), type, content, currentThread);
  };

  const renderMessageContent = (message: MessageProps): React.ReactNode => {
    const { _id, type, content, position, status } = message;
    // TODO: 向服务器发送已读回执，TODO: 限定非己发送的消息，才会发生回执
    // if (
    //   position === "left" &&
    //   shouldSendReceipt(type) &&
    //   status != MESSAGE_STATUS_READ
    // ) {
    //   mqttSendReceiptReadMessage(message._id.toString(), currentThread);
    //   // 更新本地消息状态
    //   updateMessageStatus(message._id.toString(), MESSAGE_STATUS_READ);
    // }
    // console.log("renderMessageContent", message);
    // 根据消息类型来渲染
    switch (type) {
      case MESSAGE_TYPE_WELCOME:
      case MESSAGE_TYPE_TEXT:
        return (
          <>
            <Bubble
              content={translateString(content)}
              isRichText={isRichText(content)}
              onContextMenu={() => handleContextMenu(event, message)}
            ></Bubble>
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      case MESSAGE_TYPE_STREAM:
        return (
          <>
            <StreamQa
              uid={_id.toString()}
              content={content}
              thread={currentThread}
            />
            {position === "right" && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      case MESSAGE_TYPE_NOTICE:
        return (
          <>
            <NoticeMsg content={translateString(content)}></NoticeMsg>
          </>
        );
      case MESSAGE_TYPE_IMAGE:
        return (
          <>
            <Bubble
              type="image"
              onContextMenu={() => handleContextMenu(event, message)}
            >
              <PhotoView src={content}>
                <img src={content} alt="" />
              </PhotoView>
            </Bubble>
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      case MESSAGE_TYPE_FILE:
        return (
          <>
            <Bubble
              type="file"
              onContextMenu={() => handleContextMenu(event, message)}
            >
              <FileCard fileUrl={content}>
                <Button onClick={() => openUrl(content)}>下载文件</Button>
              </FileCard>
            </Bubble>
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      case MESSAGE_TYPE_VIDEO:
        return (
          <>
            <Bubble
              style={{ maxWidth: 200 }}
              onContextMenu={() => handleContextMenu(event, message)}
            >
              <Video src={message.content} />
            </Bubble>
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      case MESSAGE_TYPE_GOODS:
        return (
          <>
            <Card size="xl">
              <Goods
                img="//gw.alicdn.com/tfs/TB1p_nirYr1gK0jSZR0XXbP8XXa-300-300.png"
                name="这个商品名称非常非常长长到会换行"
                desc="商品描述"
                tags={[
                  { name: "3个月免息" },
                  { name: "4.1折" },
                  { name: "黑卡再省33.96" },
                ]}
                currency="¥"
                // price="849"
                // originalPrice="1,999"
                meta="7人付款"
                count={6}
                unit="kg"
                onClick={(e) => console.log(e)}
                action={{
                  // icon: 'cart',
                  onClick(e) {
                    console.log(e);
                    e.stopPropagation();
                  },
                }}
              />
            </Card>
          </>
        );
      case MESSAGE_TYPE_LEAVE_MSG:
        return (
          <>
            <LeaveMsg content={content} status={status} type={type} />
          </>
        );
      case MESSAGE_TYPE_FAQ:
        return (
          <>
            <Bubble onContextMenu={() => handleContextMenu(event, message)}>
              <FaqQa uid={_id.toString()} content={content} />
            </Bubble>
          </>
        );
      case MESSAGE_TYPE_ROBOT:
        return (
          <>
            <Bubble onContextMenu={() => handleContextMenu(event, message)}>
              <RobotQa uid={_id.toString()} />
            </Bubble>
          </>
        );
      case MESSAGE_TYPE_RATE:
      case MESSAGE_TYPE_RATE_INVITE:
        return (
          <>
            <RateBubble
              uid={_id.toString()}
              content={content}
              status={status}
              type={type}
            />
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      case MESSAGE_TYPE_TRANSFER:
      case MESSAGE_TYPE_TRANSFER_ACCEPT:
      case MESSAGE_TYPE_TRANSFER_REJECT:
        return (
          <>
            <TransferBubble
              uid={_id.toString()}
              content={translateString(content)}
              status={status}
              position={position}
            />
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
      default:
        return (
          <>
            <Bubble
              content={translateString(content)}
              onContextMenu={() => handleContextMenu(event, message)}
            />
            {position === "right" && !isGroupThread(currentThread) && (
              <MessageStatus
                status={status}
                onRetry={() => handleResendMessage(message)}
              />
            )}
          </>
        );
    }
  };
  //
  async function getShotScreenImg() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;
        videoElement.play();

        videoElement.addEventListener("loadedmetadata", () => {
          const context = canvas.getContext("2d");
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          // canvas的内容转化为PNG格式的DataURL
          const dataURL = canvas.toDataURL("image/png");
          console.log("dataURL:", dataURL);
          setScreenShotImg(dataURL);
          setIsScreenRecorderModelOpen(true);
          // setScreenShotImg(canvas.toDataURL("image/png"));
          stream.getTracks().forEach((track) => track.stop());
        });
      })
      .catch((error) => {
        console.error("Error accessing screen:", error);
      });
  }
  //
  useEffect(() => {
    const handleMessageTypeStatus = (message: string) => {
      // console.log("handleMessageTypeStatus", message, messages);
      const uidTypeObject = JSON.parse(message);
      const uid = uidTypeObject?.uid?.toString(); // 确保uid是字符串类型
      const msg = messages.find((msg) => {
        const msgIdStr = msg._id.toString(); // 将_id转换为字符串以便比较
        // console.log(`Comparing ${msgIdStr} with ${uid}`); // 打印对比过程
        return msgIdStr === uid; // 返回比较结果
      });
      //
      if (msg) {
        updateMsg(uidTypeObject?.uid, {
          _id: msg?._id,
          type: msg?.type,
          hasTime: msg?.hasTime,
          createdAt: msg?.createdAt,
          content: msg?.content,
          position: msg?.position,
          user: msg?.user,
          status: uidTypeObject?.type,
        });
      } else {
        console.log("handleMessageTypeStatus msg is undefined");
      }
    };
    const handleMessageTypeTyping = () => {
      // console.log("handleMessageTypeTyping");
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 3000);
    };
    const handleMessageTypePreview = (messageContent: string) => {
      console.log("handleMessageTypePreview", messageContent);
      handleMessageTypeTyping();
      // 显示预知消息
      setPreviewContent(translateString("i18n.typing") + messageContent);
      setTimeout(() => {
        setPreviewContent("");
      }, 5000);
    };
    const handleMessageTypeProcessing = () => {
      // console.log('handleMessageTypeProcessing');
      setTyping(true);
    };
    const handleMessageTypeStream = () => {
      setTyping(false);
    };
    //
    const handleTransferLocal = () => {
      console.log("handleTransferLocal");
      setIsTransferThreadModelOpen(true);
    };
    const handleTransferAccept = (content: string) => {
      console.log("handleTransferAccept:", content);
      const contentObject: MESSAGE.TransferMessage = JSON.parse(content);
      const transferObject: MESSAGE.TransferConfirmObject = JSON.parse(
        contentObject.message?.content,
      );
      const uid = transferObject?.uid?.toString(); // 确保uid是字符串类型
      const msg = messages.find((msg) => {
        const msgIdStr = msg._id.toString(); // 将_id转换为字符串以便比较
        // console.log(`Comparing ${msgIdStr} with ${uid}`); // 打印对比过程
        return msgIdStr === uid; // 返回比较结果
      });
      //
      if (msg) {
        updateMsg(transferObject?.uid, {
          _id: msg?._id,
          type: msg?.type,
          hasTime: msg?.hasTime,
          createdAt: msg?.createdAt,
          content: msg?.content,
          position: msg?.position,
          user: msg?.user,
          status: MESSAGE_TYPE_TRANSFER_ACCEPT,
        });
      } else {
        console.log("handleMessageTypeStatus msg is undefined");
      }
    };
    //
    const handleTransferReject = (content: string) => {
      console.log("handleTransferReject:", content);
      const contentObject: MESSAGE.TransferMessage = JSON.parse(content);
      const transferObject: MESSAGE.TransferConfirmObject = JSON.parse(
        contentObject.message?.content,
      );
      const uid = transferObject?.uid?.toString(); // 确保uid是字符串类型
      const msg = messages.find((msg) => {
        const msgIdStr = msg._id.toString(); // 将_id转换为字符串以便比较
        // console.log(`Comparing ${msgIdStr} with ${uid}`); // 打印对比过程
        return msgIdStr === uid; // 返回比较结果
      });
      //
      if (msg) {
        updateMsg(transferObject?.uid, {
          _id: msg?._id,
          type: msg?.type,
          hasTime: msg?.hasTime,
          createdAt: msg?.createdAt,
          content: msg?.content,
          position: msg?.position,
          user: msg?.user,
          status: MESSAGE_TYPE_TRANSFER_REJECT,
        });
      } else {
        console.log("handleMessageTypeStatus msg is undefined");
      }
    };
    const handleSendImageMessage = (message: string) => {
      console.log("EVENT_BUS_SEND_IMAGE_MESSAGE", message);
      const uid = getUUid();
      appendMsg({
        _id: uid,
        type: MESSAGE_TYPE_IMAGE,
        status: MESSAGE_STATUS_SENDING,
        createdAt: moment().toDate().getTime(),
        content: message,
        position: "right",
        user: {
          avatar: userInfo?.avatar,
          name: userInfo?.nickname,
        },
      });
      mqttSendImageMessage(uid, message);
    };
    const handleSendFileMessage = (message: string) => {
      console.log("EVENT_BUS_SEND_FILE_MESSAGE", message);
      const uid = getUUid();
      appendMsg({
        _id: uid,
        type: MESSAGE_TYPE_FILE,
        status: MESSAGE_STATUS_SENDING,
        // hasTime: true,
        createdAt: moment().toDate().getTime(),
        content: message,
        position: "right",
        user: {
          avatar: userInfo?.avatar,
          name: userInfo?.nickname,
        },
      });
      mqttSendFileMessage(uid, message);
    };
    const handleScreenCaptureImage = (image: string) => {
      console.log("handleScreenCaptureImage", image);
      setScreenShotImg(image);
      setIsScreenRecorderModelOpen(true);
    };
    const handleQuickReplySend = (content: string) => {
      console.log("handleQuickButtonClick", content);
      const quickReply: QUICKREPLY.QuickreplyResponseAgent =
        JSON.parse(content);
      const uid = getUUid();
      appendMsg({
        _id: uid,
        type: quickReply.type,
        status: MESSAGE_STATUS_SENDING,
        createdAt: moment().toDate().getTime(),
        content: quickReply.content,
        position: "right",
        user: {
          avatar: userInfo?.avatar,
          name: userInfo?.nickname,
        },
      });
      mqttSendMessage(uid, quickReply.type, quickReply.content, currentThread);
    };
    //
    emitter.on(EVENT_BUS_MESSAGE_TYPE_STATUS, handleMessageTypeStatus);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TYPING, handleMessageTypeTyping);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_PREVIEW, handleMessageTypePreview);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_PROCESSING, handleMessageTypeProcessing);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_STREAM, handleMessageTypeStream);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL, handleTransferLocal);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT, handleTransferAccept);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT, handleTransferReject);
    emitter.on(EVENT_BUS_SEND_IMAGE_MESSAGE, handleSendImageMessage);
    emitter.on(EVENT_BUS_SEND_FILE_MESSAGE, handleSendFileMessage);
    emitter.on(EVENT_BUS_SCREEN_CAPTURE_IMAGE, handleScreenCaptureImage);
    emitter.on(EVENT_BUS_QUICKREPLY_SEND, handleQuickReplySend);
    //
    return () => {
      emitter.off(EVENT_BUS_SEND_IMAGE_MESSAGE);
      emitter.off(EVENT_BUS_SEND_FILE_MESSAGE);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TYPING, handleMessageTypeTyping);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_STATUS, handleMessageTypeStatus);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_PREVIEW, handleMessageTypePreview);
      emitter.off(
        EVENT_BUS_MESSAGE_TYPE_PROCESSING,
        handleMessageTypeProcessing,
      );
      emitter.off(EVENT_BUS_MESSAGE_TYPE_STREAM, handleMessageTypeStream);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL, handleTransferLocal);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT, handleTransferAccept);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT, handleTransferReject);
      emitter.off(EVENT_BUS_SEND_IMAGE_MESSAGE, handleSendImageMessage);
      emitter.off(EVENT_BUS_SEND_FILE_MESSAGE, handleSendFileMessage);
      emitter.off(EVENT_BUS_SCREEN_CAPTURE_IMAGE, handleScreenCaptureImage);
      emitter.off(EVENT_BUS_QUICKREPLY_SEND, handleQuickReplySend);
    };
  }, [messages]);

  // TODO: 替换为真实数据
  const mentionOptions = {
    "@": [
      { value: "all", label: "所有人" },
      { value: "one", label: "Person" },
    ],
    "/": [
      { value: "test1", label: "Test1" },
      { value: "test2", label: "Test2" },
    ],
  };

  

  return (
    <>
      {isDarkMode && (
        <Helmet>
          <link
            rel="stylesheet"
            type="text/css"
            href={CHATUI_THEME_DARK_CSS}
          ></link>
        </Helmet>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }} // 隐藏文件输入元素
        ref={imageInputRef}
        onChange={handleImageChange}
      />
      <input
        type="file"
        style={{ display: "none" }} // 隐藏文件输入元素
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <DropUpload
        onImageSend={handleDropSend}
      >
        <ChatHeader
          typing={typing}
          previewContent={previewContent}
          setIsTransferThreadModelOpen={setIsTransferThreadModelOpen}
          setIsTicketCreateModelOpen={setIsTicketCreateModelOpen}
          showCloseThreadConfirm={showCloseThreadConfirm}
          setIsGroupInfoDrawerOpen={setIsGroupInfoDrawerOpen}
          setIsMemberInfoDrawerOpen={setIsMemberInfoDrawerOpen}
          setIsRobotInfoDrawerOpen={setIsRobotInfoDrawerOpen}
        />
        {currentThread?.topic === "" ? (
          <>
            <Empty style={{ marginTop: 200 }} description={false} />
          </>
        ) : (
          <>
            <PhotoProvider>
              <Chat
                elderMode={false} // 老年模式
                loadMoreText={loadMoreText}
                onRefresh={getHistoryMessages}
                messages={messages}
                isTyping={typing}
                showTransition={false}
                translationPlaceholder={intl.formatMessage({
                  id: "chat.translation.placeholder",
                  defaultMessage: "请输入翻译内容...",
                })}
                messagesRef={msgRef}
                renderMessageContent={renderMessageContent}
                text={inputText}
                composerRef={composerRef}
                inputOptions={{
                  showCount: true,
                }}
                // inputType='text'
                // onInputTypeChange={handleInputTypeChange}
                quickReplies={toolbarQuickButtons}
                onQuickReplyClick={handleQuickButtonClick}
                onSend={handleSend}
                placeholder={intl.formatMessage({
                  id: "chat.input.placeholder",
                  defaultMessage: "请输入内容, Ctrl+V 粘贴截图/图片",
                })}
                onInputChange={handleInputChange}
                onImageSend={handleImageSend}
                wideBreakpoint="600px" // 屏幕宽度小于600px的时候，左侧按钮显示为右侧加号plus按钮
                recorder={{ canRecord: false }}
                metionOptions={mentionOptions}
                // toolbar={initialToolbars}
                // onToolbarClick={handleToolbarClick}
                // rightAction={rightActions}
                // onAccessoryToggle={handleAccessoryToggle}
              />
            </PhotoProvider>
            {/* https://github.com/fkhadra/react-contexify */}
            <Menu id={MENU_ID} theme={isDarkMode ? "dark" : "light"}>
              <Item id="copy" onClick={handleRightClick}>
                {intl.formatMessage({
                  id: "chat.menu.copy",
                  defaultMessage: "复制",
                })}
              </Item>
              {contextMessage?.type === MESSAGE_TYPE_TEXT && (
                <Item id="translate" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.translate",
                    defaultMessage: "翻译",
                  })}
                </Item>
              )}
              {contextMessage?.position === "right" && (
                <Item id="recall" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.recall",
                    defaultMessage: "撤回",
                  })}
                </Item>
              )}
              {IS_ELECTRON && contextMessage?.type === MESSAGE_TYPE_TEXT && (
                <Item id="enlarge" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.enlarge",
                    defaultMessage: "放大阅读",
                  })}
                </Item>
              )}
              {hasRoleAgent && (
                <Item id="addquickreply" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.quickreply.add",
                    defaultMessage: "添加快捷回复...",
                  })}
                </Item>
              )}
              {contextMessage?.type === MESSAGE_TYPE_IMAGE && (
                <>
                  <Separator />
                  {/* <Item id="download" onClick={handleRightClick}>
                        下载图片
                      </Item> */}
                  <Item id="browser-open" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.browser.open",
                      defaultMessage: "浏览器打开",
                    })}
                  </Item>
                </>
              )}
              {IS_DEBUG && (
                <>
                  <Separator />
                  <Item id="forward" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.forward",
                      defaultMessage: "转发...",
                    })}
                  </Item>
                  <Item id="collect" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.collect",
                      defaultMessage: "收藏",
                    })}
                  </Item>
                  <Item id="quote" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.quote",
                      defaultMessage: "引用",
                    })}
                  </Item>
                </>
              )}
              {/* <Separator /> */}
              {/* <Item id="delete" onClick={handleRightClick}>
                删除
              </Item> */}
              {/* <Submenu label="Foobar">
                <Item id="reload" onClick={handleRightClick}>Reload</Item>
              </Submenu> */}
            </Menu>
          </>
        )}
        <ChatModels
          isAutoReplyModelOpen={isAutoReplyModelOpen}
          handleAutoReplyModelOk={handleAutoReplyModelOk}
          handleAutoReplyModelCancel={handleAutoReplyModelCancel}
          isTransferThreadModelOpen={isTransferThreadModelOpen}
          handleTransferThreadModelOk={handleTransferThreadModelOk}
          handleTransferThreadModelCancel={handleTransferThreadModelCancel}
          isForwardMessageModelOpen={isForwardMessageModelOpen}
          handleForwardMessageModelOk={handleForwardMessageModelOk}
          handleForwardMessageModelCancel={handleForwardMessageModelCancel}
          isTransferMessageModelOpen={isTransferMessageModelOpen}
          handleTransferMessageModelOk={handleTransferMessageModelOk}
          handleTransferMessageModelCancel={handleTransferMessageModelCancel}
          isHistoryMessageModelOpen={isHistoryMessageModelOpen}
          handleHistoryMessageModelOk={handleHistoryMessageModelOk}
          handleHistoryMessageModelCancel={handleHistoryMessageModelCancel}
          isTicketCreateModelOpen={isTicketCreateModelOpen}
          handleTicketCreateModelSuccess={handleTicketCreateModelSuccess}
          handleTicketCreateModelCancel={handleTicketCreateModelCancel}
          isBlockModelOpen={isBlockModelOpen}
          handleBlockModelOk={handleBlockModelOk}
          handleBlockModelCancel={handleBlockModelCancel}
          isWebRtcModelOpen={isWebRtcModelOpen}
          handleWebRtcModelOk={handleWebRtcModelOk}
          handleWebRtcModelCancel={handleWebRtcModelCancel}
          isScreenRecorderModelOpen={isScreenRecorderModelOpen}
          screenShotImg={screenShotImg}
          handleScreenRecorderModelOk={handleScreenRecorderModelOk}
          handleScreenRecorderModelCancel={handleScreenRecorderModelCancel}
          isGroupInfoDrawerOpen={isGroupInfoDrawerOpen}
          setIsGroupInfoDrawerOpen={setIsGroupInfoDrawerOpen}
          isMemberInfoDrawerOpen={isMemberInfoDrawerOpen}
          
          />
        
        {contextHolder}
      </DropUpload>
    </>
  );
};

export default ChatPage;