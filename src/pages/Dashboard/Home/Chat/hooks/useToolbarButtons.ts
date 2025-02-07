/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { QuickReplyItemProps } from '@/components/ChatUI';
import { useIntl } from 'react-intl';
import { IS_DEBUG } from '@/utils/constants';
import { isCustomerServiceThread, isRobotThread } from '@/utils/utils';

export const useToolbarButtons = (currentThread: any, locale: string) => {
  const intl = useIntl();
  const [toolbarQuickButtons, setToolbarQuickButtons] = useState<QuickReplyItemProps[]>([]);

  useEffect(() => {
    let defaultQuickButtons: QuickReplyItemProps[] = [
      {
        name: intl.formatMessage({
          id: "chat.toolbar.emoji",
          defaultMessage: "表情",
        }),
        type: "emoji",
        code: "emoji",
        icon: "smile",
        isHighlight: false,
      },
      {
        name: intl.formatMessage({
          id: "chat.toolbar.image",
          defaultMessage: "图片",
        }),
        type: "image",
        code: "image",
        icon: "image",
        isHighlight: false,
      },
      {
        name: intl.formatMessage({
          id: "chat.toolbar.file",
          defaultMessage: "文件",
        }),
        type: "file",
        code: "file",
        icon: "file",
        isHighlight: false,
      },
      {
        name: intl.formatMessage({
          id: "chat.toolbar.screenshot",
          defaultMessage: "截图",
        }),
        type: "screenshot",
        code: "screenshot",
        icon: "camera",
        isHighlight: false,
      },
      {
        name: intl.formatMessage({
          id: "chat.toolbar.autoreply",
          defaultMessage: "自动回复",
        }),
        type: "autoreply",
        code: "autoreply",
        icon: "apps",
      },
    ];

    let moreToolbarQuickButtons = [];
    if (IS_DEBUG) {
      // Add debug buttons
      moreToolbarQuickButtons.push({
        name: intl.formatMessage({
          id: "chat.toolbar.audio",
          defaultMessage: "录音",
        }),
        type: "audio",
        code: "audio",
        icon: "mic",
        isHighlight: false,
      });
      moreToolbarQuickButtons.push({
        name: intl.formatMessage({
          id: "chat.toolbar.webrtc",
          defaultMessage: "视频会话",
        }),
        type: "webrtc",
        code: "webrtc",
        icon: "play-circle",
        isHighlight: false,
      });
    }

    if (isCustomerServiceThread(currentThread)) {
      // Add customer service buttons
      moreToolbarQuickButtons.push({
        name: intl.formatMessage({
          id: "chat.toolbar.invite.rate",
          defaultMessage: "邀请评价",
        }),
        type: "rate_invite",
        code: "rate_invite",
        icon: "thumbs-up",
        isHighlight: false,
      });
      moreToolbarQuickButtons.push({
        name: intl.formatMessage({
          id: "chat.toolbar.block",
          defaultMessage: "拉黑",
        }),
        type: "block",
        code: "block",
        icon: "thumbs-down",
      });
    }

    if (isRobotThread(currentThread)) {
      defaultQuickButtons = [];
      moreToolbarQuickButtons = [];
    }

    setToolbarQuickButtons([...defaultQuickButtons, ...moreToolbarQuickButtons]);
  }, [currentThread, locale]);

  return {
    toolbarQuickButtons,
    setToolbarQuickButtons
  };
}; 