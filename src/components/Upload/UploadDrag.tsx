/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-26 13:05:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 14:47:13
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useEffect, useState, useMemo } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Modal, Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import moment from "moment";
import { ACCESS_TOKEN, HTTP_CLIENT } from "@/utils/constants";
import { message } from "@/AntdGlobalComp";
import { getUploadUrl } from "@/utils/configUtils";
import FilePreview from './FilePreview';
const { Dragger } = Upload;

//
type UploadDragProps = {
  type: string;
  isModalOpen: boolean;
  handleSubmit: (uploads: UPLOAD.UploadResponse[]) => void;
  handleCancel: () => void;
};
type UploadDataProps = {
  file: File | undefined;
  file_name: string;
  file_type: string;
  is_avatar: string;
  kb_type: string;
  category_uid: string | undefined;
  kb_uid: string | undefined;
  client: string;
};
//
const UploadDrag = ({
  type,
  isModalOpen,
  handleSubmit,
  handleCancel,
}: UploadDragProps) => {
  const [uploads, setUploads] = useState<UPLOAD.UploadResponse[]>([]);
  const [uploadParams, setUploadParams] = useState<UploadDataProps>({
    file: null,
    file_name: "test.pdf",
    file_type: "application/pdf",
    is_avatar: "false",
    kb_type: type,
    category_uid: "",
    kb_uid: "",
    client: HTTP_CLIENT,
  });

  // 使用 useMemo 来定义 uploadProps
  const uploadProps = useMemo<UploadProps>(() => ({
    name: "file",
    multiple: true,
    action: getUploadUrl(),
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
    },
    data: uploadParams,
    showUploadList: false,
    beforeUpload(file: RcFile) {
      const file_name = moment(new Date()).format("YYYYMMDDHHmmss") + "_" + file.name;
      setUploadParams(prev => ({
        ...prev,
        file: file,
        file_name: file_name,
        file_type: file.type,
        category_uid: "",
      }));
      return true;
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status === "uploading") {
        message.loading(`${info.file.name} 上传中`);
      }
      if (info.file.status === "done") {
        if (info.file.response.code === 200) {
          message.destroy();
          message.success(`${info.file.name} 上传成功`);
          setUploads(prevUploads => [...prevUploads, info.file.response.data]);
        } else {
          message.destroy();
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  }), [uploadParams]);

  useEffect(() => {
    setUploadParams(prev => ({
      ...prev,
      kb_type: type,
      category_uid: "",
    }));
  }, [type]);

  const handleOk = () => {
    console.log("handleOk", uploads);
    handleSubmit(uploads);
  };

  const handleDelete = (uid: string) => {
    console.log("handleDelete", uid);
    setUploads(prevUploads => prevUploads.filter(upload => upload.uid !== uid));
  };

  return (
    <Modal
      title="上传文件"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件至此处实现上传</p>
      </Dragger>

      {/* 文件预览列表 */}
      <div style={{ 
        marginTop: "16px",
        maxHeight: "200px",
        overflowY: "auto"
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          {uploads.map((upload) => (
            <FilePreview 
              key={upload.uid}
              file={upload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
export default UploadDrag;
