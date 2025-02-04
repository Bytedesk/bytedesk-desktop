/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-07 10:51:05
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 17:38:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { logout } from "@/apis/core/auth";
import {
  EVENT_BUS_TOKEN_INVALID,
} from "@/utils/constants";
import emitter from "@/utils/eventEmitter";
import { useCallback, useContext, useEffect } from "react";
import useStorage from "./useStorage";
import { logoutSuccess } from "@/utils/electronApiUtils";
import useMqtt from "./useMqtt";
import { AppContext } from "@/context/AppContext";

//
function useEventBus() {
  console.log("useEventBus");
  const { clearStorage } = useStorage();
  const { doDisconnect } = useMqtt();
  const { setPingLoading } = useContext(AppContext);

  //
  const doLogout = useCallback(async () => {
    try {
      //
      const result = await logout();
      console.log("logout result:", result.data);
      //
      setPingLoading(false);
      doDisconnect();
      clearStorage();
      logoutSuccess();
      //
    } catch (error) {
      console.log("logout error:", error);
    }
  }, []);

  useEffect(() => {
    console.log("useEventBus useEffect");
    // 监听token失效
    const handleTokenInvalid = function (data: string) {
      console.log("token过期，强制刷新登录", data);
      emitter.off(EVENT_BUS_TOKEN_INVALID, handleTokenInvalid);
      doLogout();
    };
    emitter.on(EVENT_BUS_TOKEN_INVALID, handleTokenInvalid);

    //
    return () => {
      console.log("un - useEffect mqttDisconnect");
      // emitter.off(EVENT_BUS_MULTICAST_MESSAGE_RECEIVED)
      emitter.off(EVENT_BUS_TOKEN_INVALID);
      // emitter.all.clear();
    };
  }, []);

  return {
    doLogout,
  };
}

export default useEventBus;
