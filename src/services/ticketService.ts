/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-12 15:16:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-12 15:21:37
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { queryTicketsByOrgUid } from '@/apis/ticket/ticket';
import { useOrgStore } from '@/stores/core/organization';
import { useTicketStore } from '@/stores/ticket/ticket';

export const ticketService = {
  async loadTickets(orgUid: string, retryCount = 3) {
    const { setLoading, setError, setTickets } = useTicketStore.getState();
    const currentOrg = useOrgStore.getState().currentOrg;
    
    const tryLoad = async (attempt: number) => {
      try {
        setLoading(true);
        setError(null);
        // 
        const requestParams = { 
            pageNumber: 1,
            pageSize: 10,
            orgUid: currentOrg.uid
        };
        const response = await queryTicketsByOrgUid(requestParams);
        
        if (response.data.code === 200) {
          setTickets(response.data.data.content);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (attempt < retryCount) {
          // 延迟重试
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

  // 刷新工单列表
  async refreshTickets() {
    const currentOrg = useOrgStore.getState().currentOrg;
    return this.loadTickets(currentOrg.uid);
  },

  // 根据筛选条件加载
  async loadTicketsWithFilters(filters: Record<string, any>) {
    const currentOrg = useOrgStore.getState().currentOrg;
    return this.loadTickets(currentOrg.uid, filters);
  }
}; 