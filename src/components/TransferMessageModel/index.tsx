/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 15:22:58
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-03 15:53:16
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { ProForm } from "@ant-design/pro-components";
import { Modal } from "antd";

type TransferMessageModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const TransferMessageModel = ({ open, onOk, onCancel }: TransferMessageModelProps) => {
  const [form] = ProForm.useForm();
  const handleOk = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        title="转发消息"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProForm
          form={form}
          submitter={{
            render: false,
          }}
        />
      </Modal>
    </>
  );
};
export default TransferMessageModel;