/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-26 07:37:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-08 22:39:49
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 * 仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 * Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 * contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// webrtc
// chrome://webrtc-internals/
// https://juejin.cn/post/6919677278448271374?from=search-suggest
/**
 * 参考网址:
 * https://webrtc.github.io/samples/
 * https://codelabs.developers.google.com/codelabs/webrtc-web/#4
 * https://cloud.tencent.com/developer/article/1004661
 * https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/
 * 开始视频会话：(发送信息部分均调用自定义消息接口)
 * 1. A发起offer: 首先调用setLocalDescription设置自己的SDP，然后将SDP发送给B
 * 2. B收到offer之后，首先将A的SDP调用setRemoteDescription保存
 * 3. B执行answer：首先调用setLocalDescription设置自己的SDP，然后将SDP发送给A
 * 4. A收到B的SDP之后调用setRemoteDescription保存
 * 5. A初始化本地摄像头，并创建peerConnection, 发送candidate信息给对方B，即：自己的ip等信息
 * 6. B收到消息之后也开始初始化摄像头, 并创建peerConnection, 发送candidate信息给对方A
 * 7. B收到A的candidate信息后，执行addIcecandidate; A收到B的candidate信息后，执行addIcecandidate
 * 连接建立
 * 
 * 实际流程：
 * 1. 访客端初始化本地摄像头，创建peerconnection，监听icecandidate。发起请求会话
 * 2. 客服端接收到webrtc_invite消息
 * 3. 客服端初始化本地摄像头，创建peerconnection，监听icecandidate
 * 4. 客服端createOffer设置local sdp并将此sdp发送给访客端，访客端设置remote sdp
 * 5. 访客端createAnswer设置local sdp并将此sdp发送给客服端，客服端设置remote sdp
 * 6. 访客端或者客服端将监听到的本地icecandidate发送给对方，对方收到之后addicecandidate
 */
// https://peerjs.com/docs/#start
// https://github.com/peers/peerjs
// https://github.com/peers/peerjs-server
