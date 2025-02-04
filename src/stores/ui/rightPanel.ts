import { create } from 'zustand';

interface RightPanelState {
  activeKey: string;
  setActiveKey: (key: string) => void;
  defaultKey: string;
  setDefaultKey: (key: string) => void;
}

export const useRightPanelStore = create<RightPanelState>((set) => ({
  activeKey: 'quickreply',
  setActiveKey: (key: string) => set({ activeKey: key }),
  defaultKey: 'quickreply',
  setDefaultKey: (key: string) => set({ defaultKey: key }),
})); 