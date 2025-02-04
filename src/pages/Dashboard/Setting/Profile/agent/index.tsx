/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-02 16:16:58
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-31 16:09:20
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Tabs, TabsProps } from "antd";
import TabInfo from "./TabInfo";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
// import TabRobot from "@/components/Advanced/TabRobot";
// import TabServiceSettings from "@/components/Advanced/TabServiceSettings";
import { IS_DEBUG } from "@/utils/constants";
// import TabAdvanced from "./TabAdvanced";
// import ChannelPlatform from "@/components/Channel/Platform";
// import TabInfo from "./TabInfo";
// import TabServiceSettings from "./TabServiceSettings";
// import TabCode from "./TabCode";
// import TabRobot from "./TabRobot";
// import TabAdvanced from "./TabAdvanced";
// import { CHANNEL_COMPONENT_TYPE_AGENT } from "@/utils/constants";
// import ChannelPlatform from "@/components/Channel/Platform";
// import { useEffect, useState } from "react";
// import ChannelSocial from "@/components/Channel/Social";
// import ChannelForeign from "@/components/Channel/Foreign";
// import ChannelShop from "@/components/Channel/Shop";
// import TabRobot from "@/components/Advanced/TabRobot";
// import TabServiceSettings from "@/components/Advanced/TabServiceSettings";
// import TabApi from "@/components/Advanced/TabApi";

const AgentTab = () => {
  const intl = useIntl();
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);

  // const onChange = (key: string) => {
  //   console.log(key);
  // };

  // 调试状态
  const itemsDebug: TabsProps["items"] = [
    {
      key: "basic",
      label: intl.formatMessage({ id: "pages.agent.tab.basic", defaultMessage: "Basic", }),
      children: <TabInfo />,
    },
    // {
    //   key: "serviceSettings",
    //   label: intl.formatMessage({ id: 'pages.agent.service.settings', defaultMessage: 'Settings' }),
    //   children: <TabServiceSettings />,
    // },
    // {
    //   key: "robot",
    //   label: intl.formatMessage({ id: 'pages.agent.robot', defaultMessage: 'Robot' }),
    //   children: <TabRobot />,
    // },
    // {
    //   key: "advanced",
    //   label: intl.formatMessage({ id: 'pages.robot.tab.advanced', defaultMessage: 'Advanced' }),
    //   children: <TabAdvanced />
    // },
    // {
    //   key: "channel",
    //   label: intl.formatMessage({ id: "pages.robot.tab.channel", defaultMessage: "Channel", }),
    //   children: <ChannelPlatform />,
    // },
    // {
    //   key: "channelsocial",
    //   label: intl.formatMessage({ id: "channelsocial", defaultMessage: "Social Channel", }),
    //   children: <ChannelSocial />
    // },
    // {
    //   key: "channelshop",
    //   label: intl.formatMessage({ id: "channelshop", defaultMessage: "Shop Channel", }),
    //   children: <ChannelShop />
    // },
    // {
    //   key: "channelforeign",
    //   label: intl.formatMessage({ id: "channelforeign", defaultMessage: "Foreign Channel", }),
    //   children: <ChannelForeign />
    // },
    // {
    //   key: "tabapi",
    //   label: 'API',
    //   children: <TabApi />
    // }
  ];

  useEffect(() => {

    if (IS_DEBUG) {
      // itemsDebug.push({
      //   key: "channelsocial",
      //   label: '社交渠道',
      //   children: <ChannelSocial />
      // },)
      // itemsDebug.push({
      //   key: "channelshop",
      //   label: '电商渠道',
      //   children: <ChannelShop />
      // },)
      // itemsDebug.push({
      //   key: "channelforeign",
      //   label: '海外渠道',
      //   children: <ChannelForeign />
      // },)
    }
    setTabItems(itemsDebug)

  }, [])

  return (
    <>
      <Tabs
        style={{ marginLeft: 20 }}
        defaultActiveKey="basic"
        items={tabItems} />
    </>
  );
};

export default AgentTab;
