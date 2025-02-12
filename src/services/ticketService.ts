/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-12 15:16:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-13 14:42:28
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { queryTicketByServiceThreadTopic, queryTicketsByOrgUid } from '@/apis/ticket/ticket';
import { useOrgStore } from '@/stores/core/organization';
import { useTicketStore } from '@/stores/ticket/ticket';
import { useAgentStore } from '@/stores/service/agent';
import { useUserStore } from '@/stores/core/user';
import moment from 'moment';
import {
  TICKET_FILTER_LAST_MONTH,
  TICKET_FILTER_LAST_WEEK,
  TICKET_FILTER_PRIORITY_ALL,
  TICKET_FILTER_STATUS_ALL,
  TICKET_FILTER_THIS_MONTH,
  TICKET_FILTER_THIS_WEEK,
  TICKET_FILTER_TODAY,
  TICKET_FILTER_YESTERDAY,
  TICKET_FILTER_TIME_ALL,
  TICKET_FILTER_MY_ASSIGNED,
  TICKET_FILTER_MY_CREATED,
  TICKET_FILTER_UNASSIGNED
} from '@/utils/constants';

export const ticketService = {
  async loadTickets(orgUid: string, retryCount = 3) {
    const { setLoading, setError, setTickets, filters, searchText, pagination } = useTicketStore.getState();
    const { agentInfo } = useAgentStore.getState();
    const { userInfo } = useUserStore.getState();
    
    const tryLoad = async (attempt: number) => {
      try {
        setLoading(true);
        setError(null);

        const params: TICKET.TicketRequest = {
          orgUid,
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          assignmentAll: false,
        };

        // 根据状态过滤
        if (filters.status && filters.status !== TICKET_FILTER_STATUS_ALL) {
          params.status = filters.status;
        }

        // 优先级过滤
        if (filters.priority && filters.priority !== TICKET_FILTER_PRIORITY_ALL) {
          params.priority = filters.priority;
        }

        // 分配状态过滤
        if (filters.assignment === TICKET_FILTER_MY_CREATED) {
          params.assignmentAll = false;
          params.reporterUid = userInfo?.uid || '';
          params.assigneeUid = '';
        } else if (filters.assignment === TICKET_FILTER_MY_ASSIGNED) {
          params.assignmentAll = false;
          params.assigneeUid = agentInfo?.uid || '';
          params.reporterUid = '';
        } else if (filters.assignment === TICKET_FILTER_UNASSIGNED) {
          params.assignmentAll = false;
          params.assigneeUid = TICKET_FILTER_UNASSIGNED;
          params.reporterUid = '';
        }

        // 时间过滤
        if (filters.time) {
          switch (filters.time) {
            case TICKET_FILTER_TIME_ALL:
              params.startDate = moment().subtract(100, 'years').startOf('day').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
              break;
            case TICKET_FILTER_TODAY:
              params.startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
              break;
            case TICKET_FILTER_YESTERDAY:
              params.startDate = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');
              break;
            case TICKET_FILTER_THIS_WEEK:
              params.startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
              break;
            case TICKET_FILTER_LAST_WEEK:
              params.startDate = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD HH:mm:ss');
              break;
            case TICKET_FILTER_THIS_MONTH:
              params.startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
              break;
            case TICKET_FILTER_LAST_MONTH:
              params.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss');
              params.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');
              break;
          }
        }

        // 添加搜索条件
        if (searchText) {
          params.searchText = searchText;
        }

        const response = await queryTicketsByOrgUid(params);
        console.log('queryTicketsByOrgUid response', response);
        if (response.data.code === 200) {
          setTickets(response.data.data.content);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return tryLoad(attempt + 1);
        }
        setError(error instanceof Error ? error.message : 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    return tryLoad(1);
  },

  // 根据serviceThreadTopic加载历史工单
  async loadHistoryTickets(serviceThreadTopic: string, retryCount = 3) {
    const { setLoading, setError, setHistoryTickets, pagination } = useTicketStore.getState();
    const currentOrg = useOrgStore.getState().currentOrg;
    
    const tryLoad = async (attempt: number) => {
      try {
        setLoading(true); 
        setError(null);

        const params: TICKET.TicketRequest = {
          orgUid: currentOrg.uid,
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          serviceThreadTopic,
        };

        const response = await queryTicketByServiceThreadTopic(params);
        console.log('queryTicketByServiceThreadTopic response', response);
        if (response.data.code === 200) {
          setHistoryTickets(response.data.data.content);
        } else {
          throw new Error(response.data.message);
        }

      } catch (error) {
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return tryLoad(attempt + 1);
        }
        setError(error instanceof Error ? error.message : 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    }

    return tryLoad(1);
  },

  // 刷新工单列表
  async refreshTickets() {
    const currentOrg = useOrgStore.getState().currentOrg;
    return this.loadTickets(currentOrg.uid);
  },

  // 根据筛选条件加载
  async loadTicketsWithFilters(filters: Record<string, any>) {
    const currentOrg = useOrgStore.getState().currentOrg;
    const { setFilter } = useTicketStore.getState();
    
    // 更新筛选条件
    Object.entries(filters).forEach(([key, value]) => {
      setFilter(key, value);
    });
    
    return this.loadTickets(currentOrg.uid);
  }
}; 