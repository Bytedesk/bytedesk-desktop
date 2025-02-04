/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-19 22:35:29
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-10-12 09:50:53
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 扫码登录
import { message } from "@/AntdGlobalComp";
import { scanLogin, scanQuery } from "@/apis/core/auth";
import { useAuthStore } from "@/stores/core/auth";
import { useUserStore } from "@/stores/core/user";
import {
  PLATFORM,
  PUSH_STATUS_CONFIRMED,
  PUSH_STATUS_EXPIRED,
  PUSH_STATUS_PENDING,
  PUSH_STATUS_SCANNED,
} from "@/utils/constants";
import { loginSuccess } from "@/utils/electronApiUtils";
import { getUUid } from "@/utils/utils";
// import { CloseCircleFilled, ReloadOutlined, CheckCircleFilled } from "@ant-design/icons";
import { QRCode } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

// https://ant-design.antgroup.com/components/qr-code-cn
// const customStatusRender: QRCodeProps["statusRender"] = (info) => {
//   switch (info.status) {
//     case "expired":
//       return (
//         <div>
//           <CloseCircleFilled style={{ color: "red" }} />{" "}
//           {info.locale?.expired}
//           <p>
//             <Button type="link" onClick={info.onRefresh}>
//               <ReloadOutlined /> {info.locale?.refresh}
//             </Button>
//           </p>
//         </div>
//       );
//     case "loading":
//       return (
//         <Space direction="vertical">
//           <Spin />
//           <p>Loading...</p>
//         </Space>
//       );
//     case "scanned":
//       return (
//         <div>
//           <CheckCircleFilled style={{ color: "green" }} />{" "}
//           {info.locale?.scanned}
//         </div>
//       );
//     default:
//       return null;
//   }
// };

const Scan = ({ loginType }: { loginType: string }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { deviceUid, setDeviceUid } = useUserStore((state) => {
    return { deviceUid: state.deviceUid, setDeviceUid: state.setDeviceUid };
  });
  const [value, setValue] = useState<string>("login");
  const [status, setStatus] = useState<
    "active" | "loading" | "scanned" | "expired"
  >("loading");

  //
  const handleScanLogin = async (values: AUTH.LoginMobileParams) => {
    console.log("handleScanLogin values: ", values);
    message.loading(
      intl.formatMessage({ id: "logging", defaultMessage: "logging..." }),
    );
    // 登录
    const loginResult = await scanLogin({ ...values });
    console.log("LoginMobileResult scanLogin:", loginResult.data);
    //
    if (loginResult.data.code === 200) {
      message.destroy();
      message.success(
        intl.formatMessage({
          id: "login.success",
          defaultMessage: "login success",
        }),
      );
      setUserInfo(loginResult.data.data.user);
      setAccessToken(loginResult.data.data.accessToken);
      // 非model跳转
      navigate("/chat");
      // 
      loginSuccess();
    } else {
      message.destroy();
      message.error(loginResult.data.message);
    }
  };

  const handleScanQuery = async (forceRefresh: boolean) => {
    if (loginType != "scan") {
      return;
    }
    const response = await scanQuery(deviceUid, forceRefresh);
    // console.log("handleScanQuery: ", response.data.data);
    if (response.data.code === 200) {
      const push: AUTH.Push = response.data.data;
      console.log("handleScanQuery status: ", push.status);
      if (push.status === PUSH_STATUS_PENDING) {
        setStatus("active");
        setValue("deviceUid=" + push.deviceUid + "&code=" + push.content);
      } else if (push.status === PUSH_STATUS_SCANNED) {
        setStatus("scanned");
      } else if (push.status === PUSH_STATUS_EXPIRED) {
        setStatus("expired");
      } else if (push.status === PUSH_STATUS_CONFIRMED) {
        if (push.receiver === undefined || push.receiver === "") {
          return;
        }
        // 扫码登录
        let loginInfo: AUTH.LoginMobileParams = {
          mobile: push.receiver,
          code: push.content,
          platform: PLATFORM,
        };
        console.log("login scan info:", loginInfo);
        await handleScanLogin(loginInfo);
      }
    } else {
      message.error(response.data.message);
    }
  };

  //
  useEffect(() => {
    console.log("scan deviceUid:", deviceUid);
    if (deviceUid === undefined || deviceUid === "") {
      setDeviceUid(getUUid());
    }
    // 轮询
    handleScanQuery(true);
    const scanQueryTimer = setInterval(() => {
      handleScanQuery(false);
    }, 3000);

    return () => {
      clearInterval(scanQueryTimer);
    };
  }, [loginType, deviceUid]);

  return (
    <>
      {loginType === "scan" && (
        <>
          <QRCode
            style={{ margin: "auto" }}
            value={value}
            status={status}
            onRefresh={() => {
              console.log("onRefresh");
              handleScanQuery(true);
            }}
            // statusRender={customStatusRender}
          />
        </>
      )}
    </>
  );
};

export default Scan;
