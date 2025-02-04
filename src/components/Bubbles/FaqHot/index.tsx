/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-11 21:32:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-12 16:42:53
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { Card, Flex, FlexItem, List, ListItem, toast } from "@/components/ChatUI";
import useTranslate from "@/hooks/useTranslate";
import { useEffect, useState } from "react";

type FaqHotProps = {
    content: string;
    onFaqClick: (item: THREAD.Faq, index: number) => void;
}

// 
const FaqHot = ({ content, onFaqClick }: FaqHotProps) => {
    // [{"title":"常见问题文字Demo1","content":"常见问题文字Demo1","code":"df_org_uidi18n.faq.demo.title.1","type":"TEXT"}]
    console.log("faqhot:", content);
    const { translateString } = useTranslate();
    const [faqList, setFaqList] = useState<THREAD.Faq[]>([]);

    useEffect(() => {

        const faqList = JSON.parse(content);
        setFaqList(faqList);

    }, [content])

    const handleChangeFaqHot = () => {
        console.log("TODO: change faq hot");
        // TODO: 换一换
        toast.success(translateString("i18n.change.faq"));
    }

    const handleFaqClick = (item: THREAD.Faq, index: number) => {
        console.log("item", item);
        onFaqClick(item, index);
    }

    return (
        <div>
            <Card fluid>
                <Flex>
                    <div className="guess-you-aside">
                        <h1>{translateString("i18n.hot.faq")}</h1>
                        <span onClick={handleChangeFaqHot}>{translateString("i18n.change.faq")}</span>
                    </div>
                    <FlexItem>
                        <List>
                            {
                                faqList.map((item, index) => {
                                    return (
                                        <ListItem key={index} content={item.title} as="a" rightIcon="chevron-right" onClick={() => handleFaqClick(item, index)} />
                                    );
                                })
                            }
                            {/* <ListItem content="我的红包退款去哪里?" as="a" rightIcon="chevron-right" /> */}
                            {/* <ListItem content="我的红包退款去哪里?" as="a" rightIcon="chevron-right" /> */}
                            {/* <ListItem content="如何修改评价?" as="a" rightIcon="chevron-right" /> */}
                            {/* <ListItem content="物流问题咨询" as="a" rightIcon="chevron-right" /> */}
                        </List>
                    </FlexItem>
                </Flex>
            </Card>
        </div>
    )
}
export default FaqHot;