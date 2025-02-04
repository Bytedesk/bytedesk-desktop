/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-11 21:33:07
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-12 16:32:01
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { ScrollView, Card, CardTitle, CardText } from "@/components/ChatUI";
import { useEffect, useState } from "react";

type FaqShortcutProps = {
    content: string;
    onFaqClick: (item: THREAD.Faq, index: number) => void;
}
// 
const FaqShortcut = ({ content, onFaqClick }: FaqShortcutProps) => {
    // [{"title":"常见问题文字Demo1","content":"常见问题文字Demo1","code":"df_org_uidi18n.faq.demo.title.1","type":"TEXT"}]
    console.log('FaqShortcut:', content)
    const [faqList, setFaqList] = useState<THREAD.Faq[]>([]);

    useEffect(() => {

        const faqList = JSON.parse(content);
        setFaqList(faqList);

    }, [content])

    const handleFaqClick = (item: THREAD.Faq, index: number) => {
        console.log("item", item);
        onFaqClick(item, index);
    }

    return (
        <div>
            <ScrollView
                className="skill-cards"
                data={faqList}
                fullWidth
                renderItem={(item, index) => (
                    <Card key={item.uid} onClick={() => handleFaqClick(item, index)} >
                        <CardTitle>{item.title}</CardTitle>
                        <CardText>{item.title}</CardText>
                    </Card>
                )}
            />
        </div>
    )
}
export default FaqShortcut;
