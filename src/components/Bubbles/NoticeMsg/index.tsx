/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:38:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 14:23:34
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
// import { sendLeaveMessage } from "@/apis/leavemsg";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ChatUI";
import useTranslate from "@/hooks/useTranslate";
// import { VISITOR_UID } from "@/utils/constants";
import { useEffect, useState } from "react";

type NoticeProps = {
  content: string;
  // type: string;
};

//
const NoticeMsg = ({ content }: NoticeProps) => {
  // {
  // "i18n.notice.title": "auth",
  // "i18n.notice.content": "loginWithUsernamePassword",
  // "i18n.notice.ip": "192.168.0.101",
  // "i18n.notice.ipLocation": "0|0|0|内网IP|内网IP"
  // }
  const [data, setData] = useState({});
  const { translateString } = useTranslate()

  useEffect(() => {
    // 假设你的数据被保存在一个名为data的变量中
    const parsedData = JSON.parse(content);
    setData(parsedData);
  }, [content]);

  return (
    <>
      <Card>
        <CardTitle>{translateString("i18n.notice")}</CardTitle>
        <CardContent>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <b>{translateString(key)}:</b>
              <>{
                translateString(value as string)
              }</>
            </div>
          ))}
        </CardContent>
      </Card>
      {/* <RateActions onClick={console.log} /> */}
    </>
  );
};
export default NoticeMsg;
