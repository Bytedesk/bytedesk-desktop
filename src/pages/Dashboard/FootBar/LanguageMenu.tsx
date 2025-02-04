/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-04 15:45:10
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-05 16:47:43
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 */
import { Menu, MenuProps } from "antd";
import { GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const LanguageMenu = () => {
  const intl = useIntl();
  const { locale, changeLocale } = useContext(AppContext);

  // 语言菜单项
  const langMenuItems: MenuProps["items"] = [
    {
      key: "lang",
      icon: <GlobalOutlined />,
      label: intl.formatMessage({ id: "menu.language" }),
      children: [
        {
          key: "zh-cn",
          icon: locale.locale === "zh-cn" ? <CheckOutlined /> : <></>,
          label: intl.formatMessage({ id: "i18n.lang.zh-CN" }),
        },
        {
          key: "zh-tw",
          icon: locale.locale === "zh-tw" ? <CheckOutlined /> : <></>,
          label: intl.formatMessage({ id: "i18n.lang.zh-TW" }),
        },
        {
          key: "en",
          icon: locale.locale === "en" ? <CheckOutlined /> : <></>,
          label: intl.formatMessage({ id: "i18n.lang.en-US" }),
        },
      ],
    },
  ];

  // 处理语言切换
  const handleLangMenuClick: MenuProps["onClick"] = (e) => {
    const lang = e.key;
    changeLocale(lang);
  };

  return (
    <Menu
      inlineCollapsed={true}
      onClick={handleLangMenuClick}
      style={{ width: 64, height: 34 }}
      mode="inline"
      items={langMenuItems}
    />
  );
};

export default LanguageMenu; 