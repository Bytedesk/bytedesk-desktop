<!--
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-29 15:40:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-02 16:35:33
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
-->

# 待办

- 参考[page-assist](https://github.com/pengjinning/page-assist/tree/main)
- 参考[anything-llm](https://github.com/pengjinning/anything-llm)
- 检测局域网内是否有服务器，如果有则自动连接服务器
  - 如果没有发现局域网服务器，则自动连接公网服务器
  - 如果没有公网服务器，则启用端到端链接
- 支持electron-updater自动更新，打包之后自动化配置
- 客户端支持切换服务器
- mac上图标显示为彩色，跟系统不统一
- tray icon 显示未读消息数目
- 客户端每次修改代码之后白屏
- 完善国际化
- github actions 自动打包mac、windows、linux并上传服务器
- 跨库，将本库的release同步到bytedesk/bytedesk库打包release
- 打包之后，自动在目标系统测试安装运行
<!-- - 使用手机端扫码登录 -->
<!-- - 支持配置public/config.json文件，配置后台restful接口地址 -->
<!-- - 消息撤回 -->
- 侧边停靠窗口，类似Sider.ai
- 参考LocalSend，桌面选择文件，添加右键菜单，发送文件
- 浏览器添加右键，选择文字发送
- 截图直接集成OCR，识别文字，发送给对方
- Stream类型消息支持MARKDOWN格式
- 在输入框进行敏感词过滤
- 切换会话时，存储输入框草稿
- 自动检测浏览器语言，并显示相应语言
- 输入联想
- 支持直接调用本机Ollama
- 打包提交到Apple Store
- 语音输入，语音转文字：支持客服直接语音输入，实时语音转文字
- 右键图片，保存到本地
- 聊天记录，支持搜索，支持分享到微信等社交媒体
- 电脑桌面右键文件，支持显示微语图标，点击传文件
- @所有人，@指定用户 强提醒，输入框输入@时，自动提示@用户列表
- 收到图片自动保存到本地文件夹，右键可打开本地文件夹
- mac上图标比微信大一号，需要修改。
- 支持同时拖拽多个文件，发送
- 任务栏图标未显示黑白状态，显示为彩色，跟系统不统一，需要换掉
- 通用大模型对话，支持自定义提示词，自定义模型，自定义参数等
- 支持客户端无server的情况下，使用typescript直接调用大模型
- 浏览器拉起客户端app，自动登录，打开相应会话或群聊
- 微语记忆模块：随时将自己的语音/文字记录，其他人可以通过记忆内容跟自己对话
- pc客户端显示手机端客户端在线状态，同理手机客户端显示pc端在线状态
- 局域网服务器自动寻址
- 客户端完善配色，如：左侧栏背景色
- 将bg.weiyuai.cn网站修改为ToC办公网站，参考：[苏打办公](https://bangong.360.cn/)
<!-- - 客服端实时显示访客在线状态，是否已经离线 -->
- 服务器创建机器人，客户端调用服务器API。支持客户端修改URL和key（暂不考虑纯客户端方式使用：可在微语AI中实现）
- 支持嵌入网页，然后网页获取当前客户端授权，方便集成第三方插件
- 截图之后，在输入框旁边显示图片，可点击放大编辑
- 所有对话旁边右侧显示Chat Copilot，基于当前对话聊天记录，进行提问：可以生成聊天摘要等
- 对话页面"加载更多"，无更多时，可隐藏
- 语音转文字对话，文字转语音
- 测试web端通知，获取离线token，关闭网页之后，实现推送
- 支持配置ollama URL地址，直接对话ollama
- 输入框草稿，当切换到其他对话再次回来时，自动恢复到输入框
<!-- - 使用CI/CD持续集成，自动部署 -->
- 支持直接跟本地大模型对话，无需服务器，如:Ollama，LlmStudio等
- 支持国产大模型：文心一言、通义千问、讯飞星火、字节豆包、腾讯混元
- 点击任务栏图标icon，可查看剪贴板历史记录
- 对接微信，实现自动回复
- 登录之后，自动拉取未读消息。
- 断开重连之后，拉取未读消息
- 右键点击消息气泡，弹出菜单，如：复制、转发、删除等
<!-- 置顶、星标、免打扰、未读、转接 -->
- 会话列表右键菜单：不显示、拉黑、工单、CRM、小结
- 切换组织、加入组织
- 借助第三方库，实现自动回复个人微信
- 修改package.json中publish的token配置方式，提交到github secrets中，
<!-- ci/cd自动化 -->
- windows自动固定到任务栏
  <!-- - 收到消息播放提示音 -->
  <!-- - 会话列表显示未读数，红色圆点 -->
- rest接口定时拉取未读消息，
- 长链接断开重连之后拉取，
- 网络断开重连之后拉取
- 超时未回复，提醒客服
- 长时间未操作，提醒客服
- 客户端对接本地大模型ollama，无需服务器
<!-- - 支持直接打包web版本 -->
- 自动检测版本，并后台自动下载，重启客户端实现升级
- 客户端支持匿名模式，web版强制弹窗登录
- 录制视频说明，放到readme中
- 匿名模式，无需登录：支持修改昵称、头像
- 扫码登录
- 监听@所有人，@某个用户，客户端提醒
- 隔空投送
  <!-- - 国际化 -->
  <!-- - 截屏、截图 -->
  <!-- - 自定义右键菜单 -->
- 后台自动更新，弹窗提示，是否重启更新？
- 安装新版后，弹窗显示更新内容
- 代理配置
<!-- - 管理员在客户端，可以操作服务器，如：重启 -->
- AI助手：集成各种AI工具
- 加入某个组织之后，组织内成员直接的聊天消息等设置，需要遵循组织的服务器端的设置
- websocket、https、multicast代理设置
- websocket、http、multicast端口可设置
<!-- - 客服端接待访客会话 -->
- 通过蓝牙聊天
- 个人对话非企业对话-可以在客户端设置是否在服务器端存储聊天记录
- 可以在客户端自由配置第三方机器人API
- 对话页面超链接支持点击打开
- 支持阅后即焚
- 消息提示音
<!-- - 开机启动 -->
- 右键点击任务栏图标，弹出菜单
- 利用ai助手，实现自动回复
- 利用ai助手，生成文章，自动发布到公众号，支持多个公众号，定时发布文章
- 通讯录支持备注
<!-- - 发起群聊 -->
- 屏幕共享，远程支持
- 整合本地Ollama模型，调用ollma rest api接口对话
- 局域网聊天，无需登录即可发送文字、图片、消息等，参考[node-snapdrop-electron](https://github.com/JustSch/node-snapdrop-electron/), [pairdrop](https://github.com/schlagmichdoch/PairDrop)
<!-- - 读取设备信息 -->
- tray彩色图标-修改为黑灰色
- 检测各个端口是否占用，并支持自定义，如：http端口9011
- drop页面部署到线上服务器，支持局域网传文件
- 快捷键管理界面，参考Tabby
  <!-- - 对接渠道：公众号/抖音/快手/telegram/facebook messenger/whatsapp等 -->
  <!-- - 增加对接渠道：安卓、iOS、网页、公众号、抖音、Facebook等 -->
- 支持删除联系人、加入黑名单
- 付费群聊，类似知识星球
- 检测路由器是否允许访问多播multicast
- 远程控制[escrcpy](https://github.com/viarotel-org/escrcpy)
<!-- - 获取浏览器notification权限，推送通知 -->
- 新消息播放提示音，允许用户选择提示音
- 支持小程序引擎，方便第三方小程序直接集成
- 基于 [Puppeteer](https://github.com/puppeteer/puppeteer) 实现RPA自动化操作，[docs](https://pptr.dev/)
- 邀请用户加入团队
- 开放插件/接口，支持第三方对接
- 剪贴板、笔记等功能通过插件形式提供，不做原生集成，[帮小忙-工具箱](https://tool.browser.qq.com/)
- 显示签名、状态，支持改签名，改状态
- 敏感词下载到客户端存储，直接在客户端过滤
- 客服端可直接查看访客ip，并可直接封ip/ip段
- 聊天记录可分类查看：全部、图片、文件等
- 类似公众号，关注，接收通知，同步通知手机端
- 方便各种机器人，一键集成到客户端，如：OpenAI、ChatGPT等
- 实名认证个人在线客服免费，付费用户支持多个客服账号
- 对话列表增加紧凑模式：对话列表不用显示头像，只显示昵称和未读消息数
- 在设备间拷贝和粘贴：在一台设备上拷贝文本、图像、照片和视频，然后将其粘贴到另一台设备上。例如，在Mac上从网站选择文本，然后将其粘贴到iPhone上的备忘录中。
- 微语工具库，参考：https://tw.piliapp.com/
- 文件助手支持拖拽 文件夹，自动上传文件并发送
- 嵌入命令到右键菜单，右键点击桌面，可以支持发送文件或发送消息
- 支持iOS的快捷指令，参考：https://routinehub.co/shortcut/13990/
- 支持命令行发送文件，类似pairdrop.net
- 集成[cal.com](https://github.com/calcom/cal.com)
- 支持修改自己昵称，修改对方备注
- 群二维码
- 本地llm问答查询，[reor](https://github.com/reorproject/reor)
- 参考lobehub.com，与本地大模型ollama对话
- 国际化，支持更多语言：日语、韩语、中文简体、中文繁体、英文、法文、德文、西班牙文、俄文、阿拉伯文、希伯来文
- 类似airdrop一样，将使用手册，放在public文件夹
- 通过第三方插件，发送消息到微信
- 使用阿里云服务器，Linux打包运行测试
- 通过链接从浏览器拉起客户端，从而实现加群、添加好友、聊天、客服等操作
- 聊天记录字体大小可配置
- 搜索聊天记录，参考微信
- 检测新版，并支持自动升级
- 支持用户自定义消息推送，比如：来自github actions的消息，可以推送到微语客户端
- 增加声音开关，可开启/关闭消息提示音
  <!-- - windows下，无关闭按钮 -->
  <!-- - 美化windows下滚动条样式 -->
- 可设置客户端登录数量，默认不限制
- 对接coze.cn等平台
- 支持多语言，中亚五国有各自的主体民族语言，
  - 如哈萨克斯坦的哈萨克语、
  - 乌兹别克斯坦的乌兹别克语、
  - 吉尔吉斯斯坦的吉尔吉斯语、
  - 塔吉克斯坦的塔吉克语和土库曼斯坦的土库曼语。
  - 但在日常生活和商务交流中，俄语被广泛使用。
- 对接企业邮件系统，支持邮件发送、邮件接收

## 大模型

- 大模型provider列表支持拖动改变顺序

## 群组

- 发邀请链接，邀请进群
- 群聊支持论坛模式：话题群，参考飞书，支持对消息进行评论/转发
- 付费群：类似知识星球
- 话题群：类似飞书话题群
- 群支持接龙

## 视频会议

- 视频会议
- 语音会议

## 扩展软件

- 寻找开源软件重构打包，参考[迅捷办公](https://www.xunjiepdf.com/)
- 微语pdf编辑器，支持pdf编辑、合并、拆分等
- 微语OCR文字识别软件，支持图片、视频、音频、文本等
- 微语翻译 - 翻译软件
- 微语文字转语音 - 文字转语音软件

## 机器人

- 对接本地ollama, [page-assist](https://github.com/n4ze3m/page-assist), [jan](https://github.com/janhq/jan), 迁移到整合到微语[chrome](../chrome/)插件中
- 更多本地大模型对话
- 客户端默认对接服务器机器人
- 客户端可以直接配置对接第三方机器人API，不经过服务器
- 无需上传文件，直接选择文件夹即可跟文件夹内文件内容对话

## indexeddb

- indexedDB实现CRUD离线聊天记录
- 存储聊天记录，支持离线聊天
- zustand存储多用户数据->使用indexeddb存储
- 使用IndexedDB存储本地聊天记录、会话等信息，替代sqlite3：https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB

## 迁移客服功能

- 客户端支持右侧插件：支持开发者自定义插件
<!-- - 常用语 -->
- 添加快捷回复/常用语以及分类
- 完善快捷用语/常用语，消息右键支持添加快捷回复
- 输入框上方添加：AI回复按钮
- 一键创建工单
- 支持客服给访客打标签，如：已解决、未解决等，并可设置标签颜色，在左侧会话列表显示标签
- 会话列表超时提醒
- 客户端长时间未操作提醒
- 客服回复增加支持：匿名回复、内部回复

## 参考Discord功能

- 频道
- 方便社区运营管理

## 参考Telegram功能

- 创建机器人
- 跟telegram收发消息
- deeplink网页唤起客户端
- 方便社区运营管理

## 参考Signal功能

- 跟signal收发消息
- 方便社区运营管理

## Puppeteer + Zapier

- 将微语打造成类似[Zapier](https://zapier.com/)平台，对接各种第三方应用，集成工作流
<!-- - 办公自动化puppeteer：yarn add puppeteer -->
- 结合大模型chatgpt

## 其他

- 微语内的AI是基于知识库的问答
- 微语AI是大模型聚合平台
- [快捷工具箱](https://getquicker.net/)

## 集成第三方功能

- [ChatGPT-Next-Web](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web?tab=readme-ov-file)
- [lobe-chat ollama对话](https://github.com/lobehub/lobe-chat)
- [anythingll 本地知识库对话](https://docs.anythingllm.com/introduction)
- [chatgpt-on-cs](https://github.com/cs-lazy-tools/ChatGPT-On-CS), 研究懒人客服实现机制，
- [pear-rec-截图](https://github.com/027xiguapi/pear-rec)
- [WeChatFerry](https://mp.weixin.qq.com/s/-HPeBm4SheFteWrXPulTjA)，
- [wxauto](https://github.com/cluic/wxauto)
- [WeChatRobot](https://github.com/lich0821/WeChatRobot)
- [pyautogui](https://pyautogui.readthedocs.io/en/latest/)
- [AFFiNE-笔记](https://github.com/toeverything/AFFiNE)
- [uiautomation windows自动化](https://github.com/yinkaisheng/Python-UIAutomation-for-Windows/blob/master/readme_cn.md)
<!-- - uiautomation vs pywinauto vs pyautogui -->
- [wechaty-plugin-assistant](https://github.com/zhengxs2018/wechaty-plugin-assistant)
- [ai对接大模型](https://github.com/zhengxs2018/ai?tab=readme-ov-file)

## FIXME:

- "token" specified in the github publish options. It should be used only for [setFeedURL](module:electron-updater/out/AppUpdater.AppUpdater+setFeedURL).

## ollama api

<!-- https://github.com/ollama/ollama/blob/main/docs/api.md -->

curl http://localhost:11434/api/generate -d '{
"model": "mistral",
"prompt": "Why is the sky blue?"
}'
