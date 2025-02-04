/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-10 16:19:35
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-20 16:01:41
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { checkKaptcha, getKaptcha } from "@/apis/core/kaptcha";
import { RobotOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

type KaptchaProps = {
    onKaptchaChange?: (uid: string, code: string) => void;
    onKaptchaCheck?: (result?: boolean) => void;
};
// 
const Kaptcha = ({ onKaptchaChange, onKaptchaCheck }: KaptchaProps) => {
    const intl = useIntl();
    // 
    const [captchaUid, setCaptchaUid] = useState<string>();
    // const [captchaCode, setCaptchaCode] = useState<string>();
    const [captchaImage, setCaptchaImage] = useState<string>();

    const getCaptcha = async () => {
        const response = await getKaptcha();
        // console.log("getCaptcha response", response);
        if (response.data.code === 200) {
            setCaptchaUid(response.data.data.captchaUid);
            setCaptchaImage(response.data.data.captchaImage);
        }
    }

    const checkCaptcha = async (uid: string, code: string) => {
        const response = await checkKaptcha(uid, code);
        console.log("checkCaptcha response", response);
        if (response.data.code === 200) {
            // return true;
            if (onKaptchaCheck) {
                onKaptchaCheck(true);
            }
        } else {
            // return false;
            if (onKaptchaCheck) {
                onKaptchaCheck(false);
            }
        }
    };

    // 
    useEffect(() => {
        // 
        getCaptcha();
        //
    }, []);
    // 
    const handleKaptchaChange = (e: any) => {
        // console.log("handleKaptchaChange", e.target.value);
        if (onKaptchaChange) {
            onKaptchaChange(captchaUid, e.target.value);
            // 
            if (e.target.value && e.target.value !== "" && e.target.value.trim().length === 4) {
                checkCaptcha(captchaUid, e.target.value)
            } else {
                if (onKaptchaCheck) {
                    onKaptchaCheck(false);
                }
            }
        }
    };
    // 
    return (
        <>
            {
                captchaImage && (
                    <>
                        <Input
                            onChange={handleKaptchaChange}
                            prefix={<RobotOutlined />}
                            placeholder={intl.formatMessage({ id: 'captcha', defaultMessage: 'captcha' })}
                            style={{ width: '65%', float: 'left', height: 40 }} />
                        <img src={captchaImage} alt="captcha" onClick={getCaptcha} />
                    </>
                )
            }
        </>
    );
};
export default Kaptcha;