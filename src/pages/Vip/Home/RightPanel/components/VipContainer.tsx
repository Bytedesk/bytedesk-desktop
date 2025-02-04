/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-04 14:13:39
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 14:20:43
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import styled from "@emotion/styled";
import { Button } from "antd";
import useTranslate from "@/hooks/useTranslate";

const Container = styled.div`
  padding: 20px;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface VipContainerProps {
  children?: React.ReactNode;
}

export const VipContainer: React.FC<VipContainerProps> = ({ children }) => {
  const { translateString } = useTranslate();

  return (
    <Container>
      <div>{translateString("i18n.vip.component")}</div>
      {children}
      <Button
        type="primary"
        style={{ width: 100, marginTop: 10 }}
        onClick={() => window.open(translateString("i18n.vip.contactUrl"))}
      >
        {translateString("i18n.vip.contactUs")}
      </Button>
    </Container>
  );
};

export default VipContainer; 