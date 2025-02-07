/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';

export const useFileInputs = (handleImageChange: any, handleFileChange: any) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileInputProps = {
    imageInput: {
      type: "file",
      accept: "image/*",
      style: { display: "none" },
      ref: imageInputRef,
      onChange: handleImageChange
    },
    fileInput: {
      type: "file", 
      style: { display: "none" },
      ref: fileInputRef,
      onChange: handleFileChange
    }
  };

  return fileInputProps;
}; 