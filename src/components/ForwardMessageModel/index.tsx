/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 15:23:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-03 21:02:45
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Modal } from "antd";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import TabThread from "./TabThread";
import TabContact from "./TabContact";
import TabGroup from "./TabGroup";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "会话",
    children: <TabThread/>,
  },
  {
    key: "2",
    label: "联系人",
    children: <TabContact/>,
  },
  {
    key: "3",
    label: "群聊",
    children: <TabGroup/>,
  },
];

type ForwardMessageModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const ForwardMessageModel = ({ open, onOk, onCancel }: ForwardMessageModelProps) => {
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
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </>
  );
};
export default ForwardMessageModel;