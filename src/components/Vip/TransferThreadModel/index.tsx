/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 15:22:58
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 14:27:28
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Button, Modal } from "antd";
import { useIntl } from "react-intl";
import VipContainer from "@/pages/Vip/Home/RightPanel/components/VipContainer";

type TransferThreadModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const TransferThreadModel = ({
  open,
  onOk,
  onCancel,
}: TransferThreadModelProps) => {
  const intl = useIntl();

  const handleCancel = () => {
    onCancel();
  };


  return (
    <>
      <Modal
        title={intl.formatMessage({ id: "transfer", defaultMessage: "Transfer" })}
        open={open}
        onCancel={handleCancel}
        width={400}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" })}
          </Button>,
        ]}
      >
        <VipContainer />
      </Modal>
    </>
  );
};

export default TransferThreadModel;
