import { create } from 'zustand';

interface RightPanelStore {
  activeKey: string;
  defaultKey: string;
  setActiveKey: (key: string) => void;
  setDefaultKey: (key: string) => void;
  resetActiveKey: () => void;
}

export const useRightPanelStore = create<RightPanelStore>((set) => ({
  activeKey: 'quickreply',
  defaultKey: 'quickreply',
  setActiveKey: (key: string) => set({ activeKey: key }),
  setDefaultKey: (key: string) => set({ defaultKey: key }),
  resetActiveKey: () => set({ activeKey: 'quickreply' }),
})); 