/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 11:09:02
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:37:13
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// // 注册接口
// import request from "@/apis/request";

// // 发送手机验证码 - 注册
// export async function sendRegisgerMobileCode(body: AUTH.RequestCodeParam) {
//   console.log("sendRegisgerMobileCode:", body);
//   return request<AUTH.HttpResult>("/sms/api/v3/send/register", {
//     method: "POST",
//     data: {
//       mobile: body.mobile,
//     },
//   });
// }

// // 发送手机验证码 - 登录
// export async function sendLoginMobileCode(body: AUTH.RequestCodeParam) {
//   console.log("sendLoginMobileCode:", body);
//   return request<AUTH.HttpResult>("/sms/api/v3/send/login", {
//     method: "POST",
//     data: {
//       mobile: body.mobile,
//     },
//   });
// }

// // 验证手机号验证码是否有效
// export async function validateMobileCode(body: AUTH.RequestCodeParam) {
//   return request<AUTH.HttpResult>("/sms/api/validate", {
//     method: "GET",
//     params: {
//       mobile: body.mobile,
//       code: body.code,
//     },
//   });
// }

// // 发送邮箱验证码 - 注册
// export async function sendRegisterEmailCode(body: AUTH.RequestCodeParam) {
//   return request<AUTH.HttpResult>("/email/api/v3/send/register", {
//     method: "POST",
//     data: {
//       email: body.email,
//     },
//   });
// }

// // 发送邮箱验证码 - 登录
// export async function sendLoginEmailCode(body: AUTH.RequestCodeParam) {
//   return request<AUTH.HttpResult>("/email/api/v3/send/login", {
//     method: "POST",
//     data: {
//       email: body.email,
//     },
//   });
// }

// // 验证邮箱验证码是否有效
// export async function validateEmailCode(body: AUTH.RequestCodeParam) {
//   return request<AUTH.HttpResult>("/email/api/validate", {
//     method: "GET",
//     params: {
//       email: body.email,
//       code: body.code,
//     },
//   });
// }

// // 注册
// export async function register(body: AUTH.RegisterParams) {
//   return request<AUTH.HttpResult>("/visitor/api/v3/register", {
//     method: "POST",
//     data: {
//       email: body.email,
//       password: body.password,
//       mobile: body.mobile,
//       code: body.code,
//     },
//   });
// }
