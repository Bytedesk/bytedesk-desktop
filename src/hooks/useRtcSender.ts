/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-02 19:29:02
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-07 14:35:38
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */

import { useEffect } from "react";

// 
const useRtcSender = () => {
  console.log("useRtcSender");
  // https://web.dev/articles/webrtc-datachannels?hl=zh-cn
  let peerConnection: RTCPeerConnection | null = null;
  let dataChannel: RTCDataChannel | null = null;
  let icecandidate: RTCIceCandidate | null = null;
  const dataChannelOptions = {
    ordered: true, // do guarantee order
    maxPacketLifeTime: 3000, // in milliseconds
  };

  useEffect(() => {
    console.log("useRtcSender useEffect");
    peerConnection = new RTCPeerConnection();
    peerConnection.onconnectionstatechange = () => {
      console.log(
        "useRtcSender onconnectionstatechange",
        peerConnection?.connectionState,
      );
    };
    peerConnection.ondatachannel = (event) => {
      console.log("useRtcSender ondatachannel", event);
    };
    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      console.log(
        "useRtcSender onicecandidate",
        peerConnection?.iceConnectionState,
        event,
      );
      if (!icecandidate && event.candidate) {
        console.log("useRtcSender seticecandidate", event);
        icecandidate = event.candidate;
      }
    };
    peerConnection.onicecandidateerror = (event) => {
      console.log("useRtcSender onicecandidateerror", event);
    };
    // 处理连接错误
    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        "useRtcSender oniceconnectionstatechange",
        peerConnection?.iceConnectionState,
      );
      if (peerConnection?.iceConnectionState === "failed") {
        console.error("Connection failed");
      }
    };
    // peerConnection.onicegatheringstatechange = () => {
    //   console.log(
    //     "useRtcSender onicegatheringstatechange",
    //     peerConnection?.iceGatheringState,
    //   );
    // };
    // peerConnection.onnegotiationneeded = () => {
    //   console.log("useRtcSender onnegotiationneeded");
    // };
    // peerConnection.onsignalingstatechange = () => {
    //   console.log(
    //     "useRtcSender onsignalingstatechange",
    //     peerConnection?.signalingState,
    //   );
    // };
    // 处理远程视频流
    // peerConnection.ontrack = (event) => {
    //   // const [remoteStream] = event.streams;
    //   console.log("useRtcSender ontrack", event);
    // };
    //
    // Establish your peer connection using your signaling channel here
    dataChannel = peerConnection.createDataChannel(
      "dataChannel",
      dataChannelOptions,
    );

    dataChannel.onerror = (error) => {
      console.log("useRtcSender Data Channel Error:", error);
    };

    dataChannel.onmessage = (event) => {
      console.log("useRtcSender Got Data Channel Message:", event.data);
    };

    dataChannel.onopen = () => {
      dataChannel.send("useRtcSender Hello World!");
    };

    dataChannel.onclose = () => {
      console.log("useRtcSender The Data Channel is Closed");
    };

    // 
    peerConnection.createOffer().then((offer) => {
      console.log("useRtcSender createOffer TODO: send sdp", offer);
      peerConnection.setLocalDescription(offer);
    });

    // 清理资源
    return () => {
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      if (dataChannel) {
        dataChannel.close();
        dataChannel = null;
      }
    };
  }, []);

}

export default useRtcSender;
