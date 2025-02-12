/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-01-23 17:42:15
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-13 14:33:56
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { create } from 'zustand';
import { useOrgStore } from '@/stores/core/organization';
import { TICKET_FILTER_ASSIGNMENT_ALL } from '@/utils/constants';

interface TicketState {
  // 工单列表
  tickets: TICKET.TicketResponse[];
  // 历史工单列表
  historyTickets: TICKET.TicketResponse[];
  // 当前选中的工单
  currentTicket?: TICKET.TicketResponse;
  currentThreadTicket?: TICKET.TicketResponse;
  // 加载状态
  loading: boolean;
  error: string | null;
  // 搜索关键词
  searchText: string;
  // 分页信息
  pagination: {
    pageNumber: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status?: string;
    priority?: string;
    assignment?: string;
    time?: string;
  };

  // Actions
  setCurrentTicket: (ticket?: TICKET.TicketResponse) => void;
  setCurrentThreadTicket: (ticket?: TICKET.TicketResponse) => void;
  setSearchText: (text: string) => void;
  refreshTickets: () => Promise<void>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTickets: (tickets: TICKET.TicketResponse[]) => void;
}

export const useTicketStore = create<TicketState>((set) => {
  return {
    // State
    tickets: [],
    historyTickets: [],
    currentTicket: undefined,
    currentThreadTicket: undefined,
    loading: false,
    error: null,
    searchText: '',
    pagination: {
      pageNumber: 0,
      pageSize: 100,
      total: 0,
    },
    filters: {
      assignment: TICKET_FILTER_ASSIGNMENT_ALL
    },

    // Actions
    setCurrentTicket: (ticket) => set({ currentTicket: ticket }),

    setCurrentThreadTicket: (ticket) => set({ currentThreadTicket: ticket }),
    
    setSearchText: (text) => {
      set({ searchText: text });
    },

    refreshTickets: async () => {
      const { currentOrg } = useOrgStore.getState();
      if (currentOrg?.uid) {
        const { ticketService } = await import('@/services/ticketService');
        await ticketService.loadTickets(currentOrg.uid);
      }
    },

    setFilter: (key, value) => set((state) => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    })),

    clearFilters: () => set({ filters: {} }),

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),

    setTickets: (tickets: TICKET.TicketResponse[]) => set({ tickets }),

    setHistoryTickets: (tickets: TICKET.TicketResponse[]) => set({ historyTickets: tickets }),
  };
}); 