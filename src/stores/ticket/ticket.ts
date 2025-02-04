/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-01-23 17:42:15
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-25 10:41:21
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
import { message } from '@/AntdGlobalComp';
import { queryTicketsByOrgUid } from '@/apis/ticket/ticket';
import moment from 'moment';
import { useAgentStore } from '@/stores/service/agent';
import { useWorkgroupStore } from '@/stores/service/workgroup';
import { useOrgStore } from '@/stores/core/organization';

interface TicketState {
  // 工单列表
  tickets: TICKET.TicketResponse[];
  // 当前选中的工单
  currentTicket?: TICKET.TicketResponse;
  // 加载状态
  loading: boolean;
  // 过滤条件
  filterKey?: string;
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
  setFilterKey: (key?: string) => void;
  setSearchText: (text: string) => void;
  loadTickets: (orgUid: string) => Promise<void>;
  refreshTickets: () => Promise<void>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useTicketStore = create<TicketState>((set, get) => {
  // 获取当前用户、工作组和组织
  const agentInfo = useAgentStore.getState().agentInfo;
  const workgroupInfo = useWorkgroupStore.getState().workgroupInfo;
  const currentOrg = useOrgStore.getState().currentOrg;

  return {
    // State
    tickets: [],
    currentTicket: undefined,
    loading: false,
    filterKey: undefined,
    searchText: '',
    pagination: {
      pageNumber: 0,
      pageSize: 100,
      total: 0,
    },
    filters: {},

    // Actions
    setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
    
    setFilterKey: (key) => {
      set({ filterKey: key });
      const state = get();
      if (state.currentTicket) {
        state.setCurrentTicket(undefined);
      }
      if (currentOrg?.uid) {
        get().loadTickets(currentOrg.uid);
      }
    },

    setSearchText: (text) => {
      set({ searchText: text });
      get().refreshTickets();
    },

    loadTickets: async (orgUid: string) => {
      const state = get();
      set({ loading: true });

      try {
        const params: TICKET.HttpRequest = {
          orgUid,
          pageNumber: state.pagination.pageNumber,
          pageSize: state.pagination.pageSize,
        };

        // 根据过滤条件添加查询参数
        if (state.filterKey) {
          switch (state.filterKey) {
            // 状态过滤
            case 'new':
            case 'assigned': 
            case 'in_progress':
            case 'pending':
            case 'on_hold':
            case 'resolved':
            case 'closed':
              params.status = state.filterKey.toUpperCase();
              break;

            // 优先级过滤
            case 'critical':
            case 'urgent':
            case 'high': 
            case 'medium':
            case 'low':
            case 'lowest':
              params.priority = state.filterKey.toUpperCase();
              break;

            // 分配状态过滤  
            case 'my_tickets':
              params.assigneeUid = agentInfo?.uid;
              break;
            case 'unassigned':
              // params.assigned = false;
              break;
            case 'my_team':
              params.workgroupUid = workgroupInfo?.uid;
              break;

            // 时间过滤
            case 'today':
              // params.startTime = moment().startOf('day').valueOf();
              // params.endTime = moment().endOf('day').valueOf();
              break;
            case 'yesterday':
              params.startTime = moment().subtract(1, 'days').startOf('day').format();
              params.endTime = moment().subtract(1, 'days').endOf('day').format();
              break;
            case 'this_week':
              params.startTime = moment().startOf('week').format();
              params.endTime = moment().endOf('week').format();
              break;
            case 'last_week':
              params.startTime = moment().subtract(1, 'week').startOf('week').format();
              params.endTime = moment().subtract(1, 'week').endOf('week').format();
              break;
            case 'this_month':
              params.startTime = moment().startOf('month').format();
              params.endTime = moment().endOf('month').format();
              break;
            case 'last_month':
              params.startTime = moment().subtract(1, 'month').startOf('month').format();
              params.endTime = moment().subtract(1, 'month').endOf('month').format();
              break;
          }
        }

        // 添加搜索条件
        if (state.searchText) {
          // params.keyword = state.searchText;
        }

        console.log('Load tickets params:', params);
        const response = await queryTicketsByOrgUid(params);
        if (response.data?.code === 200) {
          set({ 
            tickets: response.data.data.content || [],
            pagination: {
              ...state.pagination,
              total: response.data.data.totalElements || 0
            }
          });
        }
      } catch (error) {
        console.error('Load tickets error:', error);
        message.error('ticket.load.error');
      } finally {
        set({ loading: false });
      }
    },

    refreshTickets: async () => {
      if (currentOrg?.uid) {
        get().loadTickets(currentOrg.uid);
      }
    },

    setFilter: (key, value) => set((state) => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    })),

    clearFilters: () => set({ filters: {} }),
  };
}); 