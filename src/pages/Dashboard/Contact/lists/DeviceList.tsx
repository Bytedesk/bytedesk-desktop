/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:29:41
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:37:42
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://ant-design.antgroup.com/components/list-cn?theme=compact
import { useContactStore } from "@/stores/core/contact";
import { Empty, List } from "antd";
import ContactDeviceAvatar from "@/components/ContactDeviceAvatar";

// 设备列表
const DeviceList = () => {
  const { devices, currentContact, setCurrentContact } = useContactStore((state) => {
    return {
      devices: state.devices,
      currentContact: state.currentContact,
      setCurrentContact: state.setCurrentContact,
    };
  });

  const handleContactClick = (item: CONTACT.Contact, index: number) => {
    console.log('handleContactClick', item, index);
    setCurrentContact(item);
  };

  const handleContactDoubleClick = (item: CONTACT.Contact, index: number) => {
    console.log('handleContactDoubleClick', item, index);
  };

  return (
    <div>
      {devices.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={devices}
          renderItem={(item, index) => (
            <List.Item 
              onClick={() => handleContactClick(item, index)} 
              onDoubleClick={() => handleContactDoubleClick(item, index)}>
              <List.Item.Meta
                style={
                  currentContact?.device?.uid === item?.device?.uid
                    ? { backgroundColor: "#f0f2f5" }
                    : {}
                }
                avatar={ContactDeviceAvatar(item)}
                title={item?.user?.nickname}
                description={item?.createdAt}
              />
            </List.Item>
          )}
        />
      ) : (
        <>
          <Empty/>
        </>
      )}
    </div>
  );
};

export default DeviceList;
