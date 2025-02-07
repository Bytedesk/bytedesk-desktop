import { useState } from 'react';

export const useDrawerStates = () => {
  const [isGroupInfoDrawerOpen, setIsGroupInfoDrawerOpen] = useState(false);
  const [isMemberInfoDrawerOpen, setIsMemberInfoDrawerOpen] = useState(false);
  const [isRobotInfoDrawerOpen, setIsRobotInfoDrawerOpen] = useState(false);

  return {
    isGroupInfoDrawerOpen,
    setIsGroupInfoDrawerOpen,
    isMemberInfoDrawerOpen,
    setIsMemberInfoDrawerOpen,
    isRobotInfoDrawerOpen,
    setIsRobotInfoDrawerOpen,
  };
}; 