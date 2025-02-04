/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-27 15:10:40
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-27 15:46:03
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useEffect, useState } from "react";
import { Tabs, TabsProps } from "antd";
import TabFaq from "@/components/Advanced/TabFaq";
import TabFaqHot from "@/components/Advanced/TabFaqHot";
import TabFaqShortcut from "@/components/Advanced/TabFaqShortcut";
import TabLeaveMsg from "@/components/Advanced/TabLeaveMsg";
import TabRate from "@/components/Advanced/TabRate";
import TabFaqQuick from "@/components/Advanced/TabFaqQuick";
import TabFaqGuess from "@/components/Advanced/TabFaqGuess";
// import TabBlack from "@/components/Advanced/TabBlack";
import TabAutoreply from "@/components/Advanced/TabAutoreply";
import { FormattedMessage } from "react-intl";
import TabCaptcha from "@/components/Advanced/TabCaptcha";
import TabHistory from "@/components/Advanced/TabHistory";
import TabInputAssociation from "@/components/Advanced/TabInputAssociation";
import TabPreForm from "@/components/Advanced/TabPreForm";
import { IS_DEBUG } from "@/utils/constants";

const TabAdvanced: React.FC = () => {
  // const intl = useIntl();
  // 高级配置
  const itemsDebug: TabsProps["items"] = [
    {
      key: "faq",
      label: <FormattedMessage id="pages.advanced.faq" />,
      children: <TabFaq />,
    },
    {
      key: "quickFaqs",
      label: <FormattedMessage id="pages.advanced.quickButton" />,
      children: <TabFaqQuick />,
    },
    {
      key: "faqGuess",
      label: <FormattedMessage id="pages.advanced.faqGuess" />,
      children: <TabFaqGuess />,
    },
    {
      key: "faqHot",
      label: <FormattedMessage id="pages.advanced.faqHot" />,
      children: <TabFaqHot />,
    },
    {
      key: "faqShortcut",
      label: <FormattedMessage id="pages.advanced.faqShortcut" />,
      children: <TabFaqShortcut />,
    },
    // {
    //   key: "rate",
    //   label: <FormattedMessage id="pages.advanced.rate" />,
    //   children: <TabRate />,
    // },
    // {
    //   key: "autoreply",
    //   label: <FormattedMessage id="pages.advanced.autoreply" />,
    //   children: <TabAutoreply />,
    // },
    // {
    //   key: "leaveMsg",
    //   label: <FormattedMessage id="pages.advanced.leaveMsg" />,
    //   children: <TabLeaveMsg />,
    // },
    // {
    //   key: "survey",
    //   label: <FormattedMessage id="pages.advanced.survey" />,
    //   children: <TabPreForm />,
    // },
    // {
    //   key: "history",
    //   label: <FormattedMessage id="pages.advanced.history" />,
    //   children: <TabHistory />,
    // },
    // {
    //   key: "inputassociation",
    //   label: <FormattedMessage id="pages.advanced.inputAssociation" />,
    //   children: <TabInputAssociation />,
    // },
    // {
    //   key: "antiharassment",
    //   label: <FormattedMessage id="pages.advanced.antiHarassment" />,
    //   children: <TabCaptcha />,
    // }
  ];
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);

  useEffect(() => {

    if (IS_DEBUG) {
      itemsDebug.push(
        {
          key: "rate",
          label: <FormattedMessage id="pages.advanced.rate" />,
          children: <TabRate />,
        },
        {
          key: "autoreply",
          label: <FormattedMessage id="pages.advanced.autoreply" />,
          children: <TabAutoreply />,
        },
        {
          key: "leaveMsg",
          label: <FormattedMessage id="pages.advanced.leaveMsg" />,
          children: <TabLeaveMsg />,
        },
        {
          key: "survey",
          label: <FormattedMessage id="pages.advanced.survey" />,
          children: <TabPreForm />,
        },
        {
          key: "history",
          label: <FormattedMessage id="pages.advanced.history" />,
          children: <TabHistory />,
        },
        {
          key: "inputassociation",
          label: <FormattedMessage id="pages.advanced.inputAssociation" />,
          children: <TabInputAssociation />,
        },
        {
          key: "antiharassment",
          label: <FormattedMessage id="pages.advanced.antiHarassment" />,
          children: <TabCaptcha />,
        }
      )
    }
    setTabItems(itemsDebug)
  }, [])

  return (
    <>
      <Tabs tabPosition={"left"} items={tabItems} />
    </>
  );
};

export default TabAdvanced;
