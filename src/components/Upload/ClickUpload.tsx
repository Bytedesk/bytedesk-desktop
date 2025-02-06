/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-18 16:49:01
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 12:08:03
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React from "react";
import type { UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
import {
  ACCESS_TOKEN,
  EVENT_BUS_SEND_FILE_MESSAGE,
  EVENT_BUS_SEND_IMAGE_MESSAGE,
} from "@/utils/constants";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import moment from "moment";
import { message } from "@/AntdGlobalComp";
import { isImageFileByType } from "@/utils/utils";
// import { mqttSendFileMessage, mqttSendImageMessage } from "@/network/mqtt";
import emitter from "@/utils/eventEmitter";
import { getUploadUrl } from "@/utils/configUtils";

// 点击快捷按钮上传

export const ClickUpload = ({ children }) => {
  //
  let isImageFile = true;
  const uploadData = {
    file: null,
    file_name: "test.png",
    file_type: "image/png",
    // client: HTTP_CLIENT,
  };
  const clickUploadProps: UploadProps = {
    name: "file",
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
      isImageFile = isImageFileByType(file);
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log("done", info.file.response);
        if (isImageFile) {
          // 发送图片
          emitter.emit(EVENT_BUS_SEND_IMAGE_MESSAGE, info.file.response.data.fileUrl);
        } else {
          // 发送文件
          emitter.emit(EVENT_BUS_SEND_FILE_MESSAGE, info.file.response.data.fileUrl);
        }
        //
        message.success(`${info.file.name} 发送成功`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return <Upload {...clickUploadProps}>{children}</Upload>;
};
