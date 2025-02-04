/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-12-27 10:15:55
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 16:49:19
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
import { createThread, queryRobotsByOrg } from "@/apis/ai/robot";
import useTranslate from "@/hooks/useTranslate";
import { useOrgStore } from "@/stores/core/organization";
import { useThreadStore } from "@/stores/core/thread";
import { useUserStore } from "@/stores/core/user";
import { HTTP_CLIENT, 
    LEVEL_TYPE_ORGANIZATION, 
    ROBOT_TYPE_LLM, 
    THREAD_TYPE_LLM, 
    TOPIC_ORG_ROBOT_PREFIX, 
    USER_TYPE_USER 
} from "@/utils/constants";
import { Button, List, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
//
type CreateRobotProps = {
    open: boolean;
    onSubmit: () => void;
    onCancel: () => void;
};

const CreateRobot = ({ open, onSubmit, onCancel }: CreateRobotProps) => {
    const isLoading = useRef(false);
    const intl = useIntl();
    //   const { isDarkMode } = useTheme();
    const { translateString } = useTranslate();
    const [robotResult, setRobotResult] = useState<ROBOT.HttpPageResult>();
    const currentOrg = useOrgStore((state) => state.currentOrg);
    const addThread = useThreadStore((state) => state.addThread);
    const setCurrentThread = useThreadStore((state) => state.setCurrentThread);
    const userInfo = useUserStore((state) => state.userInfo);

    const getRobots = async () => {
        if (isLoading.current) {
            console.log("isLoading: 1", isLoading.current);
            return;
        }
        isLoading.current = true;
        message.loading("loading");
        //
        const pageParams: ROBOT.RobotRequest = {
            pageNumber: 0,
            pageSize: 100,
            //
            orgUid: currentOrg?.uid,
            categoryUid: "",
            type: ROBOT_TYPE_LLM,
            level: LEVEL_TYPE_ORGANIZATION,
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
    }, []);

    const handleOk = () => {
        onSubmit();
    };

    const handleCancel = () => {
        onCancel();
    };

    const startRobotChat = async (robot: ROBOT.RobotResponse, index: number) => {
        console.log("startRobotChat", robot, index);
        const threadRequest: THREAD.ThreadRequest = {
            user: {
                uid: robot?.uid,
                nickname: robot?.nickname,
                avatar: robot?.avatar,
                type: USER_TYPE_USER,
            },
            topic: TOPIC_ORG_ROBOT_PREFIX + robot?.uid + "/" + userInfo?.uid,
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
            onSubmit();
        } else {
            message.error(response.data.message);
            onCancel();
        }
    };

    return (
        <>
            <Modal
                title={intl.formatMessage({
                    id: 'robot.create.title',
                    defaultMessage: '创建机器人'
                })}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <List
                    dataSource={robotResult?.data.content}
                    style={{ marginTop: 10 }}
                    renderItem={(item, index) => (
                        <List.Item
                            key={item?.uid}
                            actions={[
                                <Button onClick={() => startRobotChat(item, index)}>
                                    {intl.formatMessage({
                                        id: "pages.robot.chat",
                                        defaultMessage: "Chat",
                                    })}
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                style={{ marginLeft: "10px" }}
                                title={
                                    translateString(item?.nickname)
                                }
                                description={translateString(item?.description)}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default CreateRobot;
