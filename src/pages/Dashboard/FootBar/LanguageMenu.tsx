/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-04 15:45:10
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 15:46:56
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 */
import { Menu, MenuProps } from "antd";
import { GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useState } from "react";

const LanguageMenu = () => {
  const intl = useIntl();
  const [locale, setLocale] = useState(localStorage.getItem("locale") || "zh-CN");

  // 语言菜单项
  const langMenuItems: MenuProps["items"] = [
    {
      key: "lang",
      icon: <GlobalOutlined />,
      label: intl.formatMessage({ id: "menu.language" }),
      children: [
        {
          key: "zh-CN",
          icon: locale === "zh-CN" ? <CheckOutlined /> : <></>,
          label: intl.formatMessage({ id: "i18n.lang.zh-CN" }),
        },
        {
          key: "zh-TW",
          icon: locale === "zh-TW" ? <CheckOutlined /> : <></>,
          label: intl.formatMessage({ id: "i18n.lang.zh-TW" }),
        },
        {
          key: "en-US",
          icon: locale === "en-US" ? <CheckOutlined /> : <></>,
          label: intl.formatMessage({ id: "i18n.lang.en-US" }),
        },
      ],
    },
  ];

  // 处理语言切换
  const handleLangMenuClick: MenuProps["onClick"] = (e) => {
    const lang = e.key;
    setLocale(lang);
    localStorage.setItem("locale", lang);
    window.location.reload();
  };

  return (
    <Menu
      inlineCollapsed={true}
      onClick={handleLangMenuClick}
      style={{ width: 64, height: 44 }}
      mode="inline"
      items={langMenuItems}
    />
  );
};

export default LanguageMenu; 