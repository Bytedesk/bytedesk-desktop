/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 16:21:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-06-01 11:20:48
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { generateAvatar } from "@/utils/utils";
import { Avatar } from "antd";

//
const ContactDeviceAvatar: React.FC = (item: CONTACT.Contact) => {

    const getAvatar = (item: CONTACT.Contact) => {
      if (item?.user?.avatar === null || item?.user?.avatar === undefined || item?.user?.avatar === "") {
        return <img src={generateAvatar(item?.user?.uid)} alt="Avatar" />;
      }
      if (item?.user?.avatar.indexOf("local") > -1) {
        return <img src={generateAvatar(item?.user?.uid)} alt="Avatar" />;
      }
      return <Avatar shape="square" size="large" src={item?.user?.avatar} />;
    };
  
    return (
        <div>
            {getAvatar(item)}
        </div>
    )
}

export default ContactDeviceAvatar;