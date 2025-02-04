/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-11-13 15:17:34
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:39:38
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useEffect, useRef, useState } from "react";
import { Button, List, Modal, Space } from "antd";
import { message } from "@/AntdGlobalComp";
import {
  createPromptRobot,
  createThread,
  deleteRobot,
  queryRobotsByOrg,
  updatePromptRobot,
  // updateRobot,
} from "@/apis/ai/robot";
import useTheme from "@/hooks/useTheme";
// import useTranslate from '@/hooks/useTranslate';
import {
  HTTP_CLIENT,
  ROBOT_TYPE_LLM,
  THREAD_TYPE_LLM,
  TOPIC_ORG_ROBOT_PREFIX,
  USER_TYPE_USER,
} from "@/utils/constants";
import RobotDrawer from "./RobotDrawer";
import {
  ExclamationCircleOutlined,
  // ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useTranslate from "@/hooks/useTranslate";
import { useIntl } from "react-intl";
import { useCategoryStore } from "@/stores/core/category";
import { useOrgStore } from "@/stores/core/organization";
import { useSettingsStore } from "@/stores/core/setting";
import { useThreadStore } from "@/stores/core/thread";
import { useUserStore } from "@/stores/core/user";
import { useNavigate } from "react-router-dom";

type RobotListProps = {
  level: string;
  type?: string;
};

// 智能体
const RobotList = ({ level, type }: RobotListProps) => {
  console.log("RobotList", level, type);
  const isLoading = useRef(false);
  const intl = useIntl();
  const { isDarkMode } = useTheme();
  const [isEdit, setIsEdit] = useState(true);
  const { translateString } = useTranslate();
  const [isRobotDrawerOpen, setIsRobotDrawerOpen] = useState(false);
  const [robotResult, setRobotResult] = useState<ROBOT.HttpPageResult>();
  const [currentRobot, setCurrentRobot] = useState<ROBOT.RobotResponse>({});
  const currentCategory = useCategoryStore((state) => state.currentCategory);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const [modal, contextHolder] = Modal.useModal();
  //
  const navigate = useNavigate();
  const addThread = useThreadStore((state) => state.addThread);
  const setCurrentThread = useThreadStore((state) => state.setCurrentThread);
  const setCurrentMenu = useSettingsStore((state) => state.setCurrentMenu);
  const userInfo = useUserStore((state) => state.userInfo);
  const showDeleteConfirmModel = (llmModel: ROBOT.RobotResponse) => {
    modal.confirm({
      title: intl.formatMessage({ id: "deleteTip" }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ 
        id: "robot.list.delete.confirm",
        defaultMessage: "Delete【{name}】?"
      }, {
        name: translateString(llmModel.nickname)
      }),
      onOk() {
        handleDeleteRobot(llmModel);
      },
      onCancel() {
        console.log('取消');
      },
      okText: intl.formatMessage({ id: "ok" }),
      cancelText: intl.formatMessage({ id: "cancel" }),
    });
  };
  //
  const handleDeleteRobot = async (robot: ROBOT.RobotResponse) => {
    console.log("delete robot", robot);
    message.loading(
      intl.formatMessage({ 
        id: "robot.list.deleting",
        defaultMessage: "Deleting" 
      })
    );
    const response = await deleteRobot(robot);
    console.log("delete robot response", response);
    if (response.data.code === 200) {
      message.destroy();
      message.success(
        intl.formatMessage({
          id: "robot.list.delete.success",
          defaultMessage: "Delete success"
        })
      );
      // 根据robot.uid 从robotResult中删除当前选中的机器人
      const newData = [...robotResult?.data?.content as ROBOT.RobotResponse[]];
      for (const i in newData) {
        if (newData[i].uid === robot.uid) {
          newData.splice(Number(i), 1);
          break;
        }
      }
      setRobotResult({
        ...robotResult,
        data: {
          content: newData,
        },
      });
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };

  const getRobots = async () => {
    if (isLoading.current) {
      console.log("isLoading: 1", isLoading.current);
      return;
    }
    isLoading.current = true;
    message.loading(intl.formatMessage({
      id: "robot.list.loading",
      defaultMessage: "Loading"
    }));
    //
    const pageParams: ROBOT.RobotRequest = {
      pageNumber: 0,
      pageSize: 100,
      //
      orgUid: currentOrg?.uid,
      categoryUid: currentCategory?.uid === "all" ? "" : currentCategory?.uid,
      type: ROBOT_TYPE_LLM,
      level: level,
    };
    const response = await queryRobotsByOrg(pageParams);
    console.log("getPlatformRobots queryRobotsByOrg: ", response);
    if (response.data.code === 200) {
      message.destroy();
      setRobotResult(response.data);
    } else {
      message.destroy();
      message.error(response.data.message);
    }
    isLoading.current = false;
  };

  useEffect(() => {
    getRobots();
  }, [currentCategory]);

  const handleSubmit = async (robot: ROBOT.RobotRequest) => {
    console.log("handleSubmit");
    if (isEdit) {
      const response = await updatePromptRobot(robot);
      console.log("updatePromptRobot:", response);
      if (response.data.code === 200) {
        message.success(
          intl.formatMessage({
            id: "robot.list.update.success",
            defaultMessage: "Update success"
          })
        );
        // getRobots();
        // 将response.data.data 更新到 robotResult.data.content 中，需要对比找到uid相同的元素，然后更新
        const newData = [...robotResult?.data?.content as ROBOT.RobotResponse[]];
        for (const i in newData) {
          if (newData[i].uid === robot.uid) {
            newData[i] = response?.data?.data;
            break;
          }
        }
        setRobotResult({
          ...robotResult,
          data: {
            content: newData,
          },
        });
        setIsRobotDrawerOpen(false);
      } else {
        message.error(response.data.message);
      }
    } else {
      const response = await createPromptRobot(robot);
      console.log("createPromptRobot:", response);
      if (response.data.code === 200) {
        message.success(
          intl.formatMessage({
            id: "robot.list.create.success",
            defaultMessage: "Create success"
          })
        );
        // getRobots();
        // 将response.data.data 插入到robotResult.data.content 中
        const newData = [...robotResult?.data?.content as ROBOT.RobotResponse[]];
        newData.unshift(response?.data?.data);
        setRobotResult({
          ...robotResult,
          data: {
            content: newData,
          },
        });
        setIsRobotDrawerOpen(false);
      } else {
        message.error(response.data.message);
      }
    }
  };

  const handleListOnClick = (record: ROBOT.RobotResponse, index: number) => {
    console.log("list on click", record, index);
    setCurrentRobot(record);
  };

  const handleListOnEdit = (record: ROBOT.RobotResponse, index: number) => {
    console.log("list on edit", record, index);
    setIsEdit(true);
    setCurrentRobot(record);
    setIsRobotDrawerOpen(true);
  };

  const handleListOnDelete = (record: ROBOT.RobotResponse, index: number) => {
    console.log("list on delete", record, index);
    setCurrentRobot(record);
    showDeleteConfirmModel(record);
  };

  const startRobotChat = async (record: ROBOT.RobotResponse, index: number) => {
    console.log("startRobotChat", record, index);
    const threadRequest: THREAD.ThreadRequest = {
      user: {
        uid: record?.uid,
        nickname: record?.nickname,
        avatar: record?.avatar,
        type: USER_TYPE_USER,
      },
      topic: TOPIC_ORG_ROBOT_PREFIX + record?.uid + "/" + userInfo?.uid,
      content: "",
      type: THREAD_TYPE_LLM,
      extra: "",
      client: HTTP_CLIENT,
    };
    console.log("startRobotChat request:", threadRequest);
    const response = await createThread(threadRequest);
    console.log("startRobotChat response:", response.data);
    if (response.data.code === 200) {
      addThread(response.data.data);
      setCurrentThread(response.data.data);
      setCurrentMenu("chat");
      navigate("/chat");
    } else {
      message.error(response.data.message);
    }
  };

  return (
    <>
      <Space>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          style={{ marginLeft: 10, marginTop: 10 }}
          onClick={() => {
            setIsEdit(false);
            setIsRobotDrawerOpen(true);
          }}
        >
          {intl.formatMessage({
            id: "robot.list.add",
            defaultMessage: "Add AI Agent"
          })}
        </Button>
      </Space>
      <List
        dataSource={robotResult?.data.content}
        style={{ marginTop: 10 }}
        renderItem={(item, index) => (
          <List.Item
            key={item?.uid}
            style={
              currentRobot?.uid === item.uid
                ? {
                    backgroundColor: isDarkMode ? "#333333" : "#dddddd",
                    cursor: "pointer",
                  }
                : { cursor: "pointer" }
            }
            onClick={() => handleListOnClick(item, index)}
            actions={[
              <Button onClick={() => startRobotChat(item, index)}>
                {intl.formatMessage({
                  id: "robot.list.chat",
                  defaultMessage: "Chat"
                })}
              </Button>,
              <Button
                key="edit"
                type="link"
                onClick={() => handleListOnEdit(item, index)}
              >
                {intl.formatMessage({
                  id: "robot.list.edit",
                  defaultMessage: "Edit"
                })}
              </Button>,
              <Button
                key="delete"
                type="link"
                onClick={() => handleListOnDelete(item, index)}
              >
                {intl.formatMessage({
                  id: "robot.list.delete",
                  defaultMessage: "Delete"
                })}
              </Button>,
            ]}
          >
            <List.Item.Meta
              style={{ marginLeft: "10px" }}
              title={
                translateString(item?.nickname) + ' ' + translateString(item?.description)
              }
              description={translateString(item?.llm?.prompt)}
            />
          </List.Item>
        )}
      />
      {isRobotDrawerOpen && (
        <RobotDrawer
          isEdit={isEdit}
          robot={currentRobot}
          level={level}
          open={isRobotDrawerOpen}
          onClose={() => setIsRobotDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      {contextHolder}
    </>
  );
};

export default RobotList;
