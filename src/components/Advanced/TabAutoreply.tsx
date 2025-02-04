/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-25 09:26:57
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 23:18:27
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { updateAgent } from "@/apis/service/agent";
import { queryKbasesByOrg } from "@/apis/kbase/kbase";
import useTranslate from "@/hooks/useTranslate";
import { useAgentStore } from "@/stores/service/agent";
import { useOrgStore } from "@/stores/core/organization";
import {
  AUTO_REPLY_TYPE_FIXED,
  AUTO_REPLY_TYPE_KEYWORD,
  AUTO_REPLY_TYPE_LLM,
  KB_TYPE_KEYWORD,
  KB_TYPE_LLM,
  MESSAGE_TYPE_AUDIO,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_VIDEO
} from "@/utils/constants";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ProForm, ProFormSelect, ProFormSwitch, ProFormTextArea } from "@ant-design/pro-components";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { queryAutoRepliesByOrg } from "@/apis/kbase/autoreply";

// 自动回复
const TabAutoreply = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [form] = ProForm.useForm();
  const { translateString } = useTranslate();
  const [autoReplyResult, setAutoReplyResult] = useState<AUTOREPLY.HttpPageResult>();
  const [kbaseResult, setKbaseResult] = useState<KBASE.HttpPageResult>();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });
  // const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [autoReplyType, setAutoReplyType] = useState(AUTO_REPLY_TYPE_FIXED);

  const getAutoReplies = async () => {
    message.loading(intl.formatMessage({ id: "loading", defaultMessage: "Loading" }));
    const pageParam: AUTOREPLY.AutoReplyRequest = {
      pageNumber: 0,
      pageSize: 50,
      orgUid: currentOrg.uid,
    };
    const response = await queryAutoRepliesByOrg(pageParam);
    console.log("getAutoReplies response:", pageParam, response);
    message.destroy();
    if (response.data.code === 200) {
      setAutoReplyResult(response.data);
    } else {
      message.error(response.data.message);
    }
  }
  useEffect(() => {
    getAutoReplies();
  }, [])

  const getKeywordBase = async () => {
    message.loading(intl.formatMessage({ id: "loading", defaultMessage: "Loading" }));
    const pageParam: KBASE.KbaseRequest = {
      pageNumber: 0,
      pageSize: 50,
      type: autoReplyType === AUTO_REPLY_TYPE_KEYWORD ? KB_TYPE_KEYWORD : KB_TYPE_LLM,
      orgUid: currentOrg.uid,
    };
    const response = await queryKbasesByOrg(pageParam);
    console.log("getKeywordBase response:", pageParam, response);
    message.destroy();
    if (response.data.code === 200) {
      setKbaseResult(response.data);
    } else {
      message.error(response.data.message);
    }
  }
  useEffect(() => {
    getKeywordBase();
  }, [autoReplyType])

  useEffect(() => {

      // setAutoReplyEnabled(agentInfo?.autoReplySettings?.autoReplyEnabled);
      setAutoReplyType(agentInfo?.autoReplySettings?.autoReplyType);
      //
      form.setFieldsValue({
        autoReplyEnabled: agentInfo?.autoReplySettings?.autoReplyEnabled,
        autoReplyType: agentInfo?.autoReplySettings?.autoReplyType,
        //
        autoReplyUid: agentInfo?.autoReplySettings?.autoReplyUid,
        autoReplyContentType: agentInfo?.autoReplySettings?.autoReplyContentType,
        autoReplyContent: agentInfo?.autoReplySettings?.autoReplyContent,
        //
        kbUid: agentInfo?.autoReplySettings?.kbUid,
      });
      //
      form.setFieldValue('autoReplyUid', agentInfo?.autoReplySettings?.autoReplyContent);
  }, [agentInfo,])

  const handleAutoReplyTypeChange = (value: any, options: any) => {
    console.log("handleAutoReplyTypeChange:", value, options);
    setAutoReplyType(value);
  }
  //
  const handleAutoReplySelectChange = (value: any, options: any) => {
    console.log("handleAutoReplySelectChange:", value, options);
    autoReplyResult?.data.content?.forEach((item: AUTOREPLY.AutoReplyResponse) => {
      if (item.uid === value) {
        form.setFieldsValue({
          autoReplyContentType: item.type,
          autoReplyContent: item.content
        })
      }
    });
  }

  const handleAutoReplySubmit = async (values: any) => {
    console.log('handleAutoReplySubmit:', values);
      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo?.serviceSettings,
          // robotUid: agentInfo?.serviceSettings?.robot?.uid,
          quickFaqUids: agentInfo?.serviceSettings?.quickFaqs?.map((button) => button.uid),
          faqUids: agentInfo?.serviceSettings?.faqs?.map((item) => item.uid),
          guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
          hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
          shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
          // worktimeUids: agentInfo?.serviceSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        robotSettings: {
          ...agentInfo.robotSettings,
          robotUid: agentInfo?.robotSettings?.robot?.uid,
        },
        leaveMsgSettings: {
          ...agentInfo.leaveMsgSettings,
          worktimeUids: agentInfo?.leaveMsgSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        autoReplySettings: {
          ...agentInfo.autoReplySettings,
          autoReplyEnabled: values.autoReplyEnabled,
          autoReplyType: values.autoReplyType,
          autoReplyUid: values.autoReplyUid,
          autoReplyContentType: values.autoReplyContentType,
          autoReplyContent: values.autoReplyContent,
          kbUid: values.kbUid,
        }
      }
      console.log("agentObject:", agentObject);
      // //
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

  const handleAutoReplyEnabledChange = async (checked: boolean) => {
    console.log('handleAutoReplyEnabledChange:', checked)
      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo?.serviceSettings,
          // robotUid: agentInfo?.serviceSettings?.robot?.uid,
          quickFaqUids: agentInfo?.serviceSettings?.quickFaqs?.map((button) => button.uid),
          faqUids: agentInfo?.serviceSettings?.faqs?.map((item) => item.uid),
          guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
          hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
          shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
          // worktimeUids: agentInfo?.serviceSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        robotSettings: {
          ...agentInfo.robotSettings,
          robotUid: agentInfo?.robotSettings?.robot?.uid,
        },
        leaveMsgSettings: {
          ...agentInfo.leaveMsgSettings,
          worktimeUids: agentInfo?.leaveMsgSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        autoReplySettings: {
          ...agentInfo.autoReplySettings,
          autoReplyEnabled: checked
        }
      }
      console.log("agentObject:", agentObject);
      // //
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

  return (
    <>
      <ProForm
        form={form}
        onFinish={handleAutoReplySubmit}
      // submitter={{
      //   render: false
      // }}
      >
        <ProFormSwitch
          width={'md'}
          name={'autoReplyEnabled'}
          label={'是否启用自动回复'}
          fieldProps={{
            onChange: handleAutoReplyEnabledChange
          }}
        />
        <ProFormSelect
          width={'md'}
          name={"autoReplyType"}
          label={'自动回复类型'}
          options={[
            { label: "固定回复", value: AUTO_REPLY_TYPE_FIXED },
            { label: "关键字匹配", value: AUTO_REPLY_TYPE_KEYWORD },
            { label: "大模型回复", value: AUTO_REPLY_TYPE_LLM },
          ]}
          fieldProps={{
            onChange(value, option) {
              // console.log('onChange:', value, option);
              handleAutoReplyTypeChange(value, option);
            },
          }}
        />
        {
          autoReplyType === AUTO_REPLY_TYPE_FIXED && <>
            <ProForm.Item>
              <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
                navigate('/kb/autoreply/data')
              }}>添加固定回复内容</Button>
            </ProForm.Item>
            <ProFormSelect
              width={'md'}
              name={'autoReplyUid'}
              label={'选择固定回复内容'}
              options={autoReplyResult?.data?.content.map((item) => {
                return {
                  label: translateString(item.content),
                  value: item.uid
                }
              })}
              fieldProps={{
                onChange(value, option) {
                  // console.log('onChange:', value, option);
                  handleAutoReplySelectChange(value, option);
                },
              }}
            />
            <ProFormSelect
              width={'md'}
              name={'autoReplyContentType'}
              label={'固定回复类型'}
              options={[
                { label: "文本", value: MESSAGE_TYPE_TEXT },
                { label: "图片", value: MESSAGE_TYPE_IMAGE },
                { label: "视频", value: MESSAGE_TYPE_VIDEO },
                { label: "音频", value: MESSAGE_TYPE_AUDIO },
                { label: "文件", value: MESSAGE_TYPE_FILE },
              ]}
              disabled
            />
            <ProFormTextArea
              width={'md'}
              name={'autoReplyContent'}
              label={'固定回复内容'}
              disabled
            />
          </>
        }
        {
          autoReplyType === AUTO_REPLY_TYPE_KEYWORD && <>
            <ProForm.Item>
              <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
                navigate('/kb/keyword/data')
              }}>添加关键词知识库</Button>
            </ProForm.Item>
            <ProFormSelect
              width={'md'}
              name={'kbUid'}
              label={'选择关键词知识库'}
              options={kbaseResult?.data.content.map((item) => {
                return {
                  label: translateString(item.name),
                  value: item.uid
                }
              })}
            />
          </>
        }
        {
          autoReplyType === AUTO_REPLY_TYPE_LLM && <>
            <ProForm.Item>
              <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
                navigate('/kb/llm/data')
              }}>添加大模型知识库</Button>
            </ProForm.Item>
            <ProFormSelect
              width={'md'}
              name={'kbUid'}
              label={'选择大模型知识库库'}
              options={kbaseResult?.data.content.map((item) => {
                return {
                  label: translateString(item.name),
                  value: item.uid
                }
              })}
            />
          </>
        }
      </ProForm>
    </>
  );
};

export default TabAutoreply;
