/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-24 10:41:21
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-24 11:15:39
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */

import { Button, QRCode } from "antd";
// 
type GroupProps = {
  group: GROUP.GroupResponse;
};
// 
const GroupQrcode = ({ group }: GroupProps) => {

  const downloadQRCode = () => {
    console.log("downloadQRCode");
    const canvas = document
      .getElementById("myqrcode")
      ?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = "profile.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.log("canvas is null");
    }
  };
  
  return (
    <div style={{ textAlign: "center" }}>
      <QRCode
        style={{ margin: "auto" }}
        errorLevel="H"
        value="https://www.weiyuai.cn/"
        icon="./logo.png"
      />
      <Button
        type="primary"
        onClick={downloadQRCode}
        style={{ marginTop: "10px" }}
      >
        下载二维码
      </Button>
    </div>
  );
};
export default GroupQrcode