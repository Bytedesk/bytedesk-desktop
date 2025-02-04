/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-01-23 17:42:15
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-05 16:26:12
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
// import { useWorkgroupStore } from '@/stores/service/workgroup';
import { useOrgStore } from '@/stores/core/organization';
import { 
  TICKET_FILTER_LAST_MONTH, 
  TICKET_FILTER_LAST_WEEK, 
  // TICKET_FILTER_MY_WORKGROUP, 
  // TICKET_FILTER_MY_TICKETS, 
  TICKET_FILTER_PRIORITY_ALL, 
  TICKET_FILTER_STATUS_ALL, 
  TICKET_FILTER_THIS_MONTH, 
  TICKET_FILTER_THIS_WEEK, 
  TICKET_FILTER_TODAY,
  // TICKET_FILTER_UNASSIGNED, 
  TICKET_FILTER_YESTERDAY, 
  TICKET_FILTER_TIME_ALL,
  TICKET_FILTER_MY_ASSIGNED,
  TICKET_FILTER_MY_CREATED,
  TICKET_FILTER_ASSIGNMENT_ALL
} from '@/utils/constants';
import { useUserStore } from '../core/user';

interface TicketState {
  // 工单列表
  tickets: TICKET.TicketResponse[];
  // 当前选中的工单
  currentTicket?: TICKET.TicketResponse;
  // 加载状态
  loading: boolean;
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
  setSearchText: (text: string) => void;
  loadTickets: (orgUid: string) => Promise<void>;
  refreshTickets: () => Promise<void>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useTicketStore = create<TicketState>((set, get) => {
  // 获取当前用户、工作组和组织
  const agentInfo = useAgentStore.getState().agentInfo;
  const userInfo = useUserStore.getState().userInfo;
  // const workgroupInfo = useWorkgroupStore.getState().workgroupInfo;
  const currentOrg = useOrgStore.getState().currentOrg;

  return {
    // State
    tickets: [],
    currentTicket: undefined,
    loading: false,
    searchText: '',
    pagination: {
      pageNumber: 0,
      pageSize: 100,
      total: 0,
    },
    filters: {},

    // Actions
    setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
    
    setSearchText: (text) => {
      set({ searchText: text });
      get().refreshTickets();
    },

    loadTickets: async (orgUid: string) => {
      const state = get();
      set({ loading: true });

      try {
        const params: TICKET.TicketRequest = {
          orgUid,
          pageNumber: state.pagination.pageNumber,
          pageSize: state.pagination.pageSize,
        };

        // 根据状态过滤
        if (state.filters.status && state.filters.status !== TICKET_FILTER_STATUS_ALL) {
          params.status = state.filters.status;
        }

        // 优先级过滤
        if (state.filters.priority && state.filters.priority !== TICKET_FILTER_PRIORITY_ALL) {
          params.priority = state.filters.priority;
        }

        // 分配状态过滤  
        if (state.filters.assignment === TICKET_FILTER_ASSIGNMENT_ALL) {
          params.assignmentAll = true;
          params.reporterUid = userInfo?.uid;
          params.assigneeUid = agentInfo?.uid;
        } else if (state.filters.assignment === TICKET_FILTER_MY_CREATED) {
          params.assignmentAll = false;
          params.reporterUid = userInfo?.uid;
        } else if (state.filters.assignment === TICKET_FILTER_MY_ASSIGNED) {
          params.assignmentAll
          params.assigneeUid = agentInfo?.uid;
        }

        // 时间过滤
        if (state.filters.time === TICKET_FILTER_TIME_ALL) {
          params.startDate = moment().subtract(100, 'years').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else if (state.filters.time === TICKET_FILTER_TODAY) {
          params.startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else if (state.filters.time === TICKET_FILTER_YESTERDAY) {
          params.startDate = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else if (state.filters.time === TICKET_FILTER_THIS_WEEK) {
          params.startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
        } else if (state.filters.time === TICKET_FILTER_LAST_WEEK) {
          params.startDate = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD HH:mm:ss');
        } else if (state.filters.time === TICKET_FILTER_THIS_MONTH) {
          params.startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
        } else if (state.filters.time === TICKET_FILTER_LAST_MONTH) {
          params.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss');
          params.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');
        }

        // 添加搜索条件
        if (state.searchText) {
          params.searchText = state.searchText;
        }

        console.log('Load tickets params:', params);
        const response = await queryTicketsByOrgUid(params);
        if (response.data?.code === 200) {
          console.log('Load tickets response:', response.data);
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