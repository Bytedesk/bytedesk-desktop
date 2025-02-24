/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 15:24:12
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-24 20:44:59
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { updateAgent, updateAgentAutoReply } from "@/apis/service/agent";
import { queryKbasesByOrg } from "@/apis/kbase/kbase";
import useTranslate from "@/hooks/useTranslate";
import { useAgentStore } from "@/stores/service/agent";
import { useOrgStore } from "@/stores/core/organization";
import {
  AUTO_REPLY_TYPE_FIXED,
  AUTO_REPLY_TYPE_KEYWORD,
  AUTO_REPLY_TYPE_LLM,
  API_BASE_URL,
  KB_TYPE_LLM,
  KB_TYPE_AUTOREPLY,
  IS_DEBUG
} from "@/utils/constants";
import { openUrl } from "@/utils/electronApiUtils";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ProForm, ProFormSelect, ProFormSwitch } from "@ant-design/pro-components";
import { Button, Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { queryAutoReplyFixedByOrg } from "@/apis/kbase/autoreply_fixed";

type AutoReplyModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const AutoReplyModel = ({ open, onOk, onCancel }: AutoReplyModelProps) => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  // const { isLoggedIn, hasRoleAgent } = useContext(AppContext);
  const { translateString } = useTranslate();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const [autoReplyResult, setAutoReplyResult] = useState<AUTOREPLY_FIXED.HttpPageResult>();
  const [kbaseResult, setKbaseResult] = useState<KBASE.HttpPageResult>();
  const [autoReplyType, setAutoReplyType] = useState(AUTO_REPLY_TYPE_FIXED);
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    }
  })
  // 
  // Memoize API calls
  const getAutoReplyFixed = useCallback(async () => {
    try {
      message.loading(intl.formatMessage({ id: "loading" }));
      const pageParam: AUTOREPLY_FIXED.AutoReplyFixedRequest = {
        pageNumber: 0,
        pageSize: 50,
        orgUid: currentOrg?.uid,
        type: autoReplyType,
      };
      const response = await queryAutoReplyFixedByOrg(pageParam);
      console.log("getAutoReplyFixed response:", response);
      if (response.data.code === 200) {
        setAutoReplyResult(response.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching auto replies:", error);
      message.error(intl.formatMessage({ id: "error.fetch.failed" }));
    } finally {
      message.destroy();
    }
  }, [currentOrg?.uid]);

  const getKeywordBase = useCallback(async (type: string) => {
    try {
      message.loading(intl.formatMessage({ id: "loading" }));
      const pageParam: KBASE.KbaseRequest = {
        pageNumber: 0,
        pageSize: 50,
        type: type,
        orgUid: currentOrg?.uid,
      };
      const response = await queryKbasesByOrg(pageParam);
      console.log("getKeywordBase response:", response);
      if (response.data.code === 200) {
        setKbaseResult(response.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
      message.error(intl.formatMessage({ id: "error.fetch.failed" }));
    } finally {
      message.destroy();
    }
  }, [autoReplyType, currentOrg?.uid]);

  // Setup effects
  useEffect(() => {
    getAutoReplyFixed();
    getKeywordBase(KB_TYPE_AUTOREPLY);
    // getKeywordBase(KB_TYPE_LLM);
  }, []);

  useEffect(() => {
    if (autoReplyType === AUTO_REPLY_TYPE_KEYWORD) {
      getKeywordBase(KB_TYPE_AUTOREPLY);
    } else if (autoReplyType === AUTO_REPLY_TYPE_LLM) {
      getKeywordBase(KB_TYPE_LLM);
    }
  }, [autoReplyType]);

  // Initialize form values
  useEffect(() => {
    if (agentInfo?.autoReplySettings) {
      form.setFieldsValue({
        kbUid: agentInfo?.autoReplySettings?.kbUid,
        autoReplyEnabled: agentInfo?.autoReplySettings?.autoReplyEnabled,
        autoReplyType: agentInfo?.autoReplySettings?.autoReplyType,
        autoReplyUid: agentInfo?.autoReplySettings?.autoReplyUid,
        autoReplyContent: agentInfo?.autoReplySettings?.autoReplyContent,
      });
    }
  }, [agentInfo?.autoReplySettings, form]);

  const handleAutoReplyTypeChange = (value: any, options: any) => {
    console.log("handleAutoReplyTypeChange:", value, options);
    setAutoReplyType(value);
  }
  //
  const handleAutoReplySelectChange = (value: any, options: any) => {
    console.log("handleAutoReplySelectChange:", value, options);
    autoReplyResult?.data.content?.forEach((item: AUTOREPLY_FIXED.AutoReplyFixedResponse) => {
      if (item.uid === value) {
        form.setFieldsValue({
          autoReplyContentType: item.type,
          autoReplyContent: item.content
        })
      }
    });
  }
  // 
  const handleAutoReplySubmit = async () => {
    console.log('handleAutoReplySubmit:')
    message.loading(intl.formatMessage({
      id: 'autoreply.save.loading',
      defaultMessage: '正在保存，请稍后...'
    }));
    const agent: AGENT.AgentRequest = {
      ...agentInfo,
      autoReplySettings: {
        ...agentInfo.autoReplySettings,
        autoReplyEnabled: form.getFieldValue("enabled"),
        autoReplyType: form.getFieldValue("autoReplyType"),
        autoReplyUid: form.getFieldValue("autoReplyUid"),
        autoReplyContent: form.getFieldValue("autoReplyContent"),
        autoReplyContentType: form.getFieldValue("autoReplyContentType"),
        kbUid: form.getFieldValue("kbUid"),
      },
    };
    const response = await updateAgentAutoReply(agent);
    console.log('handleUpdateAutoReply:', response);
    if (response.data.code === 200) {
      message.destroy();
      setAgentInfo(response.data.data);
      onOk();
    } else {
      message.destroy();
      message.error(intl.formatMessage({
        id: 'autoreply.save.error',
        defaultMessage: '保存失败'
      }));
    }
  }

  const handleAutoReplyEnabledChange = async (checked: boolean) => {
    console.log('handleAutoReplyEnabledChange:', checked)
      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo?.serviceSettings,
          quickFaqUids: agentInfo?.serviceSettings?.quickFaqs?.map((button) => button.uid),
          faqUids: agentInfo?.serviceSettings?.faqs?.map((item) => item.uid),
          guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
          hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
          shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
        },
        robotSettings: {
          ...agentInfo?.robotSettings,
          robotUid: agentInfo?.robotSettings?.robot?.uid,
        },
        leaveMsgSettings: {
          ...agentInfo?.leaveMsgSettings,
          worktimeUids: agentInfo?.leaveMsgSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        autoReplySettings: {
          ...agentInfo?.autoReplySettings,
          autoReplyEnabled: checked
        }
      }
      console.log("agentObject:", agentObject);
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

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        title={intl.formatMessage({
          id: 'autoreply.title',
          defaultMessage: '自动回复'
        })}
        open={open}
        forceRender
        onOk={handleAutoReplySubmit}
        onCancel={handleCancel}
      >
        <ProForm
          form={form}
          submitter={{
            render: false,
          }}
        >
          <ProFormSwitch
            width={"md"}
            name={"enabled"}
            label={intl.formatMessage({
              id: 'autoreply.enable.label',
              defaultMessage: '是否启用自动回复'
            })}
            fieldProps={{
              onChange: handleAutoReplyEnabledChange,
            }}
          />
          <ProFormSelect
            width={"md"}
            name={"autoReplyType"}
            label={intl.formatMessage({
              id: 'autoreply.type.label',
              defaultMessage: '自动回复类型'
            })}
            options={[
              { 
                label: intl.formatMessage({id: 'autoreply.type.fixed'}), 
                value: AUTO_REPLY_TYPE_FIXED 
              },
              { 
                label: intl.formatMessage({id: 'autoreply.type.keyword'}), 
                value: AUTO_REPLY_TYPE_KEYWORD 
              },
              { 
                label: intl.formatMessage({id: 'autoreply.type.llm'}), 
                value: AUTO_REPLY_TYPE_LLM,
                disabled: !IS_DEBUG
              },
            ]}
            fieldProps={{
              onChange(value, option) {
                handleAutoReplyTypeChange(value as string, option);
              },
            }}
          />
          {autoReplyType === AUTO_REPLY_TYPE_FIXED && (
            <>
              <ProForm.Item>
                <Button
                  key="github"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    openUrl(`${API_BASE_URL}/admin/kb/autoreply/data`);
                  }}
                >
                  {intl.formatMessage({
                    id: 'autoreply.fixed.add',
                    defaultMessage: '添加固定回复内容'
                  })}
                </Button>
              </ProForm.Item>
              <ProFormSelect
                width={"md"}
                name={"autoReplyContent"}
                label={intl.formatMessage({
                  id: 'autoreply.fixed.select',
                  defaultMessage: '选择固定回复内容'
                })}
                options={autoReplyResult?.data?.content.map((item) => {
                  return {
                    label: translateString(item?.content),
                    value: item?.content,
                  };
                })}
                fieldProps={{
                  onChange(value, option) {
                    handleAutoReplySelectChange(value as string, option);
                  },
                }}
              />
            </>
          )}
          {autoReplyType === AUTO_REPLY_TYPE_KEYWORD && (
            <>
              <ProForm.Item>
                <Button
                  key="github"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    openUrl(`${API_BASE_URL}/admin/kb/keyword/data`);
                  }}
                >
                  {intl.formatMessage({
                    id: 'autoreply.keyword.add',
                    defaultMessage: '添加关键词知识库'
                  })}
                </Button>
              </ProForm.Item>
              <ProFormSelect
                width={"md"}
                name={"kbUid"}
                label={intl.formatMessage({
                  id: 'autoreply.keyword.select',
                  defaultMessage: '选择关键词知识库'
                })}
                options={kbaseResult?.data.content.map((item) => {
                  return {
                    label: translateString(item.name),
                    value: item.uid,
                  };
                })}
              />
            </>
          )}
          {autoReplyType === AUTO_REPLY_TYPE_LLM && (
            <>
              <ProForm.Item>
                <Button
                  key="github"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    openUrl(`${API_BASE_URL}/admin/kb/llm/data`);
                  }}
                >
                  {intl.formatMessage({
                    id: 'autoreply.llm.add',
                    defaultMessage: '添加大模型知识库'
                  })}
                </Button>
              </ProForm.Item>
              <ProFormSelect
                width={"md"}
                name={"kbUid"}
                label={intl.formatMessage({
                  id: 'autoreply.llm.select',
                  defaultMessage: '选择大模型知识库'
                })}
                options={kbaseResult?.data.content.map((item) => {
                  return {
                    label: translateString(item.name),
                    value: item.uid,
                  };
                })}
              />
            </>
          )}
        </ProForm>
      </Modal>
    </>
  );
};

export default AutoReplyModel;
