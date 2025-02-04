/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:43:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-02 18:08:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { Card, CardText, Flex, RateActions } from "@/components/ChatUI";
// import { MESSAGE_STATUS_SENDING } from "@/utils/constants";

type RobotQaProps = {
    // position: "left" | "right" | "center" | "pop"; // 消息位置
    uid?: string; // 用户id
    content?: string
}

// 
const RobotQa = ({ uid, content }: RobotQaProps) => {
    console.log('RobotQa', uid, content)

    return (
        <>
            <Flex>
                <Card fluid>
                    {/* <CardMedia image="//gw.alicdn.com/tfs/TB1Xv5_vlr0gK0jSZFnXXbRRXXa-427-240.png" /> */}
                    {/* <CardTitle>Card title</CardTitle> */}
                    <CardText>
                        { content }
                    </CardText>
                    {/* <CardActions>
                        <Button>次要按钮</Button>
                        <Button color="primary">主要按钮</Button>
                    </CardActions> */}
                </Card>
                <RateActions onClick={console.log} />
                {/* {
                    position === 'right' && <MessageStatus status={MESSAGE_STATUS_SENDING} />
                } */}
            </Flex>
        </>
    )
}

export default RobotQa;