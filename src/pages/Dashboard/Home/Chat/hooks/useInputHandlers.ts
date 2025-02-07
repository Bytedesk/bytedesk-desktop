import { useState, useRef } from 'react';
import { useDebounce } from 'ahooks';

export const useInputHandlers = () => {
  const [inputText, setInputText] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [debouncedPreviewText] = useDebounce(previewText, 1000);
  const [showEmoji, setShowEmoji] = useState(false);
  const composerRef = useRef(null);

  const handleInputChange = (text: string) => {
    setInputText(text);
    setPreviewText(text);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmoji(false);
  };

  return {
    inputText,
    setInputText,
    previewText,
    debouncedPreviewText,
    showEmoji,
    setShowEmoji,
    composerRef,
    handleInputChange,
    handleEmojiSelect,
  };
}; 