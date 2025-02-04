/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-22 09:42:05
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { Flex } from "../Flex";
import useTranslate from "@/hooks/useTranslate";
import { MESSAGE_TYPE_AUDIO, MESSAGE_TYPE_FILE, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_VIDEO } from "@/utils/constants";
// import { useLocale } from "../ConfigProvider";

export type SendConfirmProps = {
  file: Blob;
  onCancel: () => void;
  onSend: () => void;
};

export const SendConfirm = (props: SendConfirmProps) => {
  const { file, onCancel, onSend } = props;
  const [img, setImg] = useState("");
  const [fileType, setFileType] = useState("");
  // const { trans } = useLocale("SendConfirm");
  const { translateString } = useTranslate();

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        setImg(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // 获取文件类型
    // @ts-ignore
    const fileExt = file.name.toLowerCase().split(".").pop(); // 获取文件扩展名
    console.log("SendConfirm file:", fileExt, file.size);
    // 判断图片类型
    let fileType = "unknown";
    if (
      fileExt === "jpg" ||
      fileExt === "jpeg" ||
      fileExt === "png" ||
      fileExt === "bmp" ||
      fileExt === "gif"
    ) {
      fileType = MESSAGE_TYPE_IMAGE
    } else if (fileExt === "mp4" || fileExt === "avi" || fileExt === "mov") {
      fileType = MESSAGE_TYPE_VIDEO;
    } else if (fileExt === "mp3" || fileExt === "wav") {
      fileType = MESSAGE_TYPE_AUDIO;
    } else {
      fileType = MESSAGE_TYPE_FILE;
    }
    setFileType(fileType);
    
  }, [file]);

  return (
    <Modal
      className="SendConfirm"
      title={translateString("i18n.preview.title")}
      active={!!img}
      vertical={false}
      actions={[
        {
          label: translateString("i18n.cancel"),
          onClick: onCancel,
        },
        {
          label: translateString("i18n.send"),
          color: "primary",
          onClick: onSend,
        },
      ]}
    >
      <Flex className="SendConfirm-inner" center>
        {fileType === MESSAGE_TYPE_IMAGE && (
          <>
            <img src={img} alt="" />
          </>
        )}
        {
          fileType === MESSAGE_TYPE_VIDEO && (
            <div style={{ width: "80%", height: "80%" }}>
              <video controls style={{ width: "100%", height: "100%" }}>
                <source src={img} type="video/mp4" />
              </video>
            </div>
          )
        }
        {
          fileType === MESSAGE_TYPE_AUDIO && (
            <>
              <audio controls>
                <source src={img} type="audio/mp3" />
              </audio>
            </>
          )
        }
        {
          fileType === MESSAGE_TYPE_FILE && (
            <>
              <div className="SendConfirm-file">
                <i className="iconfont icon-fujian"></i>
                <span>{
                  // @ts-ignore
                  file.name
                }</span>
              </div>
            </>
          )
        }
      </Flex>
    </Modal>
  );
};
