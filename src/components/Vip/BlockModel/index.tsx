/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-17 07:10:48
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 14:32:31
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
// 
import { Modal } from "antd";
import { useIntl } from "react-intl";
import VipContainer from "@/pages/Vip/Home/RightPanel/components/VipContainer";

type blackModelProps = {
  open: boolean;
  onOk: (params: BLACK.HttpRequest) => void;
  onCancel: () => void;
};

const blackModel = ({
  open,
  onOk,
  onCancel,
}: blackModelProps) => {
  const intl = useIntl();
  

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        title={intl.formatMessage({ id: 'black.title' })}
        open={open}
        onCancel={handleCancel}
      >
        <VipContainer />
      </Modal>
    </>
  );
};

export default blackModel;
