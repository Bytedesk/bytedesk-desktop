/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 10:06:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-14 10:22:35
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Empty,
  Flex,
  Input,
  List,
  Spin,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {updateThread } from "@/apis/core/thread";
import { useThreadStore } from "@/stores/core/thread";
import "./threadList.css";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
// https://fkhadra.github.io/react-contexify/
// https://github.com/fkhadra/react-contexify
import {
    useContextMenu,
} from "react-contexify";
import "react-contexify/ReactContexify.css";
// import emitter from '@/utils/events';
import { useAppContext } from "@/context/AppContext";
// import { useIntl } from "react-intl";
import {
  generateAvatar,
  isAgentThread,
  isDeviceThread,
  isGroupThread,
  isMemberThread,
  isOrgAgentTopic,
  isOrgRobotTopic,
  isOrgTicketThreadTopic,
  isOrgWorkgroupTopic,
  isRobotThread,
  isSystemThread,
  isTicketThread,
  isWorkgroupThread,
  shortTimeFormat,
} from "@/utils/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  DownOutlined,
  OrderedListOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import useTranslate from "@/hooks/useTranslate";
import CreateGroup from "../RightPanel/GroupInfo/CreateGroup";
import {
  AGENT_STATUS_AVAILABLE,
  AGENT_STATUS_BUSY,
  AGENT_STATUS_OFFLINE,
} from "@/utils/constants";
import { useWorkgroupStore } from "@/stores/service/workgroup";
// import useNotification from "@/hooks/useNotification";
import { Typography } from "antd";
import { ThreadContextMenu, MENU_ID } from './components/ThreadContextMenu';

const { Text } = Typography;

import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useIntl } from "react-intl";
import CreateRobot from "../RightPanel/RobotInfo/CreateRobot";
import { syncCurrentThreadCount } from "@/apis/service/agent";
import BlockModel from "@/components/Vip/BlockModel";
import { threadService } from "@/services/threadService";
import { useOrgStore } from "@/stores/core/organization";

// 添加星标颜色常量
const STAR_COLORS = {
  "star-1": "#FFB800", // 金色
  "star-2": "#FF4D4F", // 红色
  "star-3": "#52C41A", // 绿色
  "star-4": "#1890FF", // 蓝色
};

const ThreadList = () => {
  const intl = useIntl();
  const { translateStringTranct } = useTranslate();
  const { isDarkMode, agentInfo, hasRoleAgent, handleUpdateAgentStatus } =
    useAppContext();
  console.log("hasRoleAgent: ", hasRoleAgent, agentInfo);
  const isNetworkOnline = useNetworkStatus();
  const [agentStatus, setAgentStatus] = useState<string>("下线");
  const workgroupResult = useWorkgroupStore((state) => state.workgroupResult);
  const [isBlockModelOpen, setIsBlockModelOpen] = useState(false);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  // 
  const dropDownItems: MenuProps["items"] = [
    {
      key: "group",
      label: intl.formatMessage({
        id: "thread.dropdown.create.group",
        defaultMessage: "创建群聊",
      }),
    },
    {
      key: "ai",
      label: intl.formatMessage({
        id: "thread.dropdown.create.ai",
        defaultMessage: "创建AI对话",
      }),
    },
  ];
  const agentStatusItems: MenuProps["items"] = [
    {
      key: AGENT_STATUS_AVAILABLE,
      label: intl.formatMessage({
        id: "thread.agent.status.online",
        defaultMessage: "😀 - 在线接待",
      }),
    },
    {
      key: AGENT_STATUS_OFFLINE,
      label: intl.formatMessage({
        id: "thread.agent.status.offline",
        defaultMessage: "🔻 - 客服下线",
      }),
    },
    {
      key: AGENT_STATUS_BUSY,
      label: intl.formatMessage({
        id: "thread.agent.status.busy",
        defaultMessage: "🏃‍♀️ - 客服忙碌",
      }),
    },
  ];
  //
  const {
    threads,
    queuingThreads,
    threadResult,
    currentThread,
    showQueueList,
    loading,
    pagination,
    searchText,
    setSearchText,
    setCurrentThread,
    setShowQueueList,
  } = useThreadStore();
  //
  // const [refreshing, setRefreshing] = useState(false);
  const isRefreshing = useRef(false);
  // const [pageNumber, setPageNumber] = useState(0);
  const getThreads = async () => {
    if (isRefreshing.current || !currentOrg?.uid) return;
    
    // setRefreshing(true);
    isRefreshing.current = true;
    
    try {
      await threadService.loadThreads(currentOrg.uid);
      await syncThreadCount();
    } finally {
      // setRefreshing(false);
      isRefreshing.current = false;
    }
  };
  const syncThreadCount = async () => {
    const agent: AGENT.AgentRequest = {
      uid: agentInfo?.uid,
    };
    const response = await syncCurrentThreadCount(agent);
    console.log("syncCurrentThreadCount:", response.data);
  };
  //
  useEffect(() => {
    if (isNetworkOnline && currentOrg?.uid) {
      console.log("网络重连，重新加载会话列表");
      getThreads();
    }
  }, [isNetworkOnline, currentOrg?.uid]);

  const handleSelectThreadClick = async (thread: THREAD.ThreadResponse) => {
    console.log("handleSelectThreadClick", thread.uid);
    if (thread.uid === currentThread?.uid) {
      console.log("handleSelectThreadClick 当前聊天窗口，无需操作");
      return;
    }
    setCurrentThread(thread);
    // 清空未读消息数 unreadCount = 0
    if (thread.unreadCount > 0) {
      handleUpdateThreadUnreadCount(0);
    }
  };

  const handleUpdateThreadUnreadCount = async (unreadCount: number) => {
    console.log("handleUpdateThreadUnreadCount", unreadCount);
    const newThread: THREAD.ThreadRequest = { ...currentThread, unreadCount };
    await updateThread(newThread);
  };

  // https://github.com/fkhadra/react-contexify
  const { show } = useContextMenu({ id: MENU_ID });
  function handleContextMenu(event, thread: THREAD.ThreadResponse) {
    console.log("handleContextMenu:", event, " item:", thread);
    setCurrentThread(thread);
    show({ event });
  }
  //
  const getAvatar = (item: THREAD.ThreadResponse) => {
    // 生成默认头像
    if (item?.user?.avatar === null || item?.user?.avatar === undefined) {
      return (
        <img
          style={{ marginLeft: 10 }}
          src={generateAvatar(item?.user?.uid || "")}
          alt="Avatar"
        />
      );
    }
    // 本地头像
    if (item?.user?.avatar.indexOf("local") > -1) {
      return (
        <img
          style={{ marginLeft: 10 }}
          src={generateAvatar(item?.user?.uid || "")}
          alt="Avatar"
        />
      );
    }
    if (item?.user?.avatar.indexOf("http") === -1) {
      return <p style={{ marginLeft: 25 }}>{item?.user?.avatar}</p>;
    }

    return (
      <>
        {item?.unread ? (
          <>
            <Badge dot={item?.unread} style={{ marginTop: 10 }}>
              <Avatar
                style={{ marginLeft: 10, marginTop: 5 }}
                shape="square"
                size="large"
                src={item?.user?.avatar || ""}
              />
            </Badge>
          </>
        ) : (
          <>
            <Badge count={item?.unreadCount} style={{ marginTop: 10 }}>
              <Avatar
                style={{ marginLeft: 10, marginTop: 5 }}
                shape="square"
                size="large"
                src={item?.user?.avatar || ""}
              />
            </Badge>
          </>
        )}
      </>
    );
  };
  //
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const showCreateGroupModal = () => {
    setIsCreateGroupModalOpen(true);
  };
  const handleCreateGroupOk = () => {
    setIsCreateGroupModalOpen(false);
  };
  const handleCreateGroupCancel = () => {
    setIsCreateGroupModalOpen(false);
  };
  const [isCreateRobotModalOpen, setIsCreateRobotModalOpen] = useState(false);
  const showCreateRobotModal = () => {
    setIsCreateRobotModalOpen(true);
  };
  const handleCreateRobotOk = () => {
    setIsCreateRobotModalOpen(false);
  };
  const handleCreateRobotCancel = () => {
    setIsCreateRobotModalOpen(false);
  };
  //
  const handleSearchChange = (value: string) => {
    console.log("handleSearchChange:", value);
    setSearchText(value);
    if (currentOrg?.uid) {
      // 搜索时重置分页并重新加载
      threadService.loadThreadsWithFilters({ searchText: value });
    }
  };

  // 抽取设置状态的公共函数
  const setAgentStatusByKey = (statusKey: string) => {
    if (statusKey === AGENT_STATUS_AVAILABLE) {
      return setAgentStatus(
        intl.formatMessage({
          id: "thread.status.online",
          defaultMessage: "😀接待",
        }),
      );
    } else if (statusKey === AGENT_STATUS_OFFLINE) {
      return setAgentStatus(
        intl.formatMessage({
          id: "thread.status.offline",
          defaultMessage: "🔻下线",
        }),
      );
    } else if (statusKey === AGENT_STATUS_BUSY) {
      return setAgentStatus(
        intl.formatMessage({
          id: "thread.status.busy",
          defaultMessage: "🏃‍♀️忙碌",
        }),
      );
    }
  };

  // 修改 useEffect
  useEffect(() => {
    console.log("useEffect agentStatus");
    setAgentStatusByKey(agentInfo?.status);
  }, [agentInfo, intl]);

  // 修改点击处理函数
  const handleAgentStatusClick: MenuProps["onClick"] = (e) => {
    console.log("handleAgentStatusClick:", e);
    handleUpdateAgentStatus(e.key);
    setAgentStatusByKey(e.key);
  };

  const getWorkgroupNickname = (thread: THREAD.ThreadResponse) => {
    // "org/workgroup/%s/%s";
    const workgroupUid = thread?.topic.split("/")[2];
    // 从 workgroupResult.data.content 中获取 workgroup 的 nickname, uid==workgroupUid
    const workgroup = workgroupResult?.data.content.find(
      (workgroup: WORKGROUP.WorkgroupResponse) => {
        return workgroupUid === workgroup?.uid;
      },
    );
    if (workgroup !== undefined && workgroup !== null) {
      return translateStringTranct(workgroup?.nickname);
    }
  };

  const handleSwitchQueue = () => {
    console.log("handleSwitchQueue");
    setShowQueueList(!showQueueList);
  };

  const handleDropDownClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "group") {
      showCreateGroupModal();
    } else if (key === "ai") {
      showCreateRobotModal();
    }
  };

  // 添加过滤状态
  const [filters, setFilters] = useState({
    groupThread: false,
    robotThread: false,
    workgroupThread: false,
    agentThread: false,
    ticketThread: false,
    memberThread: false,
    deviceThread: false,
    systemThread: false,
  });

  // 处理复选框点击
  const handleFilterChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 修改 filterThreads 函数，添加排序逻辑
  const filterThreads = (threads: THREAD.ThreadResponse[]) => {
    // 创建数组副本
    let filteredThreads = [...threads];

    // 应用过滤条件
    if (Object.values(filters).some((v) => v)) {
      filteredThreads = filteredThreads.filter((thread) => {
        if (filters.groupThread && isGroupThread(thread)) return true;
        if (filters.robotThread && isRobotThread(thread)) return true;
        if (filters.workgroupThread && isWorkgroupThread(thread)) return true;
        if (filters.agentThread && isAgentThread(thread)) return true;
        if (filters.ticketThread && isTicketThread(thread)) return true;
        if (filters.memberThread && isMemberThread(thread)) return true;
        if (filters.deviceThread && isDeviceThread(thread)) return true;
        if (filters.systemThread && isSystemThread(thread)) return true;
        return false;
      });
    }

    // 置顶 > 星级 > 更新时间
    return [...filteredThreads].sort((a, b) => {
      // 置顶 > 星级 > 更新时间
      const aTop = a.top || false;
      const bTop = b.top || false;
      if (aTop !== bTop) {
        return aTop ? -1 : 1;
      }
      // 4星 > 3星 > 2星 > 1星
      const aStarLevel = a.star || 0;
      const bStarLevel = b.star || 0;
      if (aStarLevel !== bStarLevel) {
        return bStarLevel - aStarLevel; // 高星级排在前面
      }
      // 如果星级相同，按最后消息时间排序
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  // 在渲染列表时使用这个过滤函数
  const filteredThreads = filterThreads(threads);

  // 初始加载
  useEffect(() => {
    if (currentOrg?.uid) {
      // 重置并加载第一页
      threadService.resetAndLoad();
    }
  }, [currentOrg?.uid]);

  // 加载更多数据
  const loadMoreThreads = async () => {
    if (loading || !currentOrg?.uid) return;
    if (!threadResult.data.last) {
      await threadService.loadThreads(currentOrg.uid);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div>
        <div>
          {/* FIXME: 控制输入框不随列表滚动 */}
          <Flex
            style={{ marginTop: 15, marginBottom: 15 }}
            gap={"middle"}
            justify="center"
            align="center"
          >
            <Input
              style={{
                width: "55%",
              }}
              size="small"
              placeholder={intl.formatMessage({
                id: "thread.search.placeholder",
                defaultMessage: "搜索",
              })}
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Dropdown
              menu={{ items: dropDownItems, onClick: handleDropDownClick }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <PlusOutlined />
                </Space>
              </a>
            </Dropdown>
            {hasRoleAgent && (
              <Dropdown
                menu={{
                  items: agentStatusItems,
                  onClick: handleAgentStatusClick,
                }}
              >
                <Space>
                  <Text>{agentStatus}</Text>
                  <Text>
                    <DownOutlined />
                  </Text>
                </Space>
              </Dropdown>
            )}
          </Flex>
          {!isNetworkOnline && (
            <Alert
              message={intl.formatMessage({ id: "i18n.network.disconnected" })}
              banner
            />
          )}
          {loading && (
            <p style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Button loading block>
                {intl.formatMessage({ id: "i18n.message.pulling" })}
              </Button>
            </p>
          )}
        </div>
        {hasRoleAgent && queuingThreads.length > 0 && (
          <Button
            icon={<OrderedListOutlined />}
            block
            onClick={handleSwitchQueue}
          >
            {intl.formatMessage({ id: "i18n.queue.tip" }) +
              "(" +
              queuingThreads.length +
              ")"}
          </Button>
        )}
        {filteredThreads?.length === 0 && <Empty />}
        {filteredThreads?.length > 0 && (
          <InfiniteScroll
            dataLength={filteredThreads.length}
            next={loadMoreThreads}
            hasMore={!threadResult.data.last && filteredThreads.length < pagination.total}
            loader={
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin tip={intl.formatMessage({ id: 'thread.loading.more' })} />
              </div>
            }
            scrollableTarget="scrollableDiv"
            style={{ overflow: 'hidden' }}
          >
            <List
              dataSource={filteredThreads}
              renderItem={(thread) => (
                <List.Item
                  key={thread?.uid}
                  onClick={() => handleSelectThreadClick(thread)}
                  onContextMenu={() => handleContextMenu(event, thread)}
                  className={
                    currentThread?.uid === thread?.uid
                      ? isDarkMode
                        ? "list-item-dark-active"
                        : "list-item-active"
                      : isDarkMode
                        ? "list-item-dark"
                        : "list-item"
                  }
                  style={{
                    backgroundColor: thread.star
                      ? STAR_COLORS[`star-${thread.star}`] + "10"
                      : undefined,
                    borderLeft: thread.star
                      ? `3px solid ${STAR_COLORS[`star-${thread.star}`]}`
                      : undefined,
                  }}
                >
                  <List.Item.Meta
                    avatar={getAvatar(thread)}
                    title={
                      <>
                        {thread?.top ? <VerticalAlignTopOutlined /> : <></>}
                        {translateStringTranct(thread?.user?.nickname)}
                      </>
                    }
                    description={
                      <span className="ellipsis">
                        <>
                          {thread?.mute ? <StopOutlined /> : <></>}
                          {isOrgRobotTopic(thread?.topic) ? (
                            <>{translateStringTranct("i18n.robot")}</>
                          ) : (
                            <></>
                          )}
                          {isOrgAgentTopic(thread?.topic) ? (
                            <>{translateStringTranct("i18n.agent")}</>
                          ) : (
                            <></>
                          )}
                          {isOrgWorkgroupTopic(thread?.topic) ? (
                            <>{"[" + getWorkgroupNickname(thread) + "]"}</>
                          ) : (
                            <></>
                          )}
                          {isOrgTicketThreadTopic(thread?.topic) ? (
                            <>{translateStringTranct("i18n.ticket.thread")}</>
                          ) : (
                            <></>
                          )}
                          {" " + translateStringTranct(thread?.content)}
                        </>
                      </span>
                    }
                  />
                  <span className="timestamp">
                    {shortTimeFormat(thread?.updatedAt)}
                  </span>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        )}
      </div>
      {/* https://github.com/fkhadra/react-contexify */}
      <ThreadContextMenu 
        currentThread={currentThread}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSetCurrentThread={setCurrentThread}
        onOpenBlockModal={() => setIsBlockModelOpen(true)}
        // onOpenTicketModal={() => setIsTicketCreateModelOpen(true)}
      />
      {isCreateGroupModalOpen && (
        <CreateGroup
          open={isCreateGroupModalOpen}
          onSubmit={handleCreateGroupOk}
          onCancel={handleCreateGroupCancel}
        />
      )}
      {isCreateRobotModalOpen && (
        <CreateRobot
          open={isCreateRobotModalOpen}
          onSubmit={handleCreateRobotOk}
          onCancel={handleCreateRobotCancel}
        />
      )}
      {isBlockModelOpen && (
        <BlockModel
          open={isBlockModelOpen}
          onOk={() => {
            setIsBlockModelOpen(false);
          }}
          onCancel={() => {
            setIsBlockModelOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ThreadList;
