/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 11:57:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-25 18:14:21
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { IS_DEBUG } from "@/utils/constants";
import { Button, Space } from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// 右键点击消息内容，选择放大阅读功能
const Enlarge = () => {
  const location = useLocation();
  const { content } = location.state || {};
  const [fontSize, setFontSize] = useState(30); // 初始字体大小设置为30px

  // 放大字体函数
  const increaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize + 2); // 每次点击增加2px
  };

  // 缩小字体函数
  const decreaseFontSize = () => {
    if (fontSize > 30) {
      // 避免字体过小，设置最小字体为30px
      setFontSize((prevFontSize) => prevFontSize - 2); // 每次点击减少2px
    }
  };

  // 复制文本到剪贴板的函数
  const handleCopy = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        message.success("复制成功");
      })
      .catch((err) => {
        console.error("无法复制文本: ", err);
        message.error(err);
      });
  };

  // 转发功能的占位函数（需要根据你的应用逻辑来实现具体功能）
  const handleShare = () => {
    message.warning("TODO: 即将上线，敬请期待");
    // 这里可以使用navigator来进行页面跳转或触发分享API等
  };

  // 收藏功能的占位函数（需要根据你的应用逻辑来实现具体功能）
  const handleCollect = () => {
    message.warning("TODO: 即将上线，敬请期待");
    // 这里可以实现添加到收藏夹的逻辑，可能需要后端支持或本地存储等
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <Space>
          <Button
            shape="circle"
            onClick={increaseFontSize}
            style={{ marginRight: "0.5rem" }}
          >
            +
          </Button>
          <Button shape="circle" onClick={decreaseFontSize}>
            -
          </Button>
          <Button onClick={handleCopy}>复制</Button>
          {IS_DEBUG && <Button onClick={handleShare}>转发</Button>}
          {IS_DEBUG && <Button onClick={handleCollect}>收藏</Button>}
        </Space>
      </div>
      <div
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default Enlarge;
