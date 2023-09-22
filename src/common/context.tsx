import React from "react";
import { IMainContext } from "../interface/interface";

export const MainContext = React.createContext<IMainContext>({
  handleStateChange: () => {},
  isUser: false,
  push: () => {},
  myHistory: [],
});
