/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-27 18:44:53
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:10:02
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Button, Modal, Popconfirm, PopconfirmProps, Popover, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import Login from "@/pages/Auth/Login";
import { getVersion } from "@/utils/utils";
import useEventBus from "@/hooks/useEventBus";
import { openUrl } from "@/utils/electronApiUtils";
import { DOWNLOAD_URL, IS_DEBUG, MODE_AGENT } from "@/utils/constants";
import { useIntl } from "react-intl";

//
const FootBar = () => {
  const intl = useIntl();
  const { isLoggedIn, mode } = useContext(AppContext);
  const { doLogout } = useEventBus();
  const [networkStatusText, setNetworkStatusText] = useState<string>("✅");
  const [networkStatusTextTip, setNetworkStatusTextTip] = useState<string>(
    intl.formatMessage({
      id: 'footbar.network.normal',
      defaultMessage: '网络正常'
    })
  );
  //
  const isNetworkOnline = useNetworkStatus();
  useEffect(() => {
    if (isNetworkOnline) {
      setNetworkStatusText("✅");
      setNetworkStatusTextTip(intl.formatMessage({
        id: 'footbar.network.normal',
        defaultMessage: '网络正常'
      }));
    } else {
      setNetworkStatusText("❌");
      setNetworkStatusTextTip(intl.formatMessage({
        id: 'footbar.network.disconnected',
        defaultMessage: '网络断开'
      }));
    }
  }, [isNetworkOnline, intl]);

  //
  const anonymousStatusContent = (
    <div>
      <p>{intl.formatMessage({
        id: 'footbar.anonymous.tip',
        defaultMessage: '匿名状态，仅支持同一个局域网内在线设备之间通信'
      })}</p>
    </div>
  );

  const loginStatusContent = (
    <div>
      <p>{intl.formatMessage({
        id: 'footbar.login.tip',
        defaultMessage: '登录后，支持离线消息和更多功能'
      })}</p>
    </div>
  );

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleShowLoginModel = () => {
    console.log("handleShowLoginModel");
    showModal();
  };

  // 退出登录
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    // message.success('Click on Yes');
    doLogout();
  };
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    // message.error('Click on No');
  };

  return (
    <>
      <Modal
        // title="登录"
        open={open && !isLoggedIn}
        onOk={hideModal}
        onCancel={hideModal}
        // okText="登录"
        // cancelText="取消"
        // footer={null}
        footer={[
          <Button key="back" onClick={hideModal}>
            {intl.formatMessage({
              id: 'footbar.login.skip',
              defaultMessage: '暂不登录'
            })}
          </Button>,
        ]}
      >
        <Login isModel={true} />
      </Modal>
      <span>
        {!isLoggedIn && (
          <>
            <Popover content={anonymousStatusContent} title={intl.formatMessage({
              id: 'footbar.anonymous.status',
              defaultMessage: '匿名状态'
            })}>
              <span className="footerLeftButton">
                {intl.formatMessage({
                  id: 'footbar.anonymous.status',
                  defaultMessage: '匿名状态'
                })}
              </span>
            </Popover>
            <Popover content={loginStatusContent}>
              <span className="footerLeftButton" onClick={handleShowLoginModel}>
                {intl.formatMessage({
                  id: 'footbar.login',
                  defaultMessage: '登录'
                })}
              </span>
            </Popover>
          </>
        )}
        {isLoggedIn && (
          <>
            <Popconfirm
              title={intl.formatMessage({
                id: 'footbar.logout.title',
                defaultMessage: '退出登录'
              })}
              description={intl.formatMessage({
                id: 'footbar.logout.confirm',
                defaultMessage: '确定要退出登录?'
              })}
              onConfirm={confirm}
              onCancel={cancel}
              okText={intl.formatMessage({
                id: 'common.confirm',
                defaultMessage: '确定'
              })}
              cancelText={intl.formatMessage({
                id: 'common.cancel',
                defaultMessage: '取消'
              })}
            >
              <span className="footerLeftButton">
                {intl.formatMessage({
                  id: 'footbar.logout',
                  defaultMessage: '退出登录'
                })}
              </span>
            </Popconfirm>
          </>
        )}
        {mode === MODE_AGENT && IS_DEBUG && (
          <span style={{ marginLeft: 10 }}>
            <Tooltip title={intl.formatMessage({
              id: 'footbar.serving.count',
              defaultMessage: '当前接待人数'
            })}>
              <span>{intl.formatMessage({
                id: 'footbar.serving.text',
                defaultMessage: '当前接待人数:0'
              })}</span>
            </Tooltip>
          </span>
        )}
      </span>

      <span className="footerRightButton">
        <Tooltip title={networkStatusTextTip}>
          <span>{networkStatusText}</span>
        </Tooltip>
        <span
          style={{ marginLeft: "10px" }}
          onClick={() => openUrl(DOWNLOAD_URL)}
        >
          v{getVersion()}
        </span>
        <span
          style={{ marginLeft: "10px" }}
          onClick={() =>
            openUrl(
              "https://www.weiyuai.cn/chat/iframe.html?org=df_org_uid&t=1&sid=df_wg_uid&",
            )
          }
        >
          {intl.formatMessage({
            id: "i18n.online.chat",
            defaultMessage: "Chat",
          })}
        </span>
      </span>
    </>
  );
};

export default FootBar;
