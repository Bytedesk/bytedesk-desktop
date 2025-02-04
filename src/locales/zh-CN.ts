/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2023-08-26 16:06:55
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 16:46:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import desktop from "./zh-CN/desktop";
import menu from "./zh-CN/menu";
import pages from "./zh-CN/pages";
import app from './zh-CN/app';
import auth from './zh-CN/auth';
import chat from './zh-CN/chat';
import common from './zh-CN/common';
import customer from './zh-CN/customer';
import dashboard from './zh-CN/dashboard';
import i18n from './zh-CN/i18n';
import message from './zh-CN/message';
import profile from './zh-CN/profile';
import settings from './zh-CN/settings';
import thread from './zh-CN/thread';
import ticket from './zh-CN/ticket';
import contact from './zh-CN/contact';
import group from './zh-CN/group';
import robot from './zh-CN/robot';  
import autoreply from './zh-CN/autoreply';

export default {
  ...app,
  ...auth,
  ...chat,
  ...common,
  ...customer,
  ...dashboard,
  ...i18n,
  ...menu,
  ...message,
  ...pages,
  ...profile,
  ...settings,
  ...thread,
  ...ticket,
  ...desktop,
  ...contact,
  ...group,
  ...robot,
  ...autoreply,
}
