/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-17 07:10:48
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 14:23:18
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import { Button, Drawer, Space } from "antd";
import { useIntl } from "react-intl";
import VipContainer from "../../Home/RightPanel/components/VipContainer";

type TicketCreateDrawerProps = {
  open: boolean;
  isEdit?: boolean;
  currentTicket?: TICKET.TicketResponse;
  onSuccess: () => void;
  onCancel: () => void;
};

const TicketCreateDrawer = ({
  open,
  isEdit = false,
  currentTicket,
  onSuccess,
  onCancel,
}: TicketCreateDrawerProps) => {
  const intl = useIntl();

  return (
    <Drawer
      title={intl.formatMessage({
        id: isEdit ? 'ticket.edit.title' : 'ticket.create.title',
        defaultMessage: isEdit ? '编辑工单' : '创建工单'
      })}
      width={600}
      open={open}
      onClose={onCancel}
      extra={
        <Space>
          <Button onClick={onCancel}>
            {intl.formatMessage({ id: 'common.cancel' })}
          </Button>
        </Space>
      }
    >
      <VipContainer />
    </Drawer>
  );
};

export default TicketCreateDrawer;