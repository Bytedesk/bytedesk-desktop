/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-23 09:02:53
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-15 08:16:54
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
import { useEffect, useState } from "react"

type StarProps = {
  defaultRate?: number;
  // rateList?: string[]
  disabled: boolean;
  onClick: (rate: number) => void;
};

function Star({ defaultRate, disabled, onClick }: StarProps) {
    // 
    const [currentRate, setCurrentRate] = useState(defaultRate ? defaultRate : 5)
    const rateList = ['很不满意', '不满意', '一般', '满意', '非常满意'];

    // 点击事件处理函数，更新当前的 rate 状态、上一次点击的 rate 状态和 clicked 状态
    const handleClick = (rate: number) => {
        setCurrentRate(rate)
    }
    // 鼠标移入事件处理函数，更新当前的 rate 状态
    const handleMouseEnter = (rate: number) => {
        setCurrentRate(rate)
    }
    // 鼠标移出事件处理函数，更新当前的 rate 状态为上一次点击的 rate 状态
    const handleMouseLeave = (rate: number) => {
        setCurrentRate(rate)
    }
    // 
    useEffect(() => {
        onClick(currentRate)
    }, [currentRate, onClick])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px', marginBottom: '5px' }}>
                {/* 遍历 rateList，生成相应的 div 元素 */}
                {rateList.map((_, index) => {
                    const isSelected = index + 1 <= currentRate;
                    return (
                        <div
                            key={index}
                            style={{
                                padding: '10px',
                                color: isSelected ? 'orange' : 'inherit', // 选中为黄色，未选中继承父元素颜色
                                cursor: 'pointer' // 添加鼠标指针样式，表示可点击
                            }}
                            onClick={() => handleClick(index + 1)}
                            onMouseEnter={() => handleMouseEnter(index + 1)}
                            onMouseLeave={() => handleMouseLeave(index + 1)}
                        >
                            {isSelected ? '★' : '☆'} {/* 根据是否选中显示不同的星星符号 */}
                        </div>
                    );
                })}
            </div>
            <div style={{ marginBottom: '20px' }}>
                {rateList[currentRate - 1]}
            </div>
        </>
    )
}

export default Star;
