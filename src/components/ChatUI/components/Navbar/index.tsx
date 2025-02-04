/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-10-01 08:23:38
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
import clsx from "clsx";
import { IconButton, IconButtonProps } from "../IconButton";

export interface NavbarProps {
  title: string;
  className?: string;
  logo?: string;
  leftContent?: IconButtonProps;
  rightContent?: IconButtonProps[];
  desc?: React.ReactNode;
  align?: "left" | "center";
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (props, ref) => {
    const {
      className,
      title,
      logo,
      desc,
      leftContent,
      rightContent = [],
      align,
    } = props;

    const isLeft = align === "left";
    const showTitle = isLeft ? true : !logo;

    return (
      <header
        className={clsx("Navbar", { "Navbar--left": isLeft }, className)}
        ref={ref}
      >
        <div className="Navbar-left">
          {leftContent && <IconButton size="lg" {...leftContent} />}
        </div>
        <div className="Navbar-main">
          {logo && <img className="Navbar-logo" src={logo} alt={title} />}
          <div className="Navbar-inner">
            {showTitle && <h2 className="Navbar-title">{title}</h2>}
            <div className="Navbar-desc">{desc}</div>
          </div>
        </div>
        <div className="Navbar-right">
          {rightContent.map((item) => (
            <IconButton size="lg" key={item.icon} {...item} />
          ))}
        </div>
      </header>
    );
  },
);
