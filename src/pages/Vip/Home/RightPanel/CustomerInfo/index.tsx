import useTranslate from "@/hooks/useTranslate";

const CustomerInfo = () => {
  const { translateString } = useTranslate();
  return <div>{translateString("i18n.vip.component")}</div>;
};

export default CustomerInfo;
