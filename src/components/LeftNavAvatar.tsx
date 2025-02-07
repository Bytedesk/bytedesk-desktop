/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-07 10:33:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 14:02:51
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { AppContext } from "@/context/AppContext";
import useTranslate from "@/hooks/useTranslate";
import useUserInfo from "@/hooks/useUserInfo";
// import { useAgentStore } from "@/stores/service/agent";
// import { MODE_AGENT } from "@/utils/constants";
import { Avatar, Popover } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//
const LeftNavAvatar = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();
  // const agentInfo = useAgentStore((state) => state.agentInfo);
  const { translateString } = useTranslate();
  const { mode } = useContext(AppContext);
  const [popTitle, setPopTitle] = useState("");
  const [popContent, setPopContent] = useState("");
  const [popAvatar, setPopAvatar] = useState("");

  // 独立的 handleAvatarClick 事件处理函数
  const handleAvatarClick = () => {
    navigate("/setting");
  };

  useEffect(() => {
    // if (mode === MODE_AGENT) { 
    //   setPopTitle(translateString(agentInfo?.nickname));
    //   setPopContent(translateString(agentInfo?.description));
    //   setPopAvatar(agentInfo?.avatar);
    // } else {
    setPopTitle(translateString(userInfo?.nickname));
    setPopContent(translateString(userInfo?.description));
    setPopAvatar(userInfo?.avatar);
    // }
  }, [mode, userInfo]);

  return (
    <>
      <Popover title={popTitle} content={popContent} placement="rightBottom">
        {/* {getAvatar()} */}
        <>
          <Avatar
            style={{
              marginTop: 60,
              cursor: "pointer",
            }}
            size={40}
            src={popAvatar}
            onClick={handleAvatarClick} // 使用事件处理函数，而不是直接调用
          />
        </>
      </Popover>
    </>
  );
};

export default LeftNavAvatar;

//
