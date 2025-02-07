import { Button } from "antd";
import { SmileOutlined, FileImageOutlined, FileOutlined, CameraOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";

interface ChatToolbarProps {
  onEmojiClick: () => void;
  onImageClick: () => void;
  onFileClick: () => void;
  onScreenshotClick: () => void;
}

const ChatToolbar = ({
  onEmojiClick,
  onImageClick,
  onFileClick,
  onScreenshotClick,
}: ChatToolbarProps) => {
  const intl = useIntl();

  return (
    <div className="chat-toolbar" style={{ padding: "8px 16px", borderTop: "1px solid #f0f0f0" }}>
      <Button 
        type="text" 
        icon={<SmileOutlined />}
        onClick={onEmojiClick}
        title={intl.formatMessage({ id: "chat.toolbar.emoji" })}
      />
      <Button
        type="text"
        icon={<FileImageOutlined />}
        onClick={onImageClick}
        title={intl.formatMessage({ id: "chat.toolbar.image" })}
      />
      <Button
        type="text"
        icon={<FileOutlined />}
        onClick={onFileClick}
        title={intl.formatMessage({ id: "chat.toolbar.file" })}
      />
      <Button
        type="text"
        icon={<CameraOutlined />}
        onClick={onScreenshotClick}
        title={intl.formatMessage({ id: "chat.toolbar.screenshot" })}
      />
    </div>
  );
};

export default ChatToolbar; 