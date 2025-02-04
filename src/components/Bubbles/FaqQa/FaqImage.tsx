/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:43:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-03 21:50:21
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 
import { Card, CardMedia, RateActions } from "@/components/ChatUI";

type FaqQaImage = {
    // position: "left" | "right" | "center" | "pop"; // 消息位置
    content: string
    type: string
}

// 
const FaqQaImage = ({  content, type }: FaqQaImage) => {

    const handleRateClicked = (rate) => {
        console.log('handleRateClicked:', type, rate)
    }

    return (
        <>
            <Card>
                <CardMedia image={content} />
            </Card>
            <RateActions onClick={handleRateClicked} />
            {/* {
                position === 'right' && <MessageStatus status={MESSAGE_STATUS_SENDING} />
            } */}
        </>
    )
}
export default FaqQaImage;