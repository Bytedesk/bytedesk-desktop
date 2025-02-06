/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-18 14:34:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 11:26:37
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
import { SendConfirm } from "@/components/ChatUI/components/SendConfirm";
import { MESSAGE_TYPE_FILE, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_VIDEO } from "@/utils/constants";
import { handleUpload } from "@/utils/utils";
import React, { useCallback, useState } from "react";
// https://react-dropzone.js.org/
import { useDropzone } from "react-dropzone";

export type DropUploadProps = {
  onImageSend?: (url: string, type: string) => void;
  children: any;
};

// TODO: 给出提示：暂不支持发送文件夹
const DropUpload: React.FC<DropUploadProps> = ({ onImageSend, children }) => {
  // const [files, setFiles] = useState([]);
  const [pastedImage, setPastedImage] = useState<File | null>(null);
  // 
  const handleImageCancel = useCallback(() => {
    console.log("DropUpload handleImageCancel");
    setPastedImage(null);
  }, []);

  const handleImageSend = useCallback(() => {
    console.log("DropUpload handleImageSend");
    //
    handleUpload(pastedImage, (result: MESSAGE.HttpUploadResult) => {
      // 发送消息
      if (pastedImage?.type.startsWith("image")) {
        onImageSend(result.data, MESSAGE_TYPE_IMAGE);
      } else if (pastedImage?.type.startsWith("video/")) {
        // 假设您想对视频进行特殊处理，例如传递一个不同的类型
        onImageSend(result.data, MESSAGE_TYPE_VIDEO);
      } else {
        onImageSend(result.data, MESSAGE_TYPE_FILE);
      }
      setPastedImage(null);
    });
    // 
  }, [pastedImage]);
  //
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log("DropUpload acceptedFiles", acceptedFiles);
    // setFiles(acceptedFiles.map(file => Object.assign(file, {
    //     preview: URL.createObjectURL(file)
    // })));
    acceptedFiles.map((file) => {
      console.log(file);
      //
      setPastedImage(file);
    });
  }, []);
  // TODO: 支持多个文件
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    // accept: {
    //     'image/*': []
    // },
    onDrop,
    onDropAccepted(files, event) {
        console.log("DropUpload onDropAccepted", files, event);
    },
    onDropRejected(fileRejections, event) {
        console.log("DropUpload onDropRejected", fileRejections, event);
    },
    noClick: true,
  });

  return (
    <div {...getRootProps()} style={{ height: "100%" }}>
      <input {...getInputProps()} />
      {
        // isDragActive ?
        // <p>Drop the files here ...</p> :
        <>{children}</>
      }
      {pastedImage && (
        <SendConfirm
          file={pastedImage}
          onCancel={handleImageCancel}
          onSend={handleImageSend}
        />
      )}
    </div>
  );
};
export default DropUpload;
