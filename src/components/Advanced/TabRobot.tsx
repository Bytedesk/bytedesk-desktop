/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-03 15:32:32
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-23 16:56:14
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import { message } from "@/AntdGlobalComp";
import { updateAgent } from "@/apis/service/agent";
import useTranslate from "@/hooks/useTranslate";
import { useAgentStore } from "@/stores/service/agent";
import { FormListActionType, ProForm, ProFormCheckbox, ProFormList, ProFormSelect, ProFormTimePicker } from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useOrgStore } from "@/stores/core/organization";
import { useIntl } from "react-intl";
import { ROBOT_TYPE_SERVICE } from "@/utils/constants";
import { queryRobotsByOrg } from "@/apis/ai/robot";
import { updateWorktime, createWorktime, deleteWorktime } from "@/apis/service/worktime";
dayjs.extend(customParseFormat)
const timeFormat = 'HH:mm:ss';

//
const TabRobot = () => {
  const [form] = ProForm.useForm();
  const intl = useIntl();
  const isLoading = useRef(false);
  const actionRef = useRef<FormListActionType<{ startTime: string; endTime: string; }>>();
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });
  const [serviceRobotList, setServiceRobotList] = useState<ROBOT.RobotResponse[]>([]);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const { translateString } = useTranslate();
  const [worktimes, setWorktimes] = useState<WORKTIME.WorktimeResponse[]>([]);
  //
  useEffect(() => {
      //
      setWorktimes(agentInfo?.leaveMsgSettings?.worktimes);
      form.setFieldValue("defaultRobot", agentInfo?.robotSettings?.defaultRobot);
      form.setFieldValue("offlineRobot", agentInfo?.robotSettings?.offlineRobot);
      form.setFieldValue("nonWorktimeRobot", agentInfo?.robotSettings?.nonWorktimeRobot);
      form.setFieldValue("robotUid", agentInfo?.robotSettings?.robot?.uid);

  }, [agentInfo]);

  const getRobots = async () => {
    if (isLoading.current) {
      console.log("isLoading: 1", isLoading.current);
      return;
    }
    isLoading.current = true;
    message.loading("loading");
    //
    const pageParams = {
      pageNumber: 0,
      pageSize: 50,
      type: ROBOT_TYPE_SERVICE,
      orgUid: currentOrg.uid
    };
    const response = await queryRobotsByOrg(pageParams);
    console.log("queryRobotsByOrg: ", response);
    if (response.data.code === 200) {
      // setRobotResult(response);
      setServiceRobotList(response.data?.data?.content);
    } else {
      message.error(response.data?.message);
    }
    isLoading.current = false;
    message.destroy();
  }

  useEffect(() => {
    getRobots();
  }, []);
  //
  const onFinish = async (values: any) => {
    console.log("onFinish:", values,);
    // const row = actionRef.current?.getList();
    // console.log('worktimes: ', row);
    message.loading(intl.formatMessage({ id: 'updating', defaultMessage: 'updating' }));
      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo.serviceSettings,
          // defaultRobot: values.defaultRobot,
          // offlineRobot: values.offlineRobot,
          // nonWorktimeRobot: values.nonWorktimeRobot,
          // robotUid: values.robotUid,
          // worktimeUids: worktimes.map((worktime) => worktime?.uid),
          quickFaqUids: agentInfo.serviceSettings?.quickFaqs?.map((button) => button.uid),
          faqUids: agentInfo.serviceSettings?.faqs?.map((faq) => faq.uid),
          guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
          hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
          shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
        },
        leaveMsgSettings: {
          ...agentInfo.leaveMsgSettings,
          worktimeUids: worktimes.map((worktime) => worktime?.uid),
        },
        robotSettings: {
          ...agentInfo.robotSettings,
          defaultRobot: values.defaultRobot,
          offlineRobot: values.offlineRobot,
          nonWorktimeRobot: values.nonWorktimeRobot,
          robotUid: values.robotUid,
        },
        maxThreadCount: values?.maxThreadCount || 10,
        autoReplySettings: {
          ...agentInfo.autoReplySettings,
        }
      };
      console.log('agentObject:', agentObject);
      //
      const response = await updateAgent(agentObject);
      console.log("updateAgent response:", response);
      if (response.data.code === 200) {
        message.destroy();
        message.success(intl.formatMessage({ id: 'update.success' }));
        setAgentInfo(response.data.data);
      } else {
        message.destroy();
        message.error(response.data.message);
      }

  };

  const transformDays = () => {
    const worktimeDays = []
    worktimes.map((worktime) => {
      worktimeDays.push({
        worktime: [dayjs(worktime.startTime, timeFormat), dayjs(worktime.endTime, timeFormat)],
      })
    });
    return worktimeDays;
  }

  const onWorktimeChange = async (_dates: any, dateStrings: [string, string], index: number) => {
    console.log(`onWorktimeChange:`, index, dateStrings);
    const worktime: WORKTIME.WorktimeRequest = {
      uid: worktimes[index]?.uid,
      startTime: dateStrings[0],
      endTime: dateStrings[1]
    }
    const response = await updateWorktime(worktime);
    console.log("updateWorktime response:", response);
    if (response.data.code === 200) {
      console.log("updateWorktime success");
    } else {
      message.error(response.data.message);
    }
  };

  const handleCreateWorktime = async () => {
    console.log("createWorktime");
    const worktime: WORKTIME.WorktimeRequest = {
      startTime: '00:00:00',
      endTime: '23:59:59',
    }
    const response = await createWorktime(worktime);
    console.log("createWorktime response:", response);
    if (response.data.code === 200) {
      setWorktimes([...worktimes, response.data.data]);
      // setWorktimeUids([...worktimeUids, response.data?.uid]);
    } else {
      message.error(response.data.message);
    }
  };

  const handleDeleteWorktime = async (index) => {
    console.log("deleteWorktime:", index, worktimes[index]?.uid);
    //
    const worktime: WORKTIME.WorktimeRequest = {
      uid: worktimes[index]?.uid,
    }
    const response = await deleteWorktime(worktime);
    console.log("deleteWorktime response:", response);
    if (response.data.code === 200) {
      setWorktimes(worktimes.filter((_, i) => i !== index));
      // setWorktimeUids(worktimeUids.filter((uid, i) => i !== index));
    } else {
      message.error(response.data.message);
    }
  };

  useEffect(() => {
    console.log("worktimes:", worktimes);
    form.setFieldValue('worktimes', transformDays());
  }, [worktimes]);


  return (
    <>
      <ProForm
        form={form}
        style={{
          marginLeft: "20px",
        }}
        onFinish={onFinish}>
        <ProFormCheckbox
          name="defaultRobot"
          width={"md"}
          // layout="vertical"
          label="默认启用机器人"
        // fieldProps={{
        //   // value: recent,
        //   onChange: onDefaultRobotChange,
        // }}
        />
        <ProFormCheckbox
          name="offlineRobot"
          width={"md"}
          // layout="vertical"
          label="无客服在线时启用机器人"
        // fieldProps={{
        //   // value: recent,
        //   onChange: onOfflineRobotChange,
        // }}
        />
        <ProFormCheckbox
          name="nonWorktimeRobot"
          width={"md"}
          // layout="vertical"
          label="非工作时间启用机器人"
        // fieldProps={{
        //   // value: recent,
        //   onChange: onNonWorktimeRobotChange,
        // }}
        />
        {/* 工作时间区间，支持多个 */}
        <ProFormList
          name="worktimes"
          style={{ marginBlockEnd: 0, width: "300px" }}
          label="工作时间区间，支持多个"
          creatorRecord={{ worktime: [dayjs('00:00:00', timeFormat), dayjs('23:59:59', timeFormat)] }}
          initialValue={
            transformDays()
          }
          // creatorButtonProps={false}
          creatorButtonProps={{
            creatorButtonText: '添加',
            icon: false,
            // type: 'link',
            style: { width: 'unset' },
          }}
          copyIconProps={false}
          deleteIconProps={{ tooltipText: '删除' }}
          itemRender={({ listDom, action }) => (
            <div
              style={{
                display: 'inline-flex',
                marginInlineEnd: 25,
              }}
            >
              {listDom}
              {action}
            </div>
          )}
          min={1}
          max={4}
          actionRef={actionRef}
          actionGuard={{
            beforeAddRow: async (defaultValue, insertIndex, _count) => {
              console.log('beforeAddRow:', defaultValue, insertIndex);
              //
              await handleCreateWorktime();

              return new Promise((resolve) => {
                // console.log(defaultValue?.name, insertIndex, count);
                // setTimeout(() => resolve(true), 1000);
                resolve(true);
              });
            },
            beforeRemoveRow: async (index, _count) => {
              console.log('beforeRemoveRow:', index);
              // const row = actionRef.current?.get(index as number);
              // console.log('--->', index, _count, row);
              await handleDeleteWorktime(index);
              //
              return new Promise((resolve) => {
                if (index === 0) {
                  resolve(false);
                  return;
                }
                // setTimeout(() => resolve(true), 1000);
                resolve(true);
              });
            },
          }}
        >
          {(_f, index, _action) => {
            // console.log(f, index, action);
            return (
              <>
                <ProFormTimePicker.RangePicker
                  width={"md"}
                  key={"worktime"}
                  name={"worktime"}
                  fieldProps={{
                    onChange: (values, formatString) => {
                      onWorktimeChange(values, formatString, index);
                    },
                    format: timeFormat,
                  }}
                />
              </>
            )
          }}
        </ProFormList>
        <ProFormSelect
          name="robotUid"
          label="客服机器人"
          width={"md"}
          options={(serviceRobotList).map((robot) => ({
            value: robot.uid,
            label: translateString(robot.nickname),
          }))}
          fieldProps={{
            allowClear: true,
            placeholder: "请选择客服机器人",
            // value: agentInfo?.serviceSettings?.robot?.uid,
            // onChange: onRobotChange,
          }}
        />

      </ProForm>
    </>
  );
};

export default TabRobot;
