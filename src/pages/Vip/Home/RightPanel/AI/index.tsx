import useTranslate from "@/hooks/useTranslate";
import styled from "@emotion/styled";
import { Button } from "antd";

const AIContainer = styled.div`
  padding: 20px;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AI = () => {
  const { translateString } = useTranslate();

  return (
    <>
      <AIContainer>
        <div>{translateString("i18n.vip.component")}</div>
        <Button
          type="primary"
          onClick={() =>
            window.open(translateString("i18n.vip.contactUrl"))
          }
        >
          {translateString("i18n.vip.contactUs")}
        </Button>
      </AIContainer>
    </>
  );
};

export default AI;
