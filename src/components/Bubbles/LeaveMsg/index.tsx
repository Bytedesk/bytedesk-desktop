/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:38:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:07:11
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
  Button,
  Card,
  CardActions,
  CardContent,
  CardTitle,
  Input,
} from "@/components/ChatUI";
import { MESSAGE_STATUS_LEAVE_MSG_SUBMIT } from "@/utils/constants";
// import { VISITOR_UID } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

type LeaveMsgProps = {
  content: string;
  status?: string;
  type: string;
};

//
const LeaveMsg = ({ content, status, type }: LeaveMsgProps) => {
  const [contact, setContact] = useState("");
  const [contentMsg, setContentMsg] = useState("");
  const [disabled, setDisabled] = useState(false);
  const intl = useIntl();
  console.log("LeaveMsg content:", content, type);

  useEffect(() => {
    if (status === MESSAGE_STATUS_LEAVE_MSG_SUBMIT) {
      setDisabled(true);
      //
      let extra: VISITOR.MessageLeaveMsgExtra | null = null;
      try {
        extra = JSON.parse(content);
      } catch (error) {
        // console.error('解析content为JSON时出错:', error);
        // 这里可以添加额外的错误处理逻辑，比如设置一个默认值或者显示一个错误消息给用户
      }
      // 在使用extra之前，确保它不是null
      if (extra) {
        // 使用extra对象的代码...
        setContact(extra.contact);
        setContentMsg(extra.content);
      }
      //
    }
  }, [status]);

  const handleContactChange = (content: string) => {
    console.log("handleContactChange:", content);
    setContact(content);
  };

  const handleContentChange = (content: string) => {
    console.log("handleContentChange:", content);
    setContentMsg(content);
  };

  return (
    <>
      <Card>
        <CardTitle>
          {intl.formatMessage({
            id: 'leavemsg.title',
            defaultMessage: '留言'
          })}
        </CardTitle>
        <CardContent>
          {disabled && (
            <Input
              value={contact}
              placeholder={intl.formatMessage({
                id: 'leavemsg.contact.placeholder',
                defaultMessage: '请输入联系方式...'
              })}
              rows={1}
              onChange={handleContactChange}
              style={{ marginTop: "8px" }}
              disabled={true}
            />
          )}
          {disabled && (
            <Input
              value={contentMsg}
              placeholder={intl.formatMessage({
                id: 'leavemsg.content.placeholder',
                defaultMessage: '请输入留言...'
              })}
              rows={3}
              onChange={handleContentChange}
              style={{ marginTop: "8px" }}
              disabled={true}
            />
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" disabled={true}>
            {disabled ? 
              intl.formatMessage({
                id: 'leavemsg.status.submitted',
                defaultMessage: '访客已留言'
              }) : 
              intl.formatMessage({
                id: 'leavemsg.status.pending',
                defaultMessage: '待留言'
              })
            }
          </Button>
        </CardActions>
      </Card>
      {/* <RateActions onClick={console.log} /> */}
    </>
  );
};
export default LeaveMsg;
