/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-14 11:21:46
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-23 17:12:45
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
import useTranslate from "@/hooks/useTranslate";
import { useOrgStore } from "@/stores/core/organization";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ProForm, ProFormSelect, ProFormSwitch } from "@ant-design/pro-components";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useAgentStore } from "@/stores/service/agent";
import { updateAgent } from "@/apis/service/agent";
// import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { queryFaqsByOrg } from "@/apis/kbase/faq";
import { getAdminUrl } from "@/utils/configUtils";
import { openUrl } from "@/utils/electronApiUtils";

// 快捷路径
const TabFaqShortcut = () => {
    // https://umijs.org/docs/max/access
    const [form] = ProForm.useForm();
    const intl = useIntl();
    // const navigate = useNavigate();
    const { translateString } = useTranslate();
    const currentOrg = useOrgStore((state) => state.currentOrg);
    const [faqResult, setFaqResult] = useState<FAQ.HttpPageResult>()
    const { agentInfo, setAgentInfo } = useAgentStore((state) => {
        return {
            agentInfo: state.agentInfo,
            setAgentInfo: state.setAgentInfo,
        };
    });

    const getFaqs = async () => {
        message.loading(intl.formatMessage({ id: "loading", defaultMessage: "Loading" }));
        const pageParam: FAQ.FaqRequest = {
            pageNumber: 0,
            pageSize: 50,
            orgUid: currentOrg.uid,
        };
        const response = await queryFaqsByOrg(pageParam);
        console.log("getAllFaqs response:", pageParam, response);
        message.destroy();
        if (response.data.code === 200) {
            setFaqResult(response.data);
        } else {
            message.error(response.data.message);
        }
        //
    }

    useEffect(() => {
        getFaqs();
    }, [currentOrg]);

    useEffect(() => {
        //
        form.setFieldsValue({
            showShortcutFaqs: agentInfo?.serviceSettings?.showShortcutFaqs,
            shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((button) => button.uid) || [],
        });

    }, [agentInfo]);

    const onFinish = async (values: any) => {
        console.log("onFinish", values);

        const agentObject: AGENT.AgentRequest = {
            ...agentInfo,
            serviceSettings: {
                ...agentInfo?.serviceSettings,
                showShortcutFaqs: values.showShortcutFaqs,
                shortcutFaqUids: values.shortcutFaqUids,
                // robotUid: agentInfo?.serviceSettings?.robot?.uid,
                quickFaqUids: agentInfo?.serviceSettings?.quickFaqs?.map((button) => button.uid),
                guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
                hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
                faqUids: agentInfo?.serviceSettings?.faqs?.map((item) => item.uid),
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

    }

    const handleChange = async (checked: boolean) => {
        console.log('TabFaqShortcut handleChange', checked);
    }

    return (
        <div>
            <ProForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <ProFormSwitch
                    label="是否显示快捷路径"
                    name={'showShortcutFaqs'}
                    fieldProps={{
                        onChange: handleChange
                    }}
                />
                <ProForm.Item>
                    <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
                        openUrl(getAdminUrl() + '/kb/faq/data');
                    }}>添加常见问题</Button>
                </ProForm.Item>
                <ProFormSelect
                    name="shortcutFaqUids"
                    width={"md"}
                    label={intl.formatMessage({ id: "pages.advanced.faqShortcut" })}
                    // tooltip={intl.formatMessage({ id: "faqTip" })}
                    options={faqResult?.data?.content.map((item: FAQ.FaqResponse) => {
                        return {
                            label: translateString(item.question),
                            value: item.uid,
                        };
                    })}
                    fieldProps={{
                        mode: "multiple",
                        // onChange: handleChange,
                        allowClear: true,
                        // value: currentRobot?.serviceSettings?.faqs?.map((item) => item.uid),
                        // value: defaultOptions,
                        placeholder: <FormattedMessage id="choose" defaultMessage="Choose" />,
                    }}
                />
            </ProForm>
        </div>
    );
};
export default TabFaqShortcut;
