/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-28 14:51:16
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 11:45:10
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { I18N_PREFIX } from "@/utils/constants";
import { truncateString } from "@/utils/utils";
import { useIntl } from "react-intl";

// 
function useTranslate() {
    const intl = useIntl();

    const translateString = (value: string) => {
        // 处理为null的情况 
        if (value === null || value === undefined) {
            return value;
        }
        if (value && value.startsWith(I18N_PREFIX)) {
            return intl.formatMessage({
                id: value,
                defaultMessage: value,
            });
        }
        return value
    };

    const translateStringTranct = (content: string) => {
        // 处理为null的情况
        if (content === null || content === undefined) {
            return content;
        }
        if (content?.startsWith(I18N_PREFIX)) {
            return truncateString(
                intl.formatMessage({
                    id: content,
                }),
                10,
            )
        }
        return truncateString(content, 10);
    }


    return {
        translateString,
        translateStringTranct
    }

}
export default useTranslate;