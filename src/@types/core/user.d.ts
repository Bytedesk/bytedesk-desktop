/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2023-10-11 14:08:39
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-11 17:50:37
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/* eslint-disable */

declare namespace USER {
  //
  type UserRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    username?: string;
    nickname?: string;
    email?: string;
    country?: string;
    mobile?: string;
    avatar?: string;
    description?: string;
    platform?: string;
    //
    enabled?: boolean;
    superUser?: boolean;
    emailVerified?: boolean;
    mobileVerified?: boolean;
    //
    oldPassword?: string;
    newPassword?: string;
    code?: string;
    //
    orgUid?: string;
  };
  //
  type HttpResult = {
    message: string;
    code: number;
    data: UserResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: UserResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  //
  type UserResponse = {
    uid?: string;
    username?: string;
    nickname?: string;
    email?: string;
    mobile?: string;
    country?: string;
    avatar?: string;
    description?: string;
    platform?: string;
    //
    enabled?: boolean;
    superUser?: boolean;
    emailVerified?: boolean;
    mobileVerified?: boolean;
    //
    oldPassword?: string;
    newPassword?: string;
    //
    currentOrganization?: ORG.Organization;
    userOrganizationRoles?: UserOrganizationRole[];
    authorities?: SimpleGrantedAuthority[];
  };

  type UserOrganizationRole = {
    organization?: ORG.Organization;
    roles?: Role[]
  };

  type UserProtobuf = {
    uid?: string;
    nickname?: string;
    avatar?: string;
    type?: string;
    extra?: string;
  };

  type Role = {
    uid?: string;
    name?: string;
    type?: string;
    // value?: string;
    description?: string;
    authorities?: Authority[];
  };

  //
  type SimpleGrantedAuthority = {
    authority: string;
  };

  type Authority = {
    uid?: string;
    name?: string;
    value?: string;
    description?: string;
    type?: string;
  };
}
