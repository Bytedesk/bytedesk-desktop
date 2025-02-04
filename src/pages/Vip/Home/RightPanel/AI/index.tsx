import useTranslate from "@/hooks/useTranslate";

const AI = () => {
  const { translateString } = useTranslate();
  return <div>{translateString("i18n.vip.component")}</div>;
};

export default AI;
