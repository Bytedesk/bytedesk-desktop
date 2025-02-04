/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:29:41
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-08 14:46:08
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { Avatar, Empty, List } from "antd";

// 群聊
const GroupList = () => {

    const data = [
      // {
      //   title: "Ant Design Title 1",
      // },
    ];


    return (
      <div>
        {data.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={<a>{item.title}</a>}
                  description="Ant Design"
                />
              </List.Item>
            )}
          />
        ) : (
          <>
            <Empty />
          </>
        )}
      </div>
    );
}

export default GroupList;