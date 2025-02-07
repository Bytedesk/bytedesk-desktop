import React, { ReactNode } from 'react';
import type { FC } from 'react';
import GroupInfoDrawer from "../../RightPanel/GroupInfo";
import MemberInfoDrawer from "../../RightPanel/MemberInfo";
import RobotInfoDrawer from "../../RightPanel/RobotInfo";
import EmojiPicker from "@/components/EmojiPicker";

interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const useDrawers = (
  isGroupInfoDrawerOpen: boolean,
  isMemberInfoDrawerOpen: boolean,
  isRobotInfoDrawerOpen: boolean,
  showEmoji: boolean,
  setIsGroupInfoDrawerOpen: (open: boolean) => void,
  setIsMemberInfoDrawerOpen: (open: boolean) => void,
  setIsRobotInfoDrawerOpen: (open: boolean) => void,
  setShowEmoji: (show: boolean) => void,
  handleEmojiSelect: (emoji: string) => void
): ReactNode[] => {
  const drawers: ReactNode[] = [];

  if (isGroupInfoDrawerOpen) {
    drawers.push(
      React.createElement(GroupInfoDrawer as FC<DrawerProps>, {
        key: "group-info",
        open: isGroupInfoDrawerOpen,
        onClose: () => setIsGroupInfoDrawerOpen(false)
      })
    );
  }

  if (isMemberInfoDrawerOpen) {
    drawers.push(
      React.createElement(MemberInfoDrawer as FC<DrawerProps>, {
        key: "member-info",
        open: isMemberInfoDrawerOpen,
        onClose: () => setIsMemberInfoDrawerOpen(false)
      })
    );
  }

  if (isRobotInfoDrawerOpen) {
    drawers.push(
      React.createElement(RobotInfoDrawer as FC<DrawerProps>, {
        key: "robot-info",
        open: isRobotInfoDrawerOpen,
        onClose: () => setIsRobotInfoDrawerOpen(false)
      })
    );
  }

  if (showEmoji) {
    drawers.push(
      React.createElement(EmojiPicker as FC<EmojiPickerProps>, {
        key: "emoji-picker",
        onSelect: handleEmojiSelect,
        onClose: () => setShowEmoji(false)
      })
    );
  }

  return drawers;
}; 