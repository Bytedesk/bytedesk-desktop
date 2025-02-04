/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-02 19:29:20
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-07 14:38:57
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
const useRtcReceiver = () => {
  console.log("useRtcReceiver");
  // https://web.dev/articles/webrtc-datachannels?hl=zh-cn
  let peerConnection: RTCPeerConnection | null = null;
  const dataChannelOptions = {
    ordered: true, // do guarantee order
    maxPacketLifeTime: 3000, // in milliseconds
  };

  useEffect(() => {
    console.log("useRtcReceiver useEffect");
    // Establish your peer connection using your signaling channel here
    const dataChannel = peerConnection.createDataChannel(
      "dataChannel",
      dataChannelOptions,
    );

    dataChannel.onerror = (error) => {
      console.log("Data Channel Error:", error);
    };

    dataChannel.onmessage = (event) => {
      console.log("Got Data Channel Message:", event.data);
    };

    dataChannel.onopen = () => {
      dataChannel.send("Hello World!");
    };

    dataChannel.onclose = () => {
      console.log("The Data Channel is Closed");
    };
  }, []);
};

export default useRtcReceiver;
