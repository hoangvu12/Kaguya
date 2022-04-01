import config from "@/config";
import useCreateSubscription from "@/hooks/useCreateSubscription";
import { base64ToUint8Array } from "@/utils";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "./AuthContext";

interface ContextProps {
  subscription: PushSubscription;
  setSubscription: Dispatch<SetStateAction<PushSubscription>>;
}

const SubscriptionContext = createContext<ContextProps>(null);

const isDev = process.env.NODE_ENV === "development";

export const SubscriptionContextProvider: React.FC = ({ children }) => {
  const [sub, setSub] = useState<PushSubscription>(null);
  const user = useUser();
  const createSubscription = useCreateSubscription();

  useEffect(() => {
    if (!user || isDev) return;

    navigator.serviceWorker.getRegistration().then(async (registration) => {
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(config.webPushPublicKey),
        });
      }

      setSub(subscription);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !sub || isDev) return;

    createSubscription.mutate(sub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub, user]);

  return (
    <SubscriptionContext.Provider
      value={{ subscription: sub, setSubscription: setSub }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};
