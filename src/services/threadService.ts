/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-12 16:30:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-12 16:48:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 */
import { queryThreads } from '@/apis/core/thread';
import { useThreadStore } from '@/stores/core/thread';
import { useOrgStore } from '@/stores/core/organization';
// import { useAgentStore } from '@/stores/service/agent';
// import { useUserStore } from '@/stores/core/user';

export const threadService = {
  async loadThreads(orgUid: string, retryCount = 3) {
    const { setLoading, setError, setThreads, searchText, pagination } = useThreadStore.getState();
    // const { agentInfo } = useAgentStore.getState();
    // const { userInfo } = useUserStore.getState();
    const currentOrg = useOrgStore.getState().currentOrg;
    
    const tryLoad = async (attempt: number) => {
      try {
        setLoading(true);
        setError(null);

        const params: THREAD.ThreadRequest = {
          orgUid: currentOrg.uid,
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
        };
        // 添加搜索条件
        if (searchText) {
          params.searchText = searchText;
        }

        const response = await queryThreads(params);
        console.log('queryThreads response', response);
        
        if (response.data.code === 200) {
          setThreads(response.data.data.content);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return tryLoad(attempt + 1);
        }
        setError(error instanceof Error ? error.message : 'Failed to load threads');
      } finally {
        setLoading(false);
      }
    };

    return tryLoad(1);
  },

  // 刷新会话列表
  async refreshThreads() {
    const currentOrg = useOrgStore.getState().currentOrg;
    return this.loadThreads(currentOrg.uid);
  },

  // 根据筛选条件加载
  async loadThreadsWithFilters(filters: Record<string, any>) {
    const currentOrg = useOrgStore.getState().currentOrg;
    const { setFilter } = useThreadStore.getState();
    
    // 更新筛选条件
    Object.entries(filters).forEach(([key, value]) => {
      setFilter(key, value);
    });
    
    return this.loadThreads(currentOrg.uid);
  }
}; 