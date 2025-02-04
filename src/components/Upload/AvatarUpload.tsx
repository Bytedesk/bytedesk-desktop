/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-18 16:49:01
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 16:19:29
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
import React from "react";
import type { UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
import { ACCESS_TOKEN, HTTP_CLIENT, UPLOAD_TYPE_CHAT } from "@/utils/constants";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import moment from "moment";
import { message } from "@/AntdGlobalComp";
import { getUploadUrl } from "@/utils/configUtils";

// 点击快捷按钮上传
export const AvatarUpload = ({ children, onSuccess, onError }) => {
  // 
  const uploadData = {
    file: null,
    file_name: "test.png",
    file_type: 'image/png',
    is_avatar: "true",
    kb_type: UPLOAD_TYPE_CHAT,
    category_uid: "",
    kb_uid: "",
    client: HTTP_CLIENT,
  };
  const clickUploadProps: UploadProps = {
    name: "file",
    accept: "image/*",
    action: getUploadUrl(),
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
    },
    data: uploadData,
    showUploadList: false,
    beforeUpload(file: RcFile) {
      console.log("beforeUpload", file);
      const file_name =
        moment(new Date()).format("YYYYMMDDHHmmss") + "_" + file.name;
      uploadData.file = file;
      uploadData.file_name = file_name;
      uploadData.file_type = file.type;
      console.log("beforeUpload", uploadData);
      //
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status !== "uploading") {
        console.log("not uploading:", info.file);
      }
      if (info.file.status === "done") {
        console.log("response: ", info.file.response);
        if (info.file.response.code === 200) {
          const url = info.file.response.data;
          onSuccess(url);
          message.success(`${info.file.name} 上传成功`);
        } else {
          onError(info.file);
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
        onError(info.file);
      }
    },
  };

  return (
    <Upload {...clickUploadProps}>
      {children}
    </Upload>
  );
};

