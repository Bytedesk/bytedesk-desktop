/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2023-08-26 16:06:55
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 10:33:17
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import desktop from "./zh-TW/desktop";
import menu from "./zh-TW/menu";
import pages from "./zh-TW/pages";
import app from './zh-TW/app';
import auth from './zh-TW/auth';
import chat from './zh-TW/chat';
import common from './zh-TW/common';
import customer from './zh-TW/customer';
import dashboard from "./zh-TW/dashboard";
import i18n from './zh-TW/i18n';
import message from './zh-TW/message';
import profile from './zh-TW/profile';
import settings from './zh-TW/settings';
import thread from './zh-TW/thread';
import ticket from './zh-TW/ticket';
import contact from './zh-TW/contact';
import group from './zh-TW/group';
import robot from './zh-TW/robot'

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
  ...robot
}
