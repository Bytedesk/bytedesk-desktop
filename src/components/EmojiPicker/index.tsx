/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-15 11:52:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-01 15:19:08
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
import { Popup } from '@/components/ChatUI';
import { useState } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

type EmojiPickerProps = {
    onSelect: (emojiNative: string) => void;
    onClose: () => void;
}

const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
    const [active, setActive] = useState(true);

    const handleEmojiSelect = (emoji) => {
        // console.log('handleEmojiSelect:', emoji, emoji.native);
        setActive(false);
        onSelect(emoji.native);
    }

    return (
        <Popup
            className="EmojiPicker"
            active={active}
            onClose={() => {
                setActive(false);
                onClose();
            }}
            title="请选择表情"
        >
            <div>
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
        </Popup>
    );
};

export default EmojiPicker;