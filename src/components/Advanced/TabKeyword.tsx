/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-05 18:55:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:38:40
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
import { updateRobot } from "@/apis/ai/robot";
import useTranslate from "@/hooks/useTranslate";
import { useRobotStore } from "@/stores/ai/robot";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ProForm, ProFormSwitch, ProFormTextArea } from "@ant-design/pro-components";
import { Button } from "antd";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

//
const TabKeyword = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const [form] = ProForm.useForm();
    const { translateString } = useTranslate();
    const { currentRobot, setCurrentRobot } = useRobotStore((state) => {
        return {
            currentRobot: state.currentRobot,
            setCurrentRobot: state.setCurrentRobot,
        };
    });
    //
    useEffect(() => {
        form.setFieldValue("enabled", !currentRobot?.llm?.enabled);
        form.setFieldValue("defaultReply", currentRobot?.defaultReply);
    }, [currentRobot])

    const handleSubmit = async () => {
        form.validateFields().then(async values => {
            console.log('TabKeyword handleSubmit', values);
            //
            message.loading(intl.formatMessage({ id: 'updating' }));
            const robotObject: ROBOT.RobotRequest = {
                ...currentRobot,
                serviceSettings: {
                    ...currentRobot?.serviceSettings,
                    faqUids: currentRobot?.serviceSettings?.faqs?.map((faq) => faq.uid),
                    quickFaqUids: currentRobot?.serviceSettings?.quickFaqs?.map((button) => button.uid),
                    guessFaqUids: currentRobot?.serviceSettings?.guessFaqs?.map((item) => item.uid),
                    hotFaqUids: currentRobot?.serviceSettings?.hotFaqs?.map((item) => item.uid),
                    shortcutFaqUids: currentRobot?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
                },
                llm: {
                    ...currentRobot?.llm,
                    enabled: !values["enabled"],
                },
                defaultReply: values["defaultReply"],
            }
            console.log("robotObject:", robotObject);
            const response = await updateRobot(robotObject);
            console.log("updateRobot response:", response);
            if (response.data.code === 200) {
                message.destroy();
                message.success(intl.formatMessage({ id: 'update.success' }));
                setCurrentRobot(response.data.data);
            } else {
                message.destroy();
                message.error(response.data.message);
            }
        }).catch(errorInfo => {
            console.log('Form errors:', errorInfo);
        });
    };

    const handleEnableChange = async (checked: boolean) => {
        console.log('TabKeyword handleEnableChange', checked);
        //
        message.loading(intl.formatMessage({ id: 'updating' }));
        const robotObject: ROBOT.RobotResponse = {
            ...currentRobot,
            serviceSettings: {
                ...currentRobot?.serviceSettings,
                quickFaqUids: currentRobot?.serviceSettings?.quickFaqs?.map(
                    (quickButton) => quickButton.uid,
                ),
                faqUids: currentRobot?.serviceSettings?.faqs?.map((faq) => faq.uid),
                guessFaqUids: currentRobot?.serviceSettings?.guessFaqs?.map(
                    (guessFaq) => guessFaq.uid,
                ),
                hotFaqUids: currentRobot?.serviceSettings?.hotFaqs?.map(
                    (hotFaq) => hotFaq.uid,
                ),
                shortcutFaqUids: currentRobot?.serviceSettings?.shortcutFaqs?.map(
                    (shortcutFaq) => shortcutFaq.uid,
                ),
            },
            llm: {
                ...currentRobot?.llm,
                enabled: !checked,
            },
        }
        console.log("robotObject:", robotObject);
        const response = await updateRobot(robotObject);
        console.log("updateRobot response:", response);
        if (response.data.code === 200) {
            message.destroy();
            message.success(intl.formatMessage({ id: 'update.success' }));
            setCurrentRobot(response.data.data);
        } else {
            message.destroy();
            message.error(response.data.message);
        }
    };

    return (
        <>
            <ProForm
                form={form}
                onFinish={handleSubmit}
            // submitter={false}
            // initialValues={{
            //     enabled: !currentRobot?.llm?.enabled,
            //     defaultReply: translateString(currentRobot?.defaultReply),
            // }}
            >
                <ProFormSwitch
                    label="是否启用关键词"
                    name={'enabled'}
                    tooltip={"启用关键字后，将会关闭大模型。用户在发送消息时，如果消息内容包含关键字，则机器人将匹配关键字并自动回复。"}
                    fieldProps={{
                        // defaultValue: true,
                        onChange: handleEnableChange,
                    }}
                />
                <ProForm.Item>
                    <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
                        navigate('/kb/keyword/data')
                    }}>添加关键字</Button>
                </ProForm.Item>
                {/*  */}
                <ProFormTextArea
                    width={'lg'}
                    label="未匹配回复语"
                    name={'defaultReply'}
                />

            </ProForm>
        </>
    );
};
export default TabKeyword;
