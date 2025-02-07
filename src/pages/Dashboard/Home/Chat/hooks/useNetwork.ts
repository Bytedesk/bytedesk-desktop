import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useAppContext } from "@/context/AppContext";

export const useNetwork = () => {
  const isNetworkOnline = useNetworkStatus();
  const { hasRoleAgent } = useAppContext();

  return {
    isNetworkOnline,
    hasRoleAgent
  };
}; 