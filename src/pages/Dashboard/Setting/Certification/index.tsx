/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-10 18:33:39
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 16:17:31
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import { UNDER_DEVELOPMENT } from "@/utils/constants";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PersonalCertification from "./Personal";
// import CompanyCertification from "./Company";

const onChange = (key: string) => {
    console.log(key);
};

const items: TabsProps['items'] = [
    {
        key: 'personal',
        label: '个人认证',
        children: <PersonalCertification />,
    },
    // {
    //     key: 'company',
    //     label: '组织认证',
    //     children: <CompanyCertification />,
    // },
];

// TODO: 实名认证
const Certification = () => {
    // https://umijs.org/docs/max/access
    return (
        <div className="profile-container">
            <Tabs defaultActiveKey="personal" items={items} onChange={onChange} />
        </div>
    );
}
export default Certification;
