/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-24 21:33:52
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:53:10
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Alert, Divider } from "antd"

//
const ChannelTip = () => {
    // const intl = useIntl();

    return (
        <>
            <Alert message="一对一客服，此处客服代码会将所有访客都转接给此客服账号" type="success" />
            <Divider />
        </>
    )
}

export default ChannelTip;
