import * as React from "react";

type Store = {
  tool: number;
  setTool: React.Dispatch<React.SetStateAction<number>>;
};

export const context = React.createContext<Store>({
  tool: 0,
  setTool: () => {
    // ...
  },
});

export const useStore = () => React.useContext(context);

export const StoreProvider: React.FCC = ({ children }) => {
  const [tool, setTool] = React.useState(0);

  return (
    <context.Provider value={{ tool, setTool }}>{children}</context.Provider>
  );
};
