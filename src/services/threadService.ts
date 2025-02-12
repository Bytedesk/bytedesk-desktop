/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-12 16:30:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-12 17:20:15
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 */
import { queryThreads } from '@/apis/core/thread';
import { useThreadStore } from '@/stores/core/thread';
import { useOrgStore } from '@/stores/core/organization';
// import { useAgentStore } from '@/stores/service/agent';
// import { useUserStore } from '@/stores/core/user';

export const threadService = {
  async loadThreads(orgUid: string, retryCount = 3) {
    const { setLoading, setError, setThreads, searchText, pagination, setPagination } = useThreadStore.getState();
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
        console.log('queryThreads response', response.data);
        
        if (response.data.code === 200) {
          // 更新分页信息
          setPagination({
            ...pagination,
            total: response.data.data.totalElements,
            // 如果不是最后一页，页码+1
            pageNumber: response.data.data.last ? pagination.pageNumber : pagination.pageNumber + 1
          });

          // 如果是第一页，直接设置数据
          if (pagination.pageNumber === 0) {
            setThreads(response.data.data.content);
          } else {
            // 如果是加载更多，追加数据
            const { threads: existingThreads } = useThreadStore.getState();
            setThreads([...existingThreads, ...response.data.data.content]);
          }

          // 更新 threadResult
          const { setThreadResult } = useThreadStore.getState();
          setThreadResult(response.data);
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

  // 重置分页并重新加载
  async resetAndLoad() {
    const { setPagination } = useThreadStore.getState();
    const currentOrg = useOrgStore.getState().currentOrg;
    
    // 重置分页到第一页
    setPagination({
      pageNumber: 0,
      pageSize: 100,
      total: 0
    });

    // 重新加载数据
    return this.loadThreads(currentOrg.uid);
  },

  // 根据筛选条件加载
  async loadThreadsWithFilters(filters: Record<string, any>) {
    const { setFilter } = useThreadStore.getState();
    
    // 更新筛选条件
    Object.entries(filters).forEach(([key, value]) => {
      setFilter(key, value);
    });
    
    // 重置分页并重新加载
    return this.resetAndLoad();
  }
}; 