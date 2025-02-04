/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-23 07:39:20
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:54:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import WebTabFull from "./WebTabFull";
import { openUrl } from "@/utils/electronApiUtils";

//
const ChannelAndroid = () => {

  return (
    <>
      <p>通过h5方式集成</p>
      <WebTabFull /><br />
      <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
        openUrl('https://github.com/Bytedesk/bytedesk-android');
      }}>
        SDK方式集成
      </Button>
    </>
  );
};

export default ChannelAndroid;
