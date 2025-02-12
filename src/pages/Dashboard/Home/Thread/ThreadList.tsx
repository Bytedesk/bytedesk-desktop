/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 10:06:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-12 17:01:54
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
  Divider,
  Empty,
  Flex,
  Input,
  List,
  Skeleton,
  Checkbox,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { queryThreads, updateThread } from "@/apis/core/thread";
// import { useQuery } from '@tanstack/react-query';
import { useThreadStore } from "@/stores/core/thread";
import "./threadList.css";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
// https://fkhadra.github.io/react-contexify/
// https://github.com/fkhadra/react-contexify
import {
  Menu,
  Item,
  useContextMenu,
  ItemParams,
  Separator,
  Submenu,
} from "react-contexify";
import "react-contexify/ReactContexify.css";
// import emitter from '@/utils/events';
import { useAppContext } from "@/context/AppContext";
// import { useIntl } from "react-intl";
import { message } from "@/AntdGlobalComp";
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
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL,
  IS_DEBUG,
} from "@/utils/constants";
import emitter from "@/utils/eventEmitter";
import { useWorkgroupStore } from "@/stores/service/workgroup";
// import useNotification from "@/hooks/useNotification";
import { Typography } from "antd";

const { Text } = Typography;

import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useIntl } from "react-intl";
import CreateRobot from "../RightPanel/RobotInfo/CreateRobot";
import { syncCurrentThreadCount } from "@/apis/service/agent";
import BlockModel from "@/components/Vip/BlockModel";
import TicketCreateDrawer from "@/pages/Vip/Ticket/components/TicketCreateDrawer";
// import { useSettingsStore } from "@/stores/core/setting";
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
  // const { showNotification } = useNotification();
  const isNetworkOnline = useNetworkStatus();
  // const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [agentStatus, setAgentStatus] = useState<string>("下线");
  const [threadSortedList, setThreadSortedList] = useState<
    THREAD.ThreadResponse[]
  >([]);
  const workgroupResult = useWorkgroupStore((state) => state.workgroupResult);
  const [isBlockModelOpen, setIsBlockModelOpen] = useState(false);
  const [isTicketCreateModelOpen, setIsTicketCreateModelOpen] = useState(false);
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
    addThreads,
    setCurrentThread,
    setThreadResult,
    setShowQueueList,
    loading,
    error,
    setSearchText,
  } = useThreadStore((state) => {
    return {
      threads: state.threads,
      queuingThreads: state.queuingThreads,
      threadResult: state.threadResult,
      currentThread: state.currentThread,
      showQueueList: state.showQueueList,
      addThreads: state.addThreads,
      setCurrentThread: state.setCurrentThread,
      setThreadResult: state.setThreadResult,
      setShowQueueList: state.setShowQueueList,
      loading: state.loading,
      error: state.error,
      setSearchText: state.setSearchText,
    };
  });
  //
  useEffect(() => {
    console.log("update threadList");
    // 给threads排序，thread.top=true的排在前面
    const sortedThreads = [...threads]
      .filter((thread) => !thread.hide)
      .filter((thread) => {
        if (searchValue && searchValue.length > 0) {
          return (
            thread?.user.nickname?.includes(searchValue) ||
            thread?.content?.includes(searchValue)
          );
        } else {
          return true;
        }
      })
      .sort((a, b) => {
        // 首先，根据 top 属性进行排序
        if (a.top && !b.top) {
          return -1; // a 排在前面
        }
        if (!a.top && b.top) {
          return 1; // b 排在前面
        }
        // 如果两个线程的 top 属性相同，则根据时间戳进行排序
        if (!a.top && !b.top) {
          // 将字符串转换为 Date 对象，然后获取时间戳进行比较
          const dateA = new Date(a.updatedAt).getTime();
          const dateB = new Date(b.updatedAt).getTime();
          // 按时间降序排列，最新的线程在前
          return dateB - dateA;
          // 如果您想按时间升序排列，则使用 dateA - dateB
        }
        // 如果两个线程都是 top 或者都不是 top，并且时间戳也相同，则保持它们的相对顺序不变
        return 0;
      });
    setThreadSortedList(sortedThreads);
  }, [threads, currentThread, searchValue]);
  //
  const [refreshing, setRefreshing] = useState(false);
  const isRefreshing = useRef(false);
  const [pageNumber, setPageNumber] = useState(0);
  const getThreads = async () => {
    console.log("getThreads start: ", pageNumber);
    if (isRefreshing.current) {
      console.log("queryThreads isRefreshing.current", isRefreshing.current);
      return;
    }
    setRefreshing(true);
    isRefreshing.current = true;
    const response = await queryThreads({
      pageNumber: pageNumber,
      pageSize: 20,
    });
    console.log("queryThreads: ", pageNumber, response.data);
    if (response.data.code === 200) {
      setThreadResult(response.data);
      addThreads(response.data.data.content);
      // 非最后一页，则继续加载下一页
      if (!response.data.data.last) {
        setPageNumber((pageNumber) => pageNumber + 1);
      } else {
        // setPageNumber(0);
      }
    } else if (response.data.code === 601) {
      // 匿名访问拦截
    } else {
      message.error(
        intl.formatMessage({
          id: "thread.error.message",
          defaultMessage: "获取数据失败",
        }),
      );
    }
    setRefreshing(false);
    isRefreshing.current = false;
  };
  const syncThreadCount = async () => {
    const agent: AGENT.AgentRequest = {
      uid: agentInfo?.uid,
    };
    const response = await syncCurrentThreadCount(agent);
    console.log("syncCurrentThreadCount:", response.data);
  };
  const loadFirstPageThreads = async () => {
    console.log("queryThreads loadFirstPageThreads");
    getThreads();
    syncThreadCount();
  };
  //
  useEffect(() => {
    if (isNetworkOnline) {
      console.log("isNetworkOnline ✅网络断开重连之后，需要重新拉取聊天记录");
      getThreads();
      syncThreadCount();
    } else {
      console.log("isNetworkOnline ❌网络断开，不重新拉取聊天记录");
    }
  }, [isNetworkOnline]);

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

  const handleTopThreadClick = async () => {
    console.log("handleTopThreadClick", currentThread);
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      top: !currentThread?.top,
    };
    const response = await updateThread(newThread);
    console.log("updateThread:", response.data, newThread);
    if (response.data.code === 200) {
      setCurrentThread(response.data.data);
      message.success(
        intl.formatMessage({
          id: "thread.set.success",
          defaultMessage: "设置成功",
        }),
      );
    } else {
      message.error(
        intl.formatMessage({
          id: "thread.set.error",
          defaultMessage: "设置失败",
        }),
      );
    }
  };

  const handleStarThreadClick = async (star: number) => {
    console.log("handleStarThreadClick", star);
    // TODO: 支持多级星标
    const newThread: THREAD.ThreadRequest = { ...currentThread, star: star };
    const response = await updateThread(newThread);
    console.log("updateThread:", response.data, newThread);
    if (response.data.code === 200) {
      setCurrentThread(response.data.data);
      message.success("设置成功");
    } else {
      message.error(response.data.message);
    }
  };

  const handleMuteThreadClick = async () => {
    console.log("handleMuteThreadClick", currentThread);
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      mute: !currentThread?.mute,
    };
    const response = await updateThread(newThread);
    console.log("updateThread:", response.data, newThread);
    if (response.data.code === 200) {
      setCurrentThread(response.data.data);
      message.success("设置成功");
    } else {
      message.error(response.data.message);
    }
  };

  const handleUnreadThreadClick = async () => {
    console.log("handleUnreadThreadClick", currentThread);
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      unread: !currentThread?.unread,
    };
    const response = await updateThread(newThread);
    console.log("updateThread:", response.data, newThread);
    if (response.data.code === 200) {
      setCurrentThread(response.data.data);
      message.success("设置成功");
    } else {
      message.error(response.data.message);
    }
  };

  const handleHideThreadClick = async () => {
    console.log("handleHideThreadClick", currentThread);
    const newThread: THREAD.ThreadRequest = {
      ...currentThread,
      hide: !currentThread?.hide,
    };
    const response = await updateThread(newThread);
    console.log("updateThread:", response.data, newThread);
    if (response.data.code === 200) {
      setCurrentThread(response.data.data);
      message.success("设置成功");
    } else {
      message.error(response.data.message);
    }
  };

  const handleBlackThreadClick = async () => {
    console.log("handleBlackThreadClick");
    setIsBlockModelOpen(true);
  };

  const handleTicketThreadClick = async () => {
    console.log("handleTicketThreadClick");
    setIsTicketCreateModelOpen(true);
  };

  const handleCrmThreadClick = async () => {
    console.log("handleCrmThreadClick");
    message.warning(
      intl.formatMessage({
        id: "thread.feature.unavailable",
        defaultMessage: "TODO: 该功能暂未开放",
      }),
    );
  };

  const handleSummaryThreadClick = async () => {
    console.log("handleSummaryThreadClick");
    message.warning(
      intl.formatMessage({
        id: "thread.feature.unavailable",
        defaultMessage: "TODO: 该功能暂未开放",
      }),
    );
  };

  const handleTransferThreadClick = async () => {
    console.log("handleTransferThreadClick");
    emitter.emit(EVENT_BUS_MESSAGE_TYPE_TRANSFER_LOCAL);
  };

  // https://github.com/fkhadra/react-contexify
  const MENU_ID = "thread_list_item";
  const { show } = useContextMenu({ id: MENU_ID });
  function handleContextMenu(event, thread: THREAD.ThreadResponse) {
    console.log("handleContextMenu:", event, " item:", thread);
    setCurrentThread(thread);
    show({
      event,
      props: {
        key: thread.uid,
      },
    });
  }
  //
  // I'm using a single event handler for all items but you don't have too :)
  const handleRightClick = ({ id, event, props }: ItemParams) => {
    console.log("handleRightClick:", id, event, props);
    switch (id) {
      case "top":
        handleTopThreadClick();
        break;
      case "star-0":
        handleStarThreadClick(0);
        break;
      case "star-1":
        handleStarThreadClick(1);
        break;
      case "star-2":
        handleStarThreadClick(2);
        break;
      case "star-3":
        handleStarThreadClick(3);
        break;
      case "star-4":
        handleStarThreadClick(4);
        break;
      case "mute":
        handleMuteThreadClick();
        break;
      case "unread":
        handleUnreadThreadClick();
        break;
      case "hide":
        handleHideThreadClick();
        break;
      case "black":
        handleBlackThreadClick();
        break;
      case "ticket":
        handleTicketThreadClick();
        break;
      case "crm":
        handleCrmThreadClick();
        break;
      case "summary":
        handleSummaryThreadClick();
        break;
      case "transfer":
        handleTransferThreadClick();
        break;
      default:
        message.warning(
          intl.formatMessage({
            id: "thread.coming.soon",
            defaultMessage: "即将上线，敬请期待",
          }),
        );
      //etc...
    }
  };
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
    setSearchValue(value);
    threadService.loadThreadsWithFilters({ searchText: value });
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

    // 按星标等级排序
    return [...filteredThreads].sort((a, b) => {
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
      threadService.loadThreads(currentOrg.uid);
    }
  }, [currentOrg?.uid]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索区域 */}
      {/* <div style={{ padding: '16px' }}>
        <Input.Search
          placeholder={intl.formatMessage({ id: 'thread.search.placeholder' })}
          onSearch={(value) => handleSearchChange(value)}
          style={{ width: '100%' }}
          allowClear
        />
      </div> */}

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
          {refreshing && (
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
        {threadSortedList?.length === 0 && <Empty />}
        {threadSortedList?.length > 0 && (
          <InfiniteScroll
            dataLength={threadSortedList.length}
            next={getThreads}
            hasMore={
              !threadResult.data.last &&
              threadSortedList.length < threadResult.data.totalElements
            }
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={
              <Divider plain>
                {intl.formatMessage({
                  id: "thread.list.no.more",
                  defaultMessage: "没有更多了",
                })}
              </Divider>
            }
            // height={window.innerHeight - 100}
            // onScroll={(e) => {
            //   console.log("queryThreads onScroll:", e);
            // }}
            scrollableTarget="scrollableDiv"
            // below props only if you need pull down functionality
            refreshFunction={loadFirstPageThreads}
            pullDownToRefresh={true}
            pullDownToRefreshThreshold={20}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                {intl.formatMessage({
                  id: "thread.refresh.pull",
                  defaultMessage: "↓ 下拉刷新",
                })}
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                {intl.formatMessage({
                  id: "thread.refresh.release",
                  defaultMessage: "↑ 松开刷新",
                })}
              </h3>
            }
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
                            <>{translateStringTranct("i18n.ticket")}</>
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
      <Menu id={MENU_ID} theme={isDarkMode ? "dark" : "light"}>
        <Item id="top" onClick={handleRightClick}>
          {currentThread?.top
            ? intl.formatMessage({ id: "thread.menu.untop" })
            : intl.formatMessage({ id: "thread.menu.top" })}
        </Item>
        <Item id="unread" onClick={handleRightClick}>
          {currentThread?.unread
            ? intl.formatMessage({ id: "thread.menu.read" })
            : intl.formatMessage({ id: "thread.menu.unread" })}
        </Item>
        <Item id="mute" onClick={handleRightClick}>
          {currentThread?.mute
            ? intl.formatMessage({ id: "thread.menu.unmute" })
            : intl.formatMessage({ id: "thread.menu.mute" })}
        </Item>
        <Submenu label={intl.formatMessage({ id: "thread.menu.star" })}>
          <Item id="star-1" onClick={handleRightClick}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: STAR_COLORS["star-1"],
                }}
              />
              {intl.formatMessage({ id: "thread.menu.star.1" })}
            </div>
          </Item>
          <Item id="star-2" onClick={handleRightClick}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: STAR_COLORS["star-2"],
                }}
              />
              {intl.formatMessage({ id: "thread.menu.star.2" })}
            </div>
          </Item>
          <Item id="star-3" onClick={handleRightClick}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: STAR_COLORS["star-3"],
                }}
              />
              {intl.formatMessage({ id: "thread.menu.star.3" })}
            </div>
          </Item>
          <Item id="star-4" onClick={handleRightClick}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: STAR_COLORS["star-4"],
                }}
              />
              {intl.formatMessage({ id: "thread.menu.star.4" })}
            </div>
          </Item>
          {currentThread?.star && (
            <>
              <Separator />
              <Item id="star-0" onClick={handleRightClick}>
                {intl.formatMessage({ id: "thread.menu.star.cancel" })}
              </Item>
            </>
          )}
        </Submenu>
        <Separator />
        <Item id="transfer" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.transfer" })}
        </Item>
        <Item id="hide" onClick={handleRightClick}>
          {intl.formatMessage({ id: "i18n.hide" })}
        </Item>
        <Separator />
        <Item id="black" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.block" })}
        </Item>
        <Item id="ticket" onClick={handleRightClick}>
          {intl.formatMessage({ id: "thread.menu.ticket" })}
        </Item>
        {IS_DEBUG && (
          <>
            <Item id="crm" onClick={handleRightClick}>
              {intl.formatMessage({ id: "thread.menu.crm" })}
            </Item>
            <Item id="summary" onClick={handleRightClick}>
              {intl.formatMessage({ id: "thread.menu.summary" })}
            </Item>
          </>
        )}
        <Separator />
        <Submenu label={intl.formatMessage({ id: "thread.menu.filter" })}>
          <Item
            id="groupThread"
            onClick={() => handleFilterChange("groupThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.groupThread} />
              {intl.formatMessage({ id: "thread.menu.groupThread" })}
            </div>
          </Item>
          <Item
            id="robotThread"
            onClick={() => handleFilterChange("robotThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.robotThread} />
              {intl.formatMessage({ id: "thread.menu.robotThread" })}
            </div>
          </Item>
          <Item
            id="workgroupThread"
            onClick={() => handleFilterChange("workgroupThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.workgroupThread} />
              {intl.formatMessage({ id: "thread.menu.workgroupThread" })}
            </div>
          </Item>
          <Item
            id="agentThread"
            onClick={() => handleFilterChange("agentThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.agentThread} />
              {intl.formatMessage({ id: "thread.menu.agentThread" })}
            </div>
          </Item>
          <Item
            id="ticketThread"
            onClick={() => handleFilterChange("ticketThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.ticketThread} />
              {intl.formatMessage({ id: "thread.menu.ticketThread" })}
            </div>
          </Item>
          <Item
            id="memberThread"
            onClick={() => handleFilterChange("memberThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.memberThread} />
              {intl.formatMessage({ id: "thread.menu.memberThread" })}
            </div>
          </Item>
          <Item
            id="deviceThread"
            onClick={() => handleFilterChange("deviceThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.deviceThread} />
              {intl.formatMessage({ id: "thread.menu.deviceThread" })}
            </div>
          </Item>
          <Item
            id="systemThread"
            onClick={() => handleFilterChange("systemThread")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox checked={filters.systemThread} />
              {intl.formatMessage({ id: "thread.menu.systemThread" })}
            </div>
          </Item>
        </Submenu>
        {/* <Submenu label="Foobar">
          <Item id="reload" onClick={handleRightClick}>Reload</Item>
        </Submenu> */}
      </Menu>
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
      {isTicketCreateModelOpen && (
        <TicketCreateDrawer
          open={isTicketCreateModelOpen}
          onSuccess={() => {
            setIsTicketCreateModelOpen(false);
          }}
          onCancel={() => {
            setIsTicketCreateModelOpen(false);
          }}
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
