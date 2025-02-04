/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:59:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:37:16
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

// import { useContactStore } from "@/stores/contact"
// import DeviceDetail from "./details/DeviceDetail"
// import { CONTACT_TYPE_DEVICE, CONTACT_TYPE_MEMBER } from "@/utils/constants"
import MemberDetail from "./details/MemberDetail"
// import { Empty } from "antd"

//
const ContactDetail = () => {
    // const currentContact = useContactStore((state) => state.currentContact)

    return (
      <div style={{ overflowY: 'auto', marginTop: 60 }}>
        {/* {
                currentContact.type === CONTACT_TYPE_DEVICE && <DeviceDetail />
            }
            {
                currentContact.type === CONTACT_TYPE_MEMBER && <MemberDetail />
            }
            {
                currentContact.type === "" && <><Empty description=""/></>
            } */}
        <MemberDetail />
      </div>
    );
}
export default ContactDetail