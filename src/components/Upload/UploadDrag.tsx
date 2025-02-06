/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-26 13:05:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 14:43:25
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
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Modal, Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import moment from "moment";
import { ACCESS_TOKEN, HTTP_CLIENT } from "@/utils/constants";
import { message } from "@/AntdGlobalComp";
import { getUploadUrl } from "@/utils/configUtils";
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
    multiple: true, // 启用多文件上传
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
      return true; // 返回 true 允许上传
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
      Array.from(e.dataTransfer.files).forEach(file => {
        handleUpload(file);
      });
    },
  }), [uploadParams]); // 依赖 uploadParams

  const handleUpload = (file: File) => {
    const file_name = moment(new Date()).format("YYYYMMDDHHmmss") + "_" + file.name;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_name", file_name);
    formData.append("file_type", file.type);
    formData.append("is_avatar", "false");
    formData.append("kb_type", type);
    formData.append("category_uid", "");
    formData.append("kb_uid", "");
    formData.append("client", HTTP_CLIENT);

    fetch(getUploadUrl(), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
      },
      body: formData,
    })
    .then(response => response.json())
    .then((result: UPLOAD.HttpResult) => {
      if (result.code === 200) {
        message.destroy();
        message.success(`${file_name} 上传成功`);
        setUploads(prevUploads => [...prevUploads, result.data]);
      } else {
        message.destroy();
        message.error(`${file_name} 上传失败`);
      }
    })
    .catch(error => {
      console.error('Upload error:', error);
      message.error(`${file_name} 上传失败`);
    });
  };

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

      {/* 上传的文件列表, 支持点击打开URL，删除，图片支持预览*/}
      <div style={{ 
        marginTop: "16px",
        maxHeight: "200px",
        overflowY: "auto"
      }}>
        {uploads.map((upload) => (
          <div 
            key={upload.uid} 
            style={{ 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              marginBottom: "8px",
              border: "1px solid #f0f0f0",
              borderRadius: "4px"
            }}
          >
            <div
              onClick={() => window.open(upload.fileUrl, "_blank")}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                cursor: "pointer",
                flex: 1
              }}
            >
              {/* 图片支持预览, 完善图片类型判断 */}
              {upload.fileType.startsWith("image/") ? (
                <img
                  src={upload.fileUrl}
                  alt={upload.fileName}
                  style={{ 
                    width: "40px", 
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "4px"
                  }}
                />
              ) : (
                // 限制文件名的长度为10个字符，多余部分使用...表示
                <div style={{ 
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {upload.fileName}
                </div>
              )}
            </div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(upload.uid)}
              style={{ marginLeft: "8px" }}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default UploadDrag;
