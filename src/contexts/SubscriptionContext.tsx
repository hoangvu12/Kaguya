import useCreateSubscription from "@/hooks/useCreateSubscription";
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useUser } from "./AuthContext";

interface ContextProps {
  subscription: PushSubscription;
  setSubscription: Dispatch<SetStateAction<PushSubscription>>;
}

const SubscriptionContext = createContext<ContextProps>(null);

export const SubscriptionContextProvider: React.FC = ({ children }) => {
  const [sub, setSub] = useState<PushSubscription>(null);
  const user = useUser();
  const createSubscription = useCreateSubscription();

  useEffect(() => {
    if (!user) return;

    navigator.serviceWorker.getRegistration().then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();

      setSub(subscription);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !sub) return;

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
