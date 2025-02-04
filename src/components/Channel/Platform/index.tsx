/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-24 17:54:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 17:36:07
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React from "react";
import { Tabs, TabsProps } from "antd";
import Web from "./tabs/Web";
import Ios from "./tabs/iOS";
import Uniapp from "./tabs/Uniapp";
import Flutter from "./tabs/Flutter";
import Android from "./tabs/Android";
import ReactChannel from "./tabs/ReactChannel";
// import { useIntl } from "react-intl";

//
const ChannelPlatform = () => {
    // const intl = useIntl();

    const items: TabsProps["items"] = [
        {
            key: "web",
            label: "Web",
            children: <Web  />,
        },
        {
            key: "react",
            label: "React",
            children: <ReactChannel  />,
        },
        {
            key: "ios",
            label: "iOS",
            children: <Ios  />,
        },
        {
            key: "android",
            label: "Android",
            children: <Android  />,
        },
        {
            key: "uniapp",
            label: "Uniapp",
            children: <Uniapp  />,
        },
        {
            key: "flutter",
            label: "Flutter",
            children: <Flutter  />,
        },
    ];

    return (
        <>
            <Tabs tabPosition={"left"} items={items} />
        </>
    );
};
export default ChannelPlatform;
