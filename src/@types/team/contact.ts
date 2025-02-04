/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-30 11:46:47
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-08 15:59:02
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
declare namespace CONTACT {
  type Contact = {
    type: string;
    device?: DEVICE.Device;
    // address?: MULTICAST.AddressObject;
    member?: MEMBER.MemberResponse;
    user?: MULTICAST.UserObject;
    createdAt?: string;
  };
}
