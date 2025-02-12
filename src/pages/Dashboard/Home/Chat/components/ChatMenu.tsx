/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-13 21:39:32
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-13 21:43:20
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
// 

import { AppContext } from "@/context/AppContext";
import { MESSAGE_TYPE_TEXT, IS_ELECTRON, MESSAGE_TYPE_IMAGE, IS_DEBUG } from "@/utils/constants";
import { useContext } from "react";
import { useIntl } from "react-intl";
// https://fkhadra.github.io/react-contexify/
// https://github.com/fkhadra/react-contexify
import {
    Menu,
    Item,
    useContextMenu,
    ItemParams,
    Separator,
  } from "react-contexify";

interface ChatMenuProps {
  contextMessage: MESSAGE.MessageResponse;
  handleRightClick: (event: ItemParams) => void;
}

const ChatMenu = ({ contextMessage, handleRightClick }: ChatMenuProps) => {
  const intl = useIntl();
  const { isDarkMode, hasRoleAgent } = useContext(AppContext);
  // https://github.com/fkhadra/react-contexify
  const MENU_ID = "message_list_item";
  const { show } = useContextMenu({ id: MENU_ID });

  return (
    <>
        {/* https://github.com/fkhadra/react-contexify */}
        <Menu id={MENU_ID} theme={isDarkMode ? "dark" : "light"}>
              <Item id="copy" onClick={handleRightClick}>
                {intl.formatMessage({
                  id: "chat.menu.copy",
                  defaultMessage: "复制",
                })}
              </Item>
              {contextMessage?.type === MESSAGE_TYPE_TEXT && (
                <Item id="translate" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.translate",
                    defaultMessage: "翻译",
                  })}
                </Item>
              )}
              {contextMessage?.position === "right" && (
                <Item id="recall" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.recall",
                    defaultMessage: "撤回",
                  })}
                </Item>
              )}
              {IS_ELECTRON && contextMessage?.type === MESSAGE_TYPE_TEXT && (
                <Item id="enlarge" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.enlarge",
                    defaultMessage: "放大阅读",
                  })}
                </Item>
              )}
              {hasRoleAgent && (
                <Item id="addquickreply" onClick={handleRightClick}>
                  {intl.formatMessage({
                    id: "chat.menu.quickreply.add",
                    defaultMessage: "添加快捷回复...",
                  })}
                </Item>
              )}
              {contextMessage?.type === MESSAGE_TYPE_IMAGE && (
                <>
                  <Separator />
                  {/* <Item id="download" onClick={handleRightClick}>
                        下载图片
                      </Item> */}
                  <Item id="browser-open" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.browser.open",
                      defaultMessage: "浏览器打开",
                    })}
                  </Item>
                </>
              )}
              {IS_DEBUG && (
                <>
                  <Separator />
                  <Item id="forward" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.forward",
                      defaultMessage: "转发...",
                    })}
                  </Item>
                  <Item id="collect" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.collect",
                      defaultMessage: "收藏",
                    })}
                  </Item>
                  <Item id="quote" onClick={handleRightClick}>
                    {intl.formatMessage({
                      id: "chat.menu.quote",
                      defaultMessage: "引用",
                    })}
                  </Item>
                </>
              )}
              {/* <Separator /> */}
              {/* <Item id="delete" onClick={handleRightClick}>
                删除
              </Item> */}
              {/* <Submenu label="Foobar">
                <Item id="reload" onClick={handleRightClick}>Reload</Item>
              </Submenu> */}
            </Menu>
    </>
  );
};

export default ChatMenu;

