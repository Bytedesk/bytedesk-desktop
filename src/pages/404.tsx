/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-03 10:18:11
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-10-12 09:48:38
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NoFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          返回主页
        </Button>
      }
    />
  );
};

export default NoFoundPage;
