import { Button, Modal } from "antd";

/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-26 13:05:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 14:27:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useEffect, useState } from "react";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
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
  //
  const [uploadData, setUploadData] = useState<UploadDataProps>({
    file: null,
    file_name: "test.pdf",
    file_type: "application/pdf",
    is_avatar: "false",
    kb_type: type,
    category_uid: "",
    kb_uid: "",
    client: HTTP_CLIENT,
  });
  //
  const handleUpload = (file: File) => {
    const file_name =
      moment(new Date()).format("YYYYMMDDHHmmss") + "_" + file.name;
    //
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_name", file_name);
    formData.append("file_type", file.type);
    formData.append("is_avatar", "false");
    formData.append("kb_type", type);
    formData.append("category_uid", "");
    formData.append("kb_uid", "");
    formData.append("client", HTTP_CLIENT);
    //
    fetch(getUploadUrl(), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
      },
      body: formData,
    })
      .then((response) => {
        // console.log("upload response:", response);
        return response.json();
      })
      .then((result: UPLOAD.HttpResult) => {
        console.log("upload data:", result);
        if (result.code === 200) {
          // let url = info.file.response.data.fileUrl;
          // onSuccess(url);
          message.destroy();
          message.success(`${file_name} 上传成功`);
          // handleOk();
          setUploads([...uploads, result.data]);
        } else {
          // onError(info.file);
          message.destroy();
          message.error(`${file_name} 上传失败`);
          handleCancel();
        }
      });
  };

  const props: UploadProps = {
    name: "file",
    // accept: 'application/pdf, text/plain, text/html, text/markdown, application/json, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // multiple: true,
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
      // uploadData.kb_type = type;
      uploadData.category_uid = "";
      // uploadData.kb_uid = currentKbase?.uid;
      console.log("beforeUpload", uploadData);
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      console.log("onChange", info);
      if (info.file.status === "uploading") {
        // console.log('uploading:', info.file);
        message.loading(`${info.file.name} 上传中`);
      }
      if (info.file.status === "done") {
        console.log("response: ", info.file.response);
        if (info.file.response.code === 200) {
          // let url = info.file.response.data.fileUrl;
          // onSuccess(url);
          message.destroy();
          message.success(`${info.file.name} 上传成功`);
          // handleOk();
          setUploads([...uploads, info.file.response.data]);
        } else {
          // onError(info.file);
          message.destroy();
          message.error(`${info.file.name} 上传失败`);
          handleCancel();
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
        // onError(info.file);
        handleCancel();
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      // 这里可以添加处理拖拽上传的代码
      handleUpload(e.dataTransfer.files[0]);
    },
  };
  const [uploadProps] = useState(props);

  useEffect(() => {
    setUploadData({
      ...uploadData,
      kb_type: type,
      category_uid: "",
      // kb_uid: currentKbase?.uid,
    });
  }, [type]);
  //
  const handleOk = () => {
    console.log("handleOk", uploads);
    handleSubmit(uploads);
  };

  function handleDelete(uid: string) {
    console.log("handleDelete", uid);
    setUploads(uploads.filter((upload) => upload.uid !== uid));
  }

  return (
    <>
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
          {/* <p className="ant-upload-hint">{uploadHit}</p> */}
        </Dragger>
        {/* 上传的文件列表, 支持点击打开URL，删除，图片支持预览*/}
        <div>
          {uploads.map((upload) => (
            <div key={upload.uid}>
              
              {upload.fileType === "image" ? (
                <img src={upload.fileUrl} alt={upload.fileName} style={{ width: '50px', height: '50px' }} />
              ) : (
                <div>{upload.fileName}</div>
              )}
              <div>
                <Button icon={<DeleteOutlined />} onClick={() => handleDelete(upload.uid)} />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
export default UploadDrag;
