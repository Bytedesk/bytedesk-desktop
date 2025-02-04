/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-30 09:38:03
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-30 11:08:40
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import useTheme from "@/hooks/useTheme";
import useTranslate from "@/hooks/useTranslate";
import { useRobotStore } from "@/stores/ai/robot";
import { Avatar, List, Modal } from "antd";
import { useIntl } from "react-intl";

type SwitchAiModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const SwitchAiModel = ({ open, onOk, onCancel }: SwitchAiModelProps) => {
  // const [form] = ProForm.useForm();
  const { isDarkMode } = useTheme();
  const intl = useIntl();
  const { translateStringTranct } = useTranslate();
  const {
    currentAgentAsistantRobot,
    agentAsistantRobotResult,
    setCurrentAgentAsistantRobot,
  } = useRobotStore((state) => {
    return {
      currentAgentAsistantRobot: state.currentAgentAssistantRobot,
      agentAsistantRobotResult: state.agentAssistantRobotResult,
      setCurrentAgentAsistantRobot: state.setCurrentAgentAssistantRobot,
    };
  });

  const handleListOnClick = (record: ROBOT.RobotResponse, index: number) => {
    // console.log("list on click", record);
    setCurrentAgentAsistantRobot(record);
  };

  const formatDescription = (robot: ROBOT.RobotResponse) => {
    return intl.formatMessage({
      id: robot?.type,
      defaultMessage: robot?.type,
    });
  };
  
  const handleOk = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        title="切换AI助手"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List
          itemLayout="horizontal"
          dataSource={agentAsistantRobotResult?.data.content || []}
          renderItem={(item, index) => (
            <List.Item
              style={
                currentAgentAsistantRobot.uid === item.uid
                  ? {
                      backgroundColor: isDarkMode ? "#333333" : "#dddddd",
                      cursor: "pointer",
                    }
                  : { cursor: "pointer" }
              }
              onClick={() => handleListOnClick(item, index)}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={translateStringTranct(item.nickname)}
                description={formatDescription(item)}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};
export default SwitchAiModel;