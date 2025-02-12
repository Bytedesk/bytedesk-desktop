/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-26 13:05:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-13 16:07:37
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
import { useIntl } from "react-intl";
const { Dragger } = Upload;

//
type UploadDragProps = {
  type: string;
  acceptType?: string;
  isModalOpen: boolean;
  attachments?: TICKET.TicketAttachmentResponse[];
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
  acceptType,
  isModalOpen,
  attachments,
  handleSubmit,
  handleCancel,
}: UploadDragProps) => {
  const intl = useIntl();
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
  console.log("acceptType", acceptType);

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
        message.loading(intl.formatMessage(
          { id: 'upload.uploading' },
          { filename: info.file.name }
        ));
      }
      if (info.file.status === "done") {
        if (info.file.response.code === 200) {
          message.destroy();
          message.success(intl.formatMessage(
            { id: 'upload.success' },
            { filename: info.file.name }
          ));
          setUploads(prevUploads => [...prevUploads, info.file.response.data]);
        } else {
          message.destroy();
          message.error(intl.formatMessage(
            { id: 'upload.failed' },
            { filename: info.file.name }
          ));
        }
      } else if (info.file.status === "error") {
        message.error(intl.formatMessage(
          { id: 'upload.failed' },
          { filename: info.file.name }
        ));
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  }), [uploadParams, intl]);

  useEffect(() => {
    setUploadParams(prev => ({
      ...prev,
      kb_type: type,
      category_uid: "",
    }));
    if (attachments) {
      setUploads(attachments.map(attachment => attachment.upload));
    }
  }, [type]);

  const handleOk = () => {
    // console.log("handleOk", uploads);
    handleSubmit(uploads);
  };

  const handleDelete = (uid: string) => {
    console.log("handleDelete", uid);
    setUploads(prevUploads => prevUploads.filter(upload => upload.uid !== uid));
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'upload.modal.title' })}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {intl.formatMessage({ id: 'upload.drag.text' })}
        </p>
        <p className="ant-upload-hint">
          {intl.formatMessage({ id: 'upload.drag.hint' })}
        </p>
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
