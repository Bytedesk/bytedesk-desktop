/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-18 17:33:27
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import React, { useEffect, useState } from "react";
import { Card } from "../Card";
import { Flex, FlexItem } from "../Flex";
import { Icon } from "../Icon";
import { Text } from "../Text";

export interface FileCardProps {
  fileUrl?: string;
  children?: React.ReactNode;
}

export const FileCard = React.forwardRef<HTMLDivElement, FileCardProps>(
  (props, ref) => {
    const { fileUrl = '', children } = props;
    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
      if (!fileUrl) {
        setFileName("文件不存在或已被删除");
        return;
      }

      try {
        const urlPath = fileUrl.split("/");
        const name = urlPath[urlPath.length - 1];
        setFileName(name || "未知文件名");
      } catch (e) {
        console.error('Failed to parse file name from URL:', e);
        setFileName("文件名解析错误");
      }
    }, [fileUrl]);

    return (
      <Card className={"FileCard"} size="xl" ref={ref}>
        <Flex>
          <div className="FileCard-icon">
            <Icon type={fileUrl ? "file" : "file-error"} />
          </div>
          <FlexItem>
            <Text 
              truncate={2} 
              breakWord 
              className={`FileCard-name ${!fileUrl ? 'FileCard-name--error' : ''}`}
            >
              {fileName}
            </Text>
            <div className="FileCard-meta">
              {children}
            </div>
          </FlexItem>
        </Flex>
      </Card>
    );
  },
);

FileCard.displayName = 'FileCard';
