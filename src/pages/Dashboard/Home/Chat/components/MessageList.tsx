import { MessageProps } from "@/components/ChatUI";
import { useIntl } from "react-intl";
import { PhotoProvider } from "react-photo-view";
import { Menu, Item, Separator } from "react-contexify";
import { IS_DEBUG, IS_ELECTRON, MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT } from "@/utils/constants";
import "react-contexify/dist/ReactContexify.css";
import { ItemParams } from 'react-contexify';
import { MessageContainer } from "@/components/ChatUI/components/MessageContainer";

const MENU_ID = "chat-context-menu";

interface MessageListProps {
  messages: MessageProps[];
  renderMessageContent: (msg: MessageProps) => React.ReactNode;
  loadMoreText?: string;
  onRefresh?: () => Promise<void>;
  typing?: boolean;
  hasRoleAgent?: boolean;
  isDarkMode?: boolean;
  onRightClick: (params: ItemParams) => void;
  contextMessage?: MessageProps;
}

const MessageList = ({ 
  messages,
  renderMessageContent,
  loadMoreText,
  onRefresh,
  typing = false,
  hasRoleAgent = false,
  isDarkMode = false,
  onRightClick,
  contextMessage
}: MessageListProps) => {
  const intl = useIntl();

  return (
    <div className="message-list" style={{ flex: 1, overflow: 'auto' }}>
      <PhotoProvider>
        <MessageContainer
          messages={messages}
          loadMoreText={loadMoreText}
          onRefresh={onRefresh}
          isTyping={typing}
          renderMessageContent={renderMessageContent}
        />
      </PhotoProvider>

      {/* 右键菜单 */}
      <Menu id={MENU_ID} theme={isDarkMode ? "dark" : "light"}>
        <Item id="copy" onClick={onRightClick}>
          {intl.formatMessage({
            id: "chat.menu.copy",
            defaultMessage: "复制",
          })}
        </Item>
        {contextMessage?.type === MESSAGE_TYPE_TEXT && (
          <Item id="translate" onClick={onRightClick}>
            {intl.formatMessage({
              id: "chat.menu.translate",
              defaultMessage: "翻译",
            })}
          </Item>
        )}
        {contextMessage?.position === "right" && (
          <Item id="recall" onClick={onRightClick}>
            {intl.formatMessage({
              id: "chat.menu.recall",
              defaultMessage: "撤回",
            })}
          </Item>
        )}
        {IS_ELECTRON && contextMessage?.type === MESSAGE_TYPE_TEXT && (
          <Item id="enlarge" onClick={onRightClick}>
            {intl.formatMessage({
              id: "chat.menu.enlarge",
              defaultMessage: "放大阅读",
            })}
          </Item>
        )}
        {hasRoleAgent && (
          <Item id="addquickreply" onClick={onRightClick}>
            {intl.formatMessage({
              id: "chat.menu.quickreply.add",
              defaultMessage: "添加快捷回复...",
            })}
          </Item>
        )}
        {contextMessage?.type === MESSAGE_TYPE_IMAGE && (
          <>
            <Separator />
            <Item id="browser-open" onClick={onRightClick}>
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
            <Item id="forward" onClick={onRightClick}>
              {intl.formatMessage({
                id: "chat.menu.forward",
                defaultMessage: "转发...",
              })}
            </Item>
            <Item id="collect" onClick={onRightClick}>
              {intl.formatMessage({
                id: "chat.menu.collect",
                defaultMessage: "收藏",
              })}
            </Item>
            <Item id="quote" onClick={onRightClick}>
              {intl.formatMessage({
                id: "chat.menu.quote",
                defaultMessage: "引用",
              })}
            </Item>
          </>
        )}
      </Menu>
    </div>
  );
};

export default MessageList; 
