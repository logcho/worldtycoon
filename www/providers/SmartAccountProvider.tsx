import { createContext, useContext, useEffect, useState } from "react";
import { getSmartAccountClient } from "./lib/accountClient";

const SmartAccountContext = createContext<any>(null);

export const SmartAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    getSmartAccountClient().then(setClient);
  }, []);

  return (
    <SmartAccountContext.Provider value={client}>
      {children}
    </SmartAccountContext.Provider>
  );
};

export const useSmartAccount = () => useContext(SmartAccountContext);
