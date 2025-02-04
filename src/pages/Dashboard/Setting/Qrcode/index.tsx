/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-15 12:14:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-25 12:02:03
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import { AppContext } from "@/context/AppContext";
import { useUserStore } from "@/stores/core/user";
import { Button, QRCode } from "antd";
// import { Locale } from "antd/es/locale";
// import enUS from 'antd/locale/en_US';
// import zhCN from 'antd/locale/zh_CN';
// import { useContext } from "react";
// import dayjs from 'dayjs';
// import { useState } from "react";
// import 'dayjs/locale/zh-cn';
// import { useTranslation } from "react-i18next";

// type Locale = ConfigProviderProps['locale'];
// dayjs.locale('en');

// https://ant-design.antgroup.com/components/qr-code-cn
const Qrcode = () => {
  // const { t } = useTranslation();
  // const { locale, changeLocale } = useContext(AppContext)
  const userInfo = useUserStore(state => state.userInfo);

  const downloadQRCode = () => {
    console.log("downloadQRCode");
    const canvas = document
      .getElementById("myqrcode")
      ?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = userInfo.username + "_profile.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.log("canvas is null");
    }
  };

  return (
    // id用于生成qrcode下载图片，不能删除
    <div id="myqrcode" style={{ textAlign: "center", marginTop: "50px" }}>
      <QRCode
        style={{ margin: "auto" }}
        errorLevel="H"
        value="https://www.weiyuai.cn/"
        icon="/agent/logo.png"
      />
      <Button
        type="primary"
        onClick={downloadQRCode}
        style={{ marginTop: "20px" }}
      >
        下载二维码
      </Button>
    </div>
  );
};
export default Qrcode;
