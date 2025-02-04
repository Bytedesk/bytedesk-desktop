/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 15:24:12
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:01:32
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
import { updateAgentAutoReply } from "@/apis/service/agent";
import { queryAutoRepliesByUser } from "@/apis/kbase/autoreply";
import { queryKbasesByOrg } from "@/apis/kbase/kbase";
import useTranslate from "@/hooks/useTranslate";
import { useAgentStore } from "@/stores/service/agent";
import { useOrgStore } from "@/stores/core/organization";
import {
  AUTO_REPLY_TYPE_FIXED,
  AUTO_REPLY_TYPE_KEYWORD,
  AUTO_REPLY_TYPE_LLM,
  API_BASE_URL,
  KB_TYPE_KEYWORD,
  KB_TYPE_LLM,
  MESSAGE_TYPE_AUDIO,
  MESSAGE_TYPE_FILE,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_VIDEO
} from "@/utils/constants";
import { openUrl } from "@/utils/electronApiUtils";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ProForm, ProFormSelect, ProFormSwitch, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { AppContext } from "@/context/AppContext";

type AutoReplyModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const AutoReplyModel = ({ open, onOk, onCancel }: AutoReplyModelProps) => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const { isLoggedIn, hasRoleAgent } = useContext(AppContext);
  const { translateString } = useTranslate();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const [autoReplyResult, setAutoReplyResult] = useState<AUTOREPLY.HttpPageResult>();
  const [kbaseResult, setKbaseResult] = useState<KBASE.HttpPageResult>();
  const [autoReplyType, setAutoReplyType] = useState(AUTO_REPLY_TYPE_FIXED);
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    }
  })
  // 
  const getAutoReplies = async () => {
    // 未登录或当前组织为空或无agent权限，则不获取工作组
    if (!isLoggedIn || currentOrg?.uid === "" || !hasRoleAgent) {
      return;
    }
    message.loading(
      intl.formatMessage({ id: "loading", defaultMessage: "Loading" }),
    );
    const pageParam: AUTOREPLY.AutoReplyRequest = {
      pageNumber: 0,
      pageSize: 50,
      orgUid: currentOrg.uid,
    };
    const response = await queryAutoRepliesByUser(pageParam);
    console.log("getAutoReplies response:", pageParam, response);
    message.destroy();
    if (response.data.code === 200) {
      setAutoReplyResult(response.data);
    } else {
      message.error(response.data.message);
    }
  };
  useEffect(() => {
    getAutoReplies();
    // 
    if (form) {
      form.setFieldsValue({
        enabled: agentInfo.autoReplySettings?.autoReplyEnabled,
        autoReplyType: agentInfo.autoReplySettings?.autoReplyType || "",
        autoReplyUid: agentInfo.autoReplySettings?.autoReplyUid || "",
        autoReplyContent: agentInfo.autoReplySettings?.autoReplyContent || "",
        autoReplyContentType:
          agentInfo.autoReplySettings?.autoReplyContentType || "",
        kbUid: agentInfo.autoReplySettings?.kbUid || "",
      });
    }
  }, [form]);
  // 
  const getKeywordBase = async () => {
    // 未登录或当前组织为空或无agent权限，则不获取工作组
    if (!isLoggedIn || currentOrg?.uid === "" || !hasRoleAgent) {
      return;
    }
    // 
    message.loading(
      intl.formatMessage({ id: "loading", defaultMessage: "Loading" }),
    );
    const pageParam: KBASE.KbaseRequest = {
      pageNumber: 0,
      pageSize: 50,
      type:
        autoReplyType === AUTO_REPLY_TYPE_KEYWORD
          ? KB_TYPE_KEYWORD
          : KB_TYPE_LLM,
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
  };
  useEffect(() => {
    getKeywordBase();
  }, [autoReplyType]);
  // 
  const handleAutoReplyEnabledChange = async (checked: boolean) => {
    console.log('handleAutoReplyEnabledChange:', checked)
  }
  const handleAutoReplyTypeChange = (value: string, options) => {
    console.log("handleAutoReplyTypeChange:", value, options);
    setAutoReplyType(value);
  };
  //
  const handleAutoReplySelectChange = (value: string, options) => {
    console.log("handleAutoReplySelectChange:", value, options);
    autoReplyResult?.data.content?.forEach(
      (item: AUTOREPLY.AutoReplyResponse) => {
        if (item.uid === value) {
          form.setFieldsValue({
            autoReplyContentType: item.type,
            autoReplyContent: item.content,
          });
        }
      },
    );
  };
  // 
  const handleUpdateAutoReply = async () => {
    console.log('handleUpdateAutoReply:')
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
        onOk={handleUpdateAutoReply}
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
                value: AUTO_REPLY_TYPE_LLM 
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
                name={"autoReplyUid"}
                label={intl.formatMessage({
                  id: 'autoreply.fixed.select',
                  defaultMessage: '选择固定回复内容'
                })}
                options={autoReplyResult?.data?.content.map((item) => {
                  return {
                    label: translateString(item.content),
                    value: item.uid,
                  };
                })}
                fieldProps={{
                  onChange(value, option) {
                    handleAutoReplySelectChange(value as string, option);
                  },
                }}
              />
              <ProFormSelect
                width={"md"}
                name={"autoReplyContentType"}
                label={intl.formatMessage({
                  id: 'autoreply.fixed.type',
                  defaultMessage: '固定回复类型'
                })}
                options={[
                  { 
                    label: intl.formatMessage({id: 'autoreply.content.text'}), 
                    value: MESSAGE_TYPE_TEXT 
                  },
                  { 
                    label: intl.formatMessage({id: 'autoreply.content.image'}), 
                    value: MESSAGE_TYPE_IMAGE 
                  },
                  { 
                    label: intl.formatMessage({id: 'autoreply.content.video'}), 
                    value: MESSAGE_TYPE_VIDEO 
                  },
                  { 
                    label: intl.formatMessage({id: 'autoreply.content.audio'}), 
                    value: MESSAGE_TYPE_AUDIO 
                  },
                  { 
                    label: intl.formatMessage({id: 'autoreply.content.file'}), 
                    value: MESSAGE_TYPE_FILE 
                  },
                ]}
                disabled
              />
              <ProFormTextArea
                width={"md"}
                name={"autoReplyContent"}
                label={intl.formatMessage({
                  id: 'autoreply.fixed.content',
                  defaultMessage: '固定回复内容'
                })}
                disabled
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
