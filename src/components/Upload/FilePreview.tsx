import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface FilePreviewProps {
  file: UPLOAD.UploadResponse;
  onDelete: (uid: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onDelete }) => {
  return (
    <div 
      key={file.uid} 
      style={{ 
        position: "relative",
        width: "50px",
        height: "50px",
        border: "1px solid #f0f0f0",
        borderRadius: "4px",
        overflow: "hidden"
      }}
    >
      {/* 删除按钮 */}
      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => onDelete(file.uid)}
        style={{ 
          position: "absolute",
          top: 0,
          right: 0,
          padding: "2px",
          background: "rgba(255, 255, 255, 0.8)",
          border: "none",
          borderRadius: "0 4px 0 4px",
          zIndex: 1
        }}
      />

      {/* 文件预览 */}
      <div
        onClick={() => window.open(file.fileUrl, "_blank")}
        style={{ 
          width: "100%",
          height: "100%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
      >
        {file.fileType.startsWith("image/") ? (
          <img
            src={file.fileUrl}
            alt={file.fileName}
            style={{ 
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <div style={{ 
            fontSize: "12px",
            padding: "4px",
            textAlign: "center",
            wordBreak: "break-all",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {file.fileName}
          </div>
        )}
      </div>

      {/* 文件名提示 */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        fontSize: "10px",
        padding: "2px",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        {file.fileName}
      </div>
    </div>
  );
};

export default FilePreview; 