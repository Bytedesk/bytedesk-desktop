/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-20 17:03:53
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-19 11:31:54
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Layout } from "antd";
import useStyle from "@/hooks/useStyle";
const { Sider, Content } = Layout;
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "grp",
    label: "会议管理",
    type: "group",
    children: [
      { key: "13", label: "待分配" },
      { key: "14", label: "待处理" },
      { key: "15", label: "处理中" },
      { key: "16", label: "处理完毕" },
    ],
  },
];
//
const Conference = () => {
  const { leftSiderStyle, leftSiderWidth } = useStyle();
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
  //
  return (
    <>
      <Layout>
        <Sider style={leftSiderStyle} width={leftSiderWidth}>
          <Menu
            onClick={onClick}
            style={{ width: 256 }}
            // defaultSelectedKeys={["1"]}
            // defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content>会议</Content>
          {/* <Sider style={rightSiderStyle}></Sider> */}
        </Layout>
      </Layout>
    </>
  );
};
export default Conference;
