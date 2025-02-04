/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-25 09:26:13
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-23 17:12:57
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
import { useAgentStore } from "@/stores/service/agent";
import { IS_DEBUG } from "@/utils/constants";
import { ProForm, ProFormDigit, ProFormSwitch } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

// 评价
const TabRate = () => {
    const intl = useIntl();
    const [form] = ProForm.useForm();
    const [showRateBtn, setShowRateBtn] = useState(false);
    const { agentInfo, setAgentInfo } = useAgentStore((state) => {
        return {
            agentInfo: state.agentInfo,
            setAgentInfo: state.setAgentInfo,
        };
    });

    useEffect(() => {

        form.setFieldValue('showRateBtn', agentInfo?.serviceSettings?.showRateBtn);

    }, [agentInfo])

    const handleShowRateSwitchChange = async (checked: boolean) => {
        console.log('handleShowRateSwitchChange:', checked)
        const agentObject: AGENT.AgentRequest = {
            ...agentInfo,
            serviceSettings: {
                ...agentInfo?.serviceSettings,
                showRateBtn: checked,
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
                submitter={{
                    render: false
                }}
            >
                <ProFormSwitch
                    width={'md'}
                    name={'showRateBtn'}
                    label={'访客端是否显示评价按钮'}
                    fieldProps={{
                        onChange: handleShowRateSwitchChange
                    }}
                />
                {
                    IS_DEBUG && showRateBtn && (
                        <ProFormDigit
                            width={'lg'}
                            label="最低消息数"
                            name={'rateMsgCount'}
                            min={0}
                            max={10}
                            fieldProps={{ precision: 0, step: 1 }}
                            rules={[
                                { required: true, message: "请输入最低消息数" },
                            ]}
                        />
                    )
                }
            </ProForm>
        </>
    );
}
export default TabRate;
