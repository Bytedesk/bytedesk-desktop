/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-10 17:43:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 17:43:09
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { Modal } from "antd";
import Screenshots from "../Screenshots";
import { useCallback } from "react";
import { Bounds } from "../Screenshots/types";
import moment from "moment";
import { ACCESS_TOKEN, EVENT_BUS_SEND_IMAGE_MESSAGE, HTTP_CLIENT, UPLOAD_TYPE_CHAT } from "@/utils/constants";
import emitter from "@/utils/eventEmitter";
import { getUploadUrl } from "@/utils/configUtils";
import { openUrl } from "@/utils/electronApiUtils";
// https://www.npmjs.com/package/file-saver
// import { saveAs } from "file-saver";

//
type ScreenRecorderModelProps = {
  open: boolean;
  screenShotImg: string;
  onOk: () => void;
  onCancel: () => void;
};

const ScreenRecorderModel = ({
  open,
  screenShotImg,
  onOk,
  onCancel,
}: ScreenRecorderModelProps) => {
  // console.log("ScreenRecorderModel screenShotImg:", screenShotImg);

  // 点击下载保存按钮
  const onScreenSave = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log("onScreenSave", blob, bounds);
    if (blob) {
      const url = URL.createObjectURL(blob);
      console.log(url);
      openUrl(url);
    }
  }, []);

  // 点击取消按钮
  const onScreenCancel = useCallback(() => {
    console.log("onScreenCancel");
  }, []);

  // 点击确定OK对钩按钮
  const onScreenOk = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log("onScreenOk", blob, bounds);
    if (blob) {
      handleUploadBlob(blob);
    }
  }, []);
  //
  // screenShotImg是data:image/png;base64,开头的字符串，转换为blob，然后上传并发送
  const handleOk = () => {
    if (screenShotImg.startsWith("data:image/png;base64,")) {
      const base64Data = screenShotImg.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: "image/png" });
      handleUploadBlob(blob);
      
    } else {
      onOk();
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleUploadBlob = async (blob: Blob | null) => {
    //
    const file_name = moment(new Date()).format("YYYYMMDDHHmmss") + "_" + "screenshot.png";
    // saveAs(blob, "screenshot.png");
    //
    const formData = new FormData();
    formData.append("file", blob, file_name);
    formData.append("file_name", file_name);
    formData.append("file_type", "image/png");
    formData.append("is_avatar", "false");
    formData.append("kb_type", UPLOAD_TYPE_CHAT);
    formData.append("category_uid", "");
    formData.append("kb_uid", "");
    formData.append("client", HTTP_CLIENT);
    console.log("handleUpload formData", formData);
    //
    fetch(getUploadUrl(), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
      },
      body: formData,
    })
      .then((response) => {
        console.log("upload response:", response);
        return response.json();
      })
      .then((result: MESSAGE.HttpUploadResult) => {
        console.log("upload data:", result);
        // callback(result);
        emitter.emit(EVENT_BUS_SEND_IMAGE_MESSAGE, result.data);
        onOk();
      });
  };

  return (
    <>
      <Modal
        title="截屏录屏"
        open={open}
        okText="发送"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Screenshots
          url={screenShotImg}
          width={470}
          height={400}
          onSave={onScreenSave}
          onCancel={onScreenCancel}
          onOk={onScreenOk}
        />
      </Modal>
    </>
  );
};
export default ScreenRecorderModel;
