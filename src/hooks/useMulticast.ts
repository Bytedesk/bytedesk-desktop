/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-29 22:49:16
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-06 11:17:22
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import multicaset from '../network/multicast';

import { useEffect } from "react";
// import { useUserStore } from "@/stores/core/user";
// import { useDeviceStore } from "@/stores/core/device";

//
const useMulticast = () => {
  console.log("useMulticast");
  // const { multiInterval, setMultiInterval } = useState<number>(0);
  // const userInfo = useUserStore((state) => state.userInfo);
  // const myDevice = useDeviceStore((state) => state.myDevice);

  const autoMulticast = () => {
    //
    return setInterval(() => {
      // let userObject: MULTICAST.UserObject = {
      //   uid: userInfo.uid,
      //   nickname: userInfo.nickname,
      //   avatar: "local://avatar.png",
      // };
      // let messageObject: MULTICAST.MessageObject = {
      //   type: "device",
      //   device: myDevice,
      //   user: userObject,
      //   createdAt: currentTimestamp(),
      // };
      // // 发送消息到electron-main
      // sendMulticastMessage(JSON.stringify(messageObject));
      // TODO: 网页版另外处理
    }, 5000);
  };

  useEffect(() => {
    console.log("useMulticast useEffect");
    const multiInterval = autoMulticast();
    //
    return () => {
      console.log("un - useEffect");
      clearInterval(multiInterval);
    };
    //
  }, []);

  //   const startMulticast = () => {
  //     multicaset.startMulticastSocket();
  //   };
  //   const sendMutlicastMessage = (message: string) => {
  //     if (message === null || message === '') return;
  //     console.log('sendMutlicastMessage: ', message);
  //     multicaset.sendMutlicastMessage(message);
  //   }
  //   const stopMulticast = () => {
  //     multicaset.stopMulticastSocket();
  //   };
  //   return {
  //     startMulticast,
  //     sendMutlicastMessage,
  //     stopMulticast
  //   }
};

export default useMulticast;
