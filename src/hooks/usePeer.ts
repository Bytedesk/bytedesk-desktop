/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 23:00:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-09 00:02:57
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://peerjs.com/docs/#start
// https://github.com/peers/peerjs
// https://github.com/peers/peerjs-server
import { useUserStore } from "@/stores/core/user";
import { useEffect } from "react";
import { DataConnection, Peer } from "peerjs";

let host = "127.0.0.1";
let port = 9000;
let path = "/";

function usePeer() {
  console.log("usePeer");
  const userInfo = useUserStore((state) => state.userInfo);
  let peer: Peer | null = null;
  let conn: DataConnection | null = null;

  const connectOtherPeer = (peerId: string) => {
    // https://github.com/peers/peerjs?tab=readme-ov-file#data-connections
    conn = peer.connect(peerId);
    conn.on("open", () => {
      console.log("Connected to peer with ID:", peerId);
      conn.send("hi!");
    });
  };

  const sendMessage = (message: string) => {
    if (conn) {
      console.log("sending message:", message);
      conn.send(message);
    } else {
      console.error("no connection to send message");
    }
  };

  const callOtherPeer = (peerId: string) => {
    // https://github.com/peers/peerjs?tab=readme-ov-file#data-connections
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        // 在这里处理媒体流
        const call = peer.call(peerId, stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
        });
      })
      .catch((error) => {
        console.error("Failed to get local stream", error);
      });
  };

  useEffect(() => {
    // https://peerjs.com/docs/#connect
    const peer = new Peer(userInfo.uid, { host: host, port: port, path: path });
    console.log("Starting self peer with ID:", userInfo.uid);
    peer.on("open", function () {
      console.log("self peer opened!");
    });
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // Will print 'hi!'
        console.log("connection data:", data);
      });
      conn.on("open", () => {
        conn.send("connection data open!");
      });
    });
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((stream) => {
          // 在这里处理媒体流
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.
          });
        })
        .catch((error) => {
          console.error("Failed to get local stream", error);
        });
    });
  }, [userInfo]);

  return {
    peer,
    connectOtherPeer,
    sendMessage,
    callOtherPeer,
  };
}
//
export default usePeer;
