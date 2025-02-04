/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-12-02 16:18:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 16:51:34
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
import React from 'react';
import { Avatar, Button, List } from 'antd';
import { useThreadStore } from '@/stores/core/thread';
import { message } from '@/AntdGlobalComp';
import useTheme from '@/hooks/useTheme';
import { useIntl } from 'react-intl';
// import useTranslate from '@/hooks/useTranslate';
import { acceptThread } from '@/apis/core/thread';
import { useAgentStore } from '@/stores/service/agent';
import { THREAD_STATE_STARTED, USER_TYPE_AGENT } from '@/utils/constants';
// import useStyle from '@/hooks/useStyle';
// const { Header } = Layout;

const QueueList = () => {
    const intl = useIntl();
    // const { headerStyle } = useStyle();
    // const { translateStringTranct } = useTranslate();
    const { isDarkMode } = useTheme();
    const agentInfo = useAgentStore(state => state.agentInfo);
    const { 
        currentQueuingThread, 
        queuingThreads, 
        threads,
        setCurrentQueuingThread,
        setQueuingThreads,
        setThreads,
    } = useThreadStore((state) => {
        return {
            currentQueuingThread: state.currentQueuingThread,
            queuingThreads: state.queuingThreads,
            threads: state.threads,
            setCurrentQueuingThread: state.setCurrentQueuingThread,
            setQueuingThreads: state.setQueuingThreads,
            setThreads: state.setThreads,
        };
    })

    const acceptQueuingThread = async (item: THREAD.ThreadResponse, index: number) => {
        console.log('acceptQueuingThread', item, index);
        message.loading(intl.formatMessage({
            id: 'queue.accepting',
            defaultMessage: '接受中...'
        }));
        
        const threadParam: THREAD.ThreadRequest = {
            uid: item.uid,
            agent: JSON.stringify({
                uid: agentInfo?.uid,
                nickname: agentInfo?.nickname,
                avatar: agentInfo?.avatar,
                type: USER_TYPE_AGENT,
            }),
        }
        const response = await acceptThread(threadParam);
        if (response?.data?.code === 200) {
            message.destroy();
            message.success(intl.formatMessage({
                id: 'queue.accept.success',
                defaultMessage: '接受成功'
            }));
            
            // 创建新对象
            const updatedThread = {
                ...item,
                state: THREAD_STATE_STARTED
            };
            
            // 过滤掉相同topic的旧thread
            const filteredThreads = threads.filter(thread => thread.topic !== item.topic);
            
            // 使用新对象更新状态
            setThreads([updatedThread, ...filteredThreads]);
            setQueuingThreads(queuingThreads.filter(thread => thread.uid !== item.uid));
        } else {
            message.destroy();
            message.error(intl.formatMessage({
                id: 'queue.accept.failed',
                defaultMessage: '接受失败'
            }));
        }
    };

    const handleListOnClick = (item: THREAD.ThreadResponse, index) => {
        console.log('handleListOnClick', item, index);
        setCurrentQueuingThread(item);
    };

    return (
        <>
            <List
                dataSource={queuingThreads}
                renderItem={(item, index) => (
                    <List.Item
                        key={item?.uid}
                        style={
                        currentQueuingThread?.uid === item.uid
                            ? {
                                backgroundColor: isDarkMode ? "#333333" : "#dddddd",
                                cursor: "pointer",
                            }
                            : { cursor: "pointer" }
                        }
                        onClick={() => handleListOnClick(item, index)}
                        actions={[
                            <Button onClick={() => acceptQueuingThread(item, index)}>
                                {intl.formatMessage({ 
                                    id: 'queue.accept',
                                    defaultMessage: '接受'
                                })}
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            style={{ marginLeft: 10 }}
                            avatar={<Avatar src={item.user.avatar} />}
                            title={item.user.nickname}
                            description={item.content}
                            // description={translateStringTranct(item.content)}
                        />
                    </List.Item>
                )}
            />
        </>
    )
};

export default QueueList;