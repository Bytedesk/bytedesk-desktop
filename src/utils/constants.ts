/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 14:56:50
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-05 13:26:05
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
export const SERVER_MODE_DEV = "dev";
export const SERVER_MODE_OPEN = "open";
export const SERVER_MODE_PROD = "prod";
// 获取环境变量
const configEnv = import.meta.env.VITE_CONFIG_ENV || "prod";
console.log('Current VITE_CONFIG_ENV:', import.meta.env.VITE_CONFIG_ENV);
// 根据环境变量动态引入配置文件
let config: MYCONFIG.Consts;
switch (configEnv) {
  case "dev":
    config = {
      API_URL: "http://127.0.0.1:9003",
      MQTT_URL: "ws://127.0.0.1:9885/websocket",
      HTML_URL: "http://127.0.0.1:9006",
      IS_DEBUG: true,
      SERVER_MODE: SERVER_MODE_DEV,
      CLIENT: "WEB",
    };
    break;
  case "prod-open":
    config = {
      API_URL: "http://127.0.0.1:9003",
      MQTT_URL: "ws://127.0.0.1:9885/websocket",
      HTML_URL: "http://127.0.0.1:9003",
      IS_DEBUG: false,
      SERVER_MODE: SERVER_MODE_OPEN,
      CLIENT: "WEB",
    };
    break;
  case "prod-web":
    config = {
      API_URL: "https://api.weiyuai.cn",
      MQTT_URL: "wss://api.weiyuai.cn/websocket",
      HTML_URL: "https://www.weiyuai.cn",
      IS_DEBUG: false,
      SERVER_MODE: SERVER_MODE_PROD,
      CLIENT: "WEB",
    };
    break;
  default:
    config = {
      API_URL: "https://api.weiyuai.cn",
      MQTT_URL: "wss://api.weiyuai.cn/websocket",
      HTML_URL: "https://www.weiyuai.cn",
      IS_DEBUG: false,
      SERVER_MODE: SERVER_MODE_PROD,
      CLIENT: "ELECTRON", // TODO: 区分mac/windows/linux
    };
}
console.log('config.API_BASE_URL: ', configEnv, config)
// 区分electron和web
export const IS_ELECTRON =
  navigator.userAgent.toLowerCase().indexOf("electron") > -1;
// 默认云服务器
export const API_BASE_URL = config.API_URL;
export const MQTT_WSS_URL = config.MQTT_URL;
export const CHAT_CLIENT_URL = config.HTML_URL;
//
export const IS_DEBUG = config.IS_DEBUG;
export const SERVER_MODE = config.SERVER_MODE;
//
export const HTTP_CLIENT = config.CLIENT;
// 微语
export const PLATFORM = "BYTEDESK";
export const ELECTRON = "ELECTRON";
export const WEB = "WEB";
// 开发环境
export const DEVELOPMENT = "development";
export const OPEN_SOURCE = "opensource";
export const PRODUCTION = "production";
//
export const SERVER_EDITION_COMMUNITY = "community";
export const SERVER_EDITION_ENTERPRISE = "enterprise";
// 
export const LOCALE = "locale";
export const MODE = "mode";
export const MODE_TEAM = "team"; // 团队
export const MODE_AGENT = "agent"; // 客服
export const MODE_PERSONAL = "personal"; // 个人
export const MODE_ANONYMOUS = "anonymous"; // 匿名
export const I18N_PREFIX = "i18n.";
export const I18N_NEW_MESSAGE = "i18n.new.message";
// 匿名
export const ANONYMOUS = "ANONYMOUS";
// electron
export const DEEP_LINK_WEIYUIM = "bytedesk";
// export const OPEN_AT_LOGIN = "openAtLogin";
export const STORAGE_KEY = 'bytedesk_login_credentials';
//
export const THEME_MODE_TYPE = "THEME_MODE_TYPE";
export const THEME_MODE_TYPE_LIGHT = "light";
export const THEME_MODE_TYPE_DARK = "dark";
export const THEME_MODE_TYPE_SYSTEM = "system";
//
export const THEME_NAME_TYPE = "THEME_NAME_TYPE";
export const THEME_NAME_TYPE_DARK = "dark";
export const THEME_NAME_TYPE_LIGHT = "light";
//
export const PLAY_AUDIO = "PLAY_AUDIO";
export const NETWORK_STATUS_NOTIFICATION = "NETWORK_STATUS_NOTIFICATION";
//
export const CONFIG_ENABLED = "CONFIG_ENABLED_AGENT";
export const CONFIG_API_URL = "CONFIG_API_URL_AGENT";
export const CONFIG_WEBSOCKET_URL = "CONFIG_WEBSOCKET_URL_AGENT";
export const CONFIG_HTML_URL = "CONFIG_HTML_URL_AGENT";
// 
export const CONFIG_CUSTOM_ENABLED = "CONFIG_CUSTOM_ENABLED_AGENT";
export const CONFIG_CUSTOM_API_URL = "CONFIG_CUSTOM_API_URL_AGENT";
export const CONFIG_CUSTOM_WEBSOCKET_URL = "CONFIG_CUSTOM_WEBSOCKET_URL_AGENT";
export const CONFIG_CUSTOM_HTML_URL = "CONFIG_CUSTOM_HTML_URL_AGENT";
//
export const ORG_TREE_TYPE_ORGANIZATION = "organization";
export const ORG_TREE_TYPE_DEPARTMENT = "department";
export const ORG_TREE_TYPE_MEMBER = "member";
//
export const SCREENSHOT_OK = "SCREENSHOT_OK";
// 
export const EVENT_BUS_LOGIN_TIMEOUT = "EVENT_BUS_LOGIN_TIMEOUT";
export const EVENT_BUS_LOGIN_ERROR_400 = "EVENT_BUS_LOGIN_ERROR_400";
export const EVENT_BUS_SERVER_ERROR_500 = "EVENT_BUS_SERVER_ERROR_500";
export const EVENT_BUS_TOKEN_INVALID = "EVENT_BUS_TOKEN_INVALID";
export const EVENT_BUS_MQTT_NOTICE = "EVENT_BUS_MQTT_NOTICE";
//
// export const EVENT_BUS_SWITCH_CHAT_RIGHT_PANEL = "EVENT_BUS_SWITCH_CHAT_RIGHT_PANEL";
export const EVENT_BUS_SWITCH_THEME = "EVENT_BUS_SWITCH_THEME";
// multicast message
export const EVENT_BUS_MULTICAST_MESSAGE_RECEIVED =
  "EVENT_BUS_MULTICAST_MESSAGE_RECEIVED";
export const EVENT_BUS_MULTICAST_BIND_SUCCESS =
  "EVENT_BUS_MULTICAST_BIND_SUCCESS";
//
export const EVENT_BUS_SEND_IMAGE_MESSAGE = "EVENT_BUS_SEND_IMAGE_MESSAGE";
export const EVENT_BUS_SEND_FILE_MESSAGE = "EVENT_BUS_SEND_FILE_MESSAGE";
// mqtt
export const EVENT_BUS_MQTT_MESSAGE = "EVENT_BUS_MQTT_MESSAGE";
export const EVENT_BUS_MQTT_CONNECTED = "EVENT_BUS_MQTT_CONNECTED";
export const EVENT_BUS_MQTT_OFFLINE = "EVENT_BUS_MQTT_OFFLINE";
export const EVENT_BUS_MQTT_CLOSE = "EVENT_BUS_MQTT_CLOSE";
export const EVENT_BUS_MQTT_DISCONNECTED = "EVENT_BUS_MQTT_DISCONNECTED";
export const EVENT_BUS_MQTT_ERROR = "EVENT_BUS_MQTT_ERROR";
export const EVENT_BUS_MQTT_END = "EVENT_BUS_MQTT_END";
//
export const EVENT_BUS_MESSAGE_TYPE_STATUS = "EVENT_BUS_MESSAGE_TYPE_STATUS";
export const EVENT_BUS_MESSAGE_TYPE_TYPING = "EVENT_BUS_MESSAGE_TYPE_TYPING";
export const EVENT_BUS_MESSAGE_TYPE_PROCESSING =
  "EVENT_BUS_MESSAGE_TYPE_PROCESSING";
export const EVENT_BUS_MESSAGE_TYPE_STREAM = "EVENT_BUS_MESSAGE_TYPE_STREAM";
export const EVENT_BUS_MESSAGE_TYPE_PREVIEW = "EVENT_BUS_MESSAGE_TYPE_PREVIEW";
export const EVENT_BUS_MESSAGE_TYPE_TRANSFER =
  "EVENT_BUS_MESSAGE_TYPE_TRANSFER";
export const EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT =
  "EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT";
export const EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT =
  "EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT";
export const EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL =
  "EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL";
//
export const EVENT_BUS_SCREEN_CAPTURE_IMAGE = "EVENT_BUS_SCREEN_CAPTURE_IMAGE";
export const EVENT_BUS_QUICKREPLY_SEND = "EVENT_BUS_QUICKREPLY_SEND";
export const EVENT_BUS_QUICKREPLY_ADD = "EVENT_BUS_QUICKREPLY_ADD";
//
export const HELPCENTER_URL = "https://www.weiyuai.cn/docs/zh-CN";
//
export const AUTH_STORE = "AUTH_STORE";
export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const ORGANIZATION_STORE = "ORGANIZATION_STORE";
export const ROBOT_STORE = "ROBOT_STORE";
export const DEPARTMENT_STORE = "DEPARTMENT_STORE";
export const MEMBER_STORE = "MEMBER_STORE";
export const VISITOR_STORE = "VISITOR_STORE";
export const MESSAGE_STORE = "MESSAGE_STORE";
export const CONTACT_STORE = "CONTACT_STORE";
export const USER_STORE = "USER_STORE";
export const SETTINGS_STORE = "SETTINGS_STORE";
export const THREAD_STORE = "THREAD_STORE";
export const QUEUE_STORE = "QUEUE_STORE";
export const QUEUE_MEMBER_STORE = "QUEUE_MEMBER_STORE";
export const DEVICE_STORE = "DEVICE_STORE";
export const AGENT_STORE = "AGENT_STORE";
export const CATEGORY_STORE = "CATEGORY_STORE";
export const WORKGROUP_STORE = "WORKGROUP_STORE";
export const PROVIDER_STORE = "PROVIDER_STORE";
//
export const CONTACT_TYPE_CHANNEL = "channel";
export const CONTACT_TYPE_MEMBER = "member";
export const CONTACT_TYPE_DEVICE = "device";
export const CONTACT_TYPE_FRIEND = "friend";
export const CONTACT_TYPE_GROUP = "group";
// export const CONTACT_TYPE_NEW_FRIEND = "newFriend";
//
export const AUTH_TYPE_MOBILE_REGISTER = "MOBILE_REGISTER";
export const AUTH_TYPE_MOBILE_LOGIN = "MOBILE_LOGIN";
export const AUTH_TYPE_MOBILE_RESET = "MOBILE_RESET";
export const AUTH_TYPE_MOBILE_VERIFY = "MOBILE_VERIFY";
export const AUTH_TYPE_EMAIL_REGISTER = "EMAIL_REGISTER";
export const AUTH_TYPE_EMAIL_LOGIN = "EMAIL_LOGIN";
export const AUTH_TYPE_EMAIL_RESET = "EMAIL_RESET";
export const AUTH_TYPE_EMAIL_VERIFY = "EMAIL_VERIFY"
//
export const PUSH_STATUS_PENDING = "PENDING";
export const PUSH_STATUS_SCANNED = "SCANNED";
export const PUSH_STATUS_CONFIRMED = "CONFIRMED";
export const PUSH_STATUS_EXPIRED = "EXPIRED";
//
// 声音叮咚
export const SOUND_DINGDONG_URL =
  "https://cdn.weiyuai.cn/agent/assets/sound/dingdong.wav";
// export const SOUND_DINGDONG_URL_WEB = "/agent/assets/sound/dingdong.wav";
export const CHATUI_THEME_DARK_CSS =
  "https://cdn.weiyuai.cn/agent/assets/css/chatui/chatui-theme-dark.css";
export const WINDOWS_SCROLLBAR_CSS =
  "https://cdn.weiyuai.cn/agent/assets/css/scrollbar.css";
export const DOWNLOAD_URL = "https://www.weiyuai.cn/download.html";
// 创建LLM对话默认使用智谱AI作为头像
export const LLM_THREAD_DEFAULT_AVATAR =
  "https://cdn.weiyuai.cn/assets/images/llm/provider/zhipu.png";

// 上传文件类型
// 上传自定义表情
export const UPLOAD_FILE_TYPE_EMOJI = "emoji";
// 上传头像
export const UPLOAD_FILE_TYPE_AVATAR = "avatar";
// 上传图片
export const UPLOAD_FILE_TYPE_IMAGE = "image";
// 上传语音
export const UPLOAD_FILE_TYPE_VOICE = "voice";
// 上传视频
export const UPLOAD_FILE_TYPE_VIDEO = "video";
// 上传文件
export const UPLOAD_FILE_TYPE_FILE = "file";

// 通知类型
export const NOTIFICATION_THREAD = "notification_thread";
// 正在输入
export const NOTIFICATION_TYPING = "notification_typing";

// 服务器回复客户端，已经收到。消息发送成功
export const NOTIFICATION_ACK_SUCCESS = "notification_ack_success";
// 消息送达
export const NOTIFICATION_ACK_RECEIVED = "notification_ack_received";
// 消息已读
export const NOTIFICATION_ACK_READ = "notification_ack_read";

// 普通通知
export const NOTICE_TYPE_NORMAL = "normal";
// 工单相关通知
export const NOTICE_TYPE_TICKET = "ticket";
// 待办任务
export const NOTICE_TYPE_TODO = "todo";
//
export const USER_TYPE_AGENT = "AGENT";
export const USER_TYPE_SYSTEM = "SYSTEM";
export const USER_TYPE_VISITOR = "VISITOR";
export const USER_TYPE_ROBOT = "ROBOT";
export const USER_TYPE_MEMBER = "MEMBER";
export const USER_TYPE_ASSISTANT = "ASSISTANT";
export const USER_TYPE_CHANNEL = "CHANNEL";
export const USER_TYPE_LOCAL = "LOCAL";
export const USER_TYPE_USER = "USER";
export const USER_TYPE_MONITOR = "MONITOR";

// 会话类型
export const THREAD_TYPE_AGENT = "AGENT"; //   一对一客服会话
export const THREAD_TYPE_WORKGROUP = "WORKGROUP"; // 工作组客服会话
export const THREAD_TYPE_ROBOT = "ROBOT"; // 机器人客服会话
// 
export const THREAD_TYPE_MEMBER = "MEMBER"; // 同事一对一会话
export const THREAD_TYPE_GROUP = "GROUP"; // 群组会话
export const THREAD_TYPE_FEEDBACK = "FEEDBACK"; // 反馈会话
export const THREAD_TYPE_ASSISTANT = "ASSISTANT"; // 助手会话
export const THREAD_TYPE_CHANNEL = "CHANNEL"; // 渠道会话
export const THREAD_TYPE_LOCAL = "LOCAL"; // 本地会话
export const THREAD_TYPE_FRIEND = "FRIEND"; // 好友会话
export const THREAD_TYPE_TICKET = "TICKET"; // 工单会话
// 
// export const THREAD_TYPE_KB = "KB"; // 知识库会话
// export const THREAD_TYPE_KBDOC = "KBDOC"; // 知识库文档会话
export const THREAD_TYPE_LLM = "LLM"; // 大模型会话
//
export const THREAD_STATE_QUEUING = "QUEUING"; // 排队中
export const THREAD_STATE_STARTED = "STARTED"; // 会话进行中，访客关闭会话页面之后，重新进入
export const THREAD_STATE_OFFLINE = "OFFLINE"; // 客服不在线
export const THREAD_STATE_CLOSED = "CLOSED"; // 会话关闭

// 消息发送状态
// 发送中
export const MESSAGE_STATUS_SENDING = "SENDING"; // sending
export const MESSAGE_STATUS_TIMEOUT = "TIMEOUT"; // network send failed
export const MESSAGE_STATUS_BLOCKED = "BLOCKED"; // in black list
export const MESSAGE_STATUS_STRANGER = "STRANGER"; // not friend
export const MESSAGE_STATUS_ERROR = "ERROR"; // other send error
export const MESSAGE_STATUS_SUCCESS = "SUCCESS"; // send success
export const MESSAGE_STATUS_RECALL = "RECALL"; // recall back
export const MESSAGE_STATUS_DELIVERED = "DELIVERED"; // send to the other client
export const MESSAGE_STATUS_READ = "READ"; // read by the other client
export const MESSAGE_STATUS_DESTROYED = "DESTROYED"; // destroyed after read
export const MESSAGE_STATUS_UNPROCESSED = "UNPROCESSED"; // not processed
export const MESSAGE_STATUS_PROCESSED = "PROCESSED"; // leave message processed
export const MESSAGE_STATUS_LEAVE_MSG_SUBMIT = "LEAVE_MSG_SUBMIT"; // 提交留言
export const MESSAGE_STATUS_RATE_SUBMIT = "RATE_SUBMIT"; // 提交会话评价
export const MESSAGE_STATUS_RATE_CANCEL = "RATE_CANCEL"; // 取消会话评价
export const MESSAGE_STATUS_RATE_UP = "RATE_UP"; // 评价消息up
export const MESSAGE_STATUS_RATE_DOWN = "RATE_DOWN"; // 评价消息down
export const MESSAGE_STATUS_TRANSFER_ACCEPT = "TRANSFER_ACCEPT"; // 转接-接受
export const MESSAGE_STATUS_TRANSFER_REJECT = "TRANSFER_REJECT"; // 转接-拒绝
export const MESSAGE_STATUS_INVITE_ACCEPT = "INVITE_ACCEPT"; // 邀请-接受
export const MESSAGE_STATUS_INVITE_REJECT = "INVITE_REJECT"; // 邀请-拒绝
//
// 消息类型
export const MESSAGE_TYPE_WELCOME = "WELCOME";
export const MESSAGE_TYPE_CONTINUE = "CONTINUE";
export const MESSAGE_TYPE_SYSTEM = "SYSTEM";
export const MESSAGE_TYPE_QUEUE = "QUEUE";
export const MESSAGE_TYPE_NOTICE = "NOTICE"; // 通知消息类型
export const MESSAGE_TYPE_TEXT = "TEXT"; // 文本消息类型
export const MESSAGE_TYPE_IMAGE = "IMAGE"; // 图片消息类型
export const MESSAGE_TYPE_FILE = "FILE"; // 文件消息类型
export const MESSAGE_TYPE_AUDIO = "AUDIO"; // 语音消息类型
export const MESSAGE_TYPE_VIDEO = "VIDEO"; // 视频消息类型
export const MESSAGE_TYPE_MUSIC = "MUSIC";
export const MESSAGE_TYPE_LOCATION = "LOCATION";
export const MESSAGE_TYPE_GOODS = "GOODS";
export const MESSAGE_TYPE_CARD = "CARD";
export const MESSAGE_TYPE_EVENT = "EVENT";
//
export const MESSAGE_TYPE_GUESS = "GUESS"; // 猜你想问
export const MESSAGE_TYPE_HOT = "HOT"; // 热门问题
export const MESSAGE_TYPE_SHORTCUT = "SHORTCUT"; // 快捷路径
export const MESSAGE_TYPE_ORDER = "ORDER"; // 订单
export const MESSAGE_TYPE_POLL = "POLL"; // 投票
export const MESSAGE_TYPE_FORM = "FORM"; // 表单：询前表单
export const MESSAGE_TYPE_LEAVE_MSG = "LEAVE_MSG"; // 留言
export const MESSAGE_TYPE_LEAVE_MSG_SUBMIT = "LEAVE_MSG_SUBMIT"; // 留言提交
export const MESSAGE_TYPE_TICKET = "TICKET"; // 客服工单
export const MESSAGE_TYPE_TYPING = "TYPING"; // 正在输入
export const MESSAGE_TYPE_PROCESSING = "PROCESSING"; // 正在处理，等待大模型回复中
export const MESSAGE_TYPE_STREAM = "STREAM"; // 流式消息TEXT，大模型回复
export const MESSAGE_TYPE_PREVIEW = "PREVIEW"; // 消息预知
export const MESSAGE_TYPE_RECALL = "RECALL"; // 撤回
export const MESSAGE_TYPE_DELIVERED = "DELIVERED"; // 回执: 已送达
export const MESSAGE_TYPE_READ = "READ"; // 回执: 已读
export const MESSAGE_TYPE_QUOTATION = "QUOTATION"; // quotation message
export const MESSAGE_TYPE_KICKOFF = "KICKOFF"; // kickoff other clients
export const MESSAGE_TYPE_SHAKE = "SHAKE"; // shake window
//
export const MESSAGE_TYPE_FAQ = "FAQ"; // 常见问题FAQ
export const MESSAGE_TYPE_FAQ_Q = "FAQ_Q"; // 常见问题FAQ-问题
export const MESSAGE_TYPE_FAQ_A = "FAQ_A"; // 常见问题FAQ-答案
export const MESSAGE_TYPE_FAQ_UP = "FAQ_UP"; // 常见问题答案评价:UP
export const MESSAGE_TYPE_FAQ_DOWN = "FAQ_DOWN"; // 常见问题答案评价:DOWN
export const MESSAGE_TYPE_ROBOT = "ROBOT"; // 机器人
export const MESSAGE_TYPE_ROBOT_UP = "ROBOT_UP"; // 机器人答案评价:UP
export const MESSAGE_TYPE_ROBOT_DOWN = "ROBOT_DOWN"; // 机器人答案评价:DOWN
//
export const MESSAGE_TYPE_RATE = "RATE"; // 访客主动评价
export const MESSAGE_TYPE_RATE_INVITE = "RATE_INVITE"; // 客服邀请评价
export const MESSAGE_TYPE_RATE_SUBMIT = "RATE_SUBMIT"; // 访客提交评价
export const MESSAGE_TYPE_RATE_CANCEL = "RATE_CANCEL"; // 访客取消评价
//
export const MESSAGE_TYPE_AUTO_CLOSED = "AUTO_CLOSED"; // 自动关闭
export const MESSAGE_TYPE_AGENT_CLOSED = "AGENT_CLOSED"; // 客服关闭
//
export const MESSAGE_TYPE_TRANSFER = "TRANSFER"; // 转接
export const MESSAGE_TYPE_TRANSFER_ACCEPT = "TRANSFER_ACCEPT"; // 转接-接受
export const MESSAGE_TYPE_TRANSFER_REJECT = "TRANSFER_REJECT"; // 转接-拒绝
//
export const MESSAGE_TYPE_INVITE = "INVITE"; // 邀请
export const MESSAGE_TYPE_INVITE_ACCEPT = "INVITE_ACCEPT"; // 邀请-接受
export const MESSAGE_TYPE_INVITE_REJECT = "INVITE_REJECT"; // 邀请-拒绝
// 
export const MESSAGE_TYPE_INVITE_VISITOR = "INVITE_VISITOR"; // 邀请访客
export const MESSAGE_TYPE_INVITE_VISITOR_ACCEPT = "INVITE_VISITOR_ACCEPT"; // 邀请访客-接受
export const MESSAGE_TYPE_INVITE_VISITOR_REJECT = "INVITE_VISITOR_REJECT"; // 邀请访客-拒绝
//
export const AGENT_STATUS_AVAILABLE = "AVAILABLE";
export const AGENT_STATUS_BUSY = "BUSY";
export const AGENT_STATUS_OFFLINE = "OFFLINE";
export const AGENT_STATUS_REST = "REST";
export const AGENT_STATUS_AWAY = "AWAY";
//
export const ROBOT_TYPE_SERVICE = "SERVICE";
export const ROBOT_TYPE_MARKETING = "MARKETING";
// export const ROBOT_TYPE_KB = "KB";
// export const ROBOT_TYPE_KBDOC = "KBDOC";
export const ROBOT_TYPE_LLM = "LLM";
// export const ROBOT_TYPE_RAG = "RAG";

// export const ROBOT_TYPE_AGENT_ASSISTANT = "AGENT_ASSISTANT";
// export const ROBOT_TYPE_TICKET_ASSISTANT = "TICKET_ASSISTANT";
//
// export const CATEGORY_TYPE_QUICKREPLY = "quick_reply";
// export const CATEGORY_TYPE_FAQ = "faq";
//
// export const CATEGORY_TYPE_HELP_DOC = "help_doc";
// export const CATEGORY_TYPE_ROBOT_KB = "robot_kb";
// export const CATEGORY_TYPE_BLOG = "blog";
// export const CATEGORY_TYPE_EMAIL = "email";
//
export const GROUP_TYPE_NORMAL = "NORMAL"; // 普通群聊
export const GROUP_TYPE_TOPIC = "TOPIC"; // 话题群聊
//
export const TOPIC_FILE_ASSISTANT = "file";
export const TOPIC_SYSTEM_NOTIFICATION = "system";
// 注意：没有 '/' 开头，防止stomp主题中奖 '/' 替换为 '.'之后，在最前面多余一个 '.'
export const TOPIC_USER_PREFIX = "user/";
// export const TOPIC_PRIVATE_PREFIX = "private/";
// export const TOPIC_GROUP_PREFIX = "group/";
export const TOPIC_FILE_PREFIX = "file/";
export const TOPIC_SYSTEM_PREFIX = "system/";
// export const TOPIC_ROBOT_PREFIX = "robot/";
//
export const TOPIC_ORG_PREFIX = "org/";
export const TOPIC_ORG_MEMBER_PREFIX = "org/member/";
export const TOPIC_ORG_DEPARTMENT_PREFIX = "org/department/";
export const TOPIC_ORG_GROUP_PREFIX = "org/group/";
export const TOPIC_ORG_PRIVATE_PREFIX = "org/private/";
export const TOPIC_ORG_ROBOT_PREFIX = "org/robot/";
export const TOPIC_ORG_AGENT_PREFIX = "org/agent/";
export const TOPIC_ORG_WORKGROUP_PREFIX = "org/workgroup/";
export const TOPIC_ORG_KB_PREFIX = "org/kb/";
export const TOPIC_ORG_KBDOC_PREFIX = "org/kbdoc/";
//
export const KB_TYPE_ASSISTANT = "ASSISTANT";
export const KB_TYPE_HELPCENTER = "HELPCENTER";
export const KB_TYPE_LLM = "LLM";
export const KB_TYPE_KEYWORD = "KEYWORD";
export const KB_TYPE_FAQ = "FAQ";
export const KB_TYPE_QUICKREPLY = "QUICKREPLY";
export const KB_TYPE_AUTOREPLY = "AUTOREPLY";
export const KB_TYPE_BLOG = "BLOG";
export const KB_TYPE_EMAIL = "EMAIL";
export const KB_TYPE_TABOO = "TABOO";
export const KB_TYPE_TICKET = "TICKET";
//
export const UPLOAD_TYPE_ASSISTANT = "ASSISTANT";
export const UPLOAD_TYPE_HELPCENTER = "HELPCENTER";
export const UPLOAD_TYPE_LLM = "LLM";
export const UPLOAD_TYPE_KEYWORD = "KEYWORD";
export const UPLOAD_TYPE_FAQ = "FAQ";
export const UPLOAD_TYPE_QUICKREPLY = "QUICKREPLY";
export const UPLOAD_TYPE_AUTOREPLY = "AUTOREPLY";
export const UPLOAD_TYPE_BLOG = "BLOG";
export const UPLOAD_TYPE_EMAIL = "EMAIL";
export const UPLOAD_TYPE_TABOO = "TABOO";
export const UPLOAD_TYPE_CHAT = "CHAT";
export const UPLOAD_TYPE_ATTACHMENT = "ATTACHMENT";
//
export const AUTO_REPLY_TYPE_FIXED = "FIXED";
export const AUTO_REPLY_TYPE_KEYWORD = "KEYWORD";
export const AUTO_REPLY_TYPE_LLM = "LLM";
//
export const QUICK_REPLY_TYPE_KB = "KB";
export const QUICK_REPLY_TYPE_CATEGORY = "CATEGORY";

//
export const LEVEL_TYPE_PLATFORM = "PLATFORM";
export const LEVEL_TYPE_ORGANIZATION = "ORGANIZATION";
export const LEVEL_TYPE_DEPARTMENT = "DEPARTMENT";
export const LEVEL_TYPE_WORKGROUP = "WORKGROUP";
export const LEVEL_TYPE_AGENT = "AGENT";
export const LEVEL_TYPE_GROUP = "GROUP";
export const LEVEL_TYPE_USER = "USER";
//
export const TAG_TYPE_CUSTOMER = "CUSTOMER";
export const TAG_TYPE_THREAD = "THREAD";
//
export const LLM_PROVIDER_STATUS_DEVELOPMENT = "DEVELOPMENT";
export const LLM_PROVIDER_STATUS_PRODUCTION = "PRODUCTION";
//
export const CATEGORY_TYPE_AUTOREPLY = "AUTOREPLY";
export const CATEGORY_TYPE_QUICKREPLY = "QUICKREPLY";
export const CATEGORY_TYPE_FAQ = "FAQ";
export const CATEGORY_TYPE_HELPCENTER = "HELPCENTER";
export const CATEGORY_TYPE_ROBOT = "ROBOT";
export const CATEGORY_TYPE_KEYWORD = "KEYWORD";
export const CATEGORY_TYPE_BLOG = "BLOG";
export const CATEGORY_TYPE_EMAIL = "EMAIL";
export const CATEGORY_TYPE_TABOO = "TABOO";

// super - 超级管理员
export const ROLE_SUPER = "ROLE_SUPER";
// admin - 管理员
export const ROLE_ADMIN = "ROLE_ADMIN";
// member - 团队成员
export const ROLE_MEMBER = "ROLE_MEMBER";
// agent - 客服
export const ROLE_AGENT = "ROLE_AGENT";

// 系统客户端类型
export const CLIENT_TYPE_SYSTEM = "SYSTEM";
export const CLIENT_TYPE_SYSTEM_AUTO = "SYSTEM_AUTO"; // auto reply
export const CLIENT_TYPE_SYSTEM_BOT = "SYSTEM_BOT"; // robot reply

// Web 客户端类型
export const CLIENT_TYPE_WEB = "WEB";
export const CLIENT_TYPE_WEB_PC = "WEB_PC"; // pc端
export const CLIENT_TYPE_WEB_H5 = "WEB_H5"; // h5端
export const CLIENT_TYPE_WEB_VISITOR = "WEB_VISITOR"; // 访客端
export const CLIENT_TYPE_WEB_ADMIN = "WEB_ADMIN"; // 管理端

// 移动客户端类型
export const CLIENT_TYPE_IOS = "IOS";
export const CLIENT_TYPE_ANDROID = "ANDROID";

// 桌面客户端类型
export const CLIENT_TYPE_ELECTRON = "ELECTRON";
export const CLIENT_TYPE_LINUX = "LINUX";
export const CLIENT_TYPE_MACOS = "MACOS";
export const CLIENT_TYPE_WINDOWS = "WINDOWS";

// Flutter 客户端类型
export const CLIENT_TYPE_FLUTTER = "FLUTTER";
export const CLIENT_TYPE_FLUTTER_WEB = "FLUTTER_WEB";
export const CLIENT_TYPE_FLUTTER_ANDROID = "FLUTTER_ANDROID";
export const CLIENT_TYPE_FLUTTER_IOS = "FLUTTER_IOS";
export const CLIENT_TYPE_FLUTTER_MACOS = "FLUTTER_MACOS";
export const CLIENT_TYPE_FLUTTER_WINDOWS = "FLUTTER_WINDOWS";
export const CLIENT_TYPE_FLUTTER_LINUX = "FLUTTER_LINUX";

// UniApp 客户端类型
export const CLIENT_TYPE_UNIAPP = "UNIAPP";
export const CLIENT_TYPE_UNIAPP_WEB = "UNIAPP_WEB";
export const CLIENT_TYPE_UNIAPP_ANDROID = "UNIAPP_ANDROID";
export const CLIENT_TYPE_UNIAPP_IOS = "UNIAPP_IOS";

// 微信客户端类型
export const CLIENT_TYPE_WECHAT = "WECHAT";
export const CLIENT_TYPE_WECHAT_MINI = "WECHAT_MINI";
export const CLIENT_TYPE_WECHAT_MP = "WECHAT_MP";
export const CLIENT_TYPE_WECHAT_WORK = "WECHAT_WORK";
export const CLIENT_TYPE_WECHAT_KEFU = "WECHAT_KEFU";
export const CLIENT_TYPE_WECHAT_CHANNEL = "WECHAT_CHANNEL";

export const TICKET_TYPE_AGENT = "AGENT";
export const TICKET_TYPE_WORKGROUP = "WORKGROUP";

// Ticket Priority
export const TICKET_PRIORITY_LOWEST = 'LOWEST'; 
export const TICKET_PRIORITY_LOW = 'LOW';
export const TICKET_PRIORITY_MEDIUM = 'MEDIUM';
export const TICKET_PRIORITY_HIGH = 'HIGH';
export const TICKET_PRIORITY_URGENT = 'URGENT';
export const TICKET_PRIORITY_CRITICAL = 'CRITICAL';

// Ticket Status
export const TICKET_STATUS_NEW = 'NEW';
export const TICKET_STATUS_ASSIGNED = 'ASSIGNED';
export const TICKET_STATUS_IN_PROGRESS = 'IN_PROGRESS';
export const TICKET_STATUS_PENDING = 'PENDING';
export const TICKET_STATUS_ON_HOLD = 'ON_HOLD';
export const TICKET_STATUS_REOPENED = 'REOPENED';
export const TICKET_STATUS_RESOLVED = 'RESOLVED';
export const TICKET_STATUS_CLOSED = 'CLOSED';
export const TICKET_STATUS_CANCELLED = 'CANCELLED';

// 
export const TICKET_FILTER_STATUS_ALL = 'status_all';
export const TICKET_FILTER_PRIORITY_ALL = 'priority_all';
export const TICKET_FILTER_ASSIGNMENT_ALL = 'assignment_all';
export const TICKET_FILTER_TIME_ALL = 'time_all';

// 
export const TICKET_FILTER_MY_TICKETS = 'MY_TICKETS';
export const TICKET_FILTER_UNASSIGNED = 'UNASSIGNED';
export const TICKET_FILTER_MY_WORKGROUP = 'MY_WORKGROUP';

// 
export const TICKET_FILTER_TODAY = 'TODAY';
export const TICKET_FILTER_YESTERDAY = 'YESTERDAY';
export const TICKET_FILTER_THIS_WEEK = 'THIS_WEEK';
export const TICKET_FILTER_LAST_WEEK = 'LAST_WEEK';
export const TICKET_FILTER_THIS_MONTH = 'THIS_MONTH';
export const TICKET_FILTER_LAST_MONTH = 'LAST_MONTH';
