/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-03-18 17:48:53
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
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Upload, UploadProps, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export interface ToolbarItemProps {
  type: string;
  title: string;
  icon?: string;
  img?: string;
  render?: any; // FIXME
}

export interface ToolbarButtonProps {
  item: ToolbarItemProps;
  onClick: (item: ToolbarItemProps, event: React.MouseEvent) => void;
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const { item, onClick } = props;
  const { type, icon, img, title } = item;

  // TODO:
  const antprops: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    showUploadList: false,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="Toolbar-item" data-type={type}>
      {type === "upload" ? (
        <Upload {...antprops}>
          <Button className="Toolbar-btn" onClick={(e) => onClick(item, e)}>
            <span className="Toolbar-btnIcon">
              {icon && <Icon type={icon} />}
              {img && <img className="Toolbar-img" src={img} alt="" />}
            </span>
            <span className="Toolbar-btnText">{title}</span>
          </Button>
        </Upload>
      ) : (
        <Button className="Toolbar-btn" onClick={(e) => onClick(item, e)}>
          <span className="Toolbar-btnIcon">
            {icon && <Icon type={icon} />}
            {img && <img className="Toolbar-img" src={img} alt="" />}
          </span>
          <span className="Toolbar-btnText">{title}</span>
        </Button>
      )}
    </div>
  );
};
