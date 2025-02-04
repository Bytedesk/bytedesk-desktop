/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-23 11:58:44
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-11 11:47:48
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);

  //
  useEffect(() => {
    function handleNetworkOnline() {
      console.log("networkStatus online:", navigator.onLine);
      // toast("networkStatus: online");
      if (navigator.onLine) setIsNetworkOnline(true);
    }
    function handleNetworkOffline() {
      console.log("networkStatus offline:", !navigator.onLine);
      // toast("networkStatus: offline");
      setIsNetworkOnline(false);
    }
    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    //
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
    };
  }, []);

  return isNetworkOnline;
}
