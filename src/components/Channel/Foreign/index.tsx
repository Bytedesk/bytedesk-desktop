/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-24 17:54:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:50:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import React from "react";
import { Tabs, TabsProps } from "antd";
import ChannelTelegram from "./tabs/Telegram";
import ChannelWhatsapp from "./tabs/Whatsapp";
import ChannelLine from "./tabs/Line";
import ChannelShopify from "./tabs/Shopify";
import ChannelLazada from "./tabs/Lazada";
import Facebook from "./tabs/facebook";
// import { useIntl } from "react-intl";

//
const ChannelForeign = () => {
    // const intl = useIntl();
    const items: TabsProps["items"] = [
        {
            key: "whatsapp",
            label: "Whatsapp",
            children: <ChannelWhatsapp />,
        },
        {
            key: "telegram",
            label: "Telegram",
            children: <ChannelTelegram />,
        },
        {
            key: "facebook",
            label: "Facebook",
            children: <Facebook />,
        },
        {
            key: "Line",
            label: "Line",
            children: <ChannelLine />,
        },

        {
            key: "shopify",
            label: "Shopify",
            children: <ChannelShopify />,
        },
        {
            key: "lazada",
            label: "Lazada",
            children: <ChannelLazada />,
        },
    ];

    return (
        <>
            {/* <ChannelTip  /> */}
            <Tabs tabPosition={"left"} items={items} />
        </>
    );
};
export default ChannelForeign;
