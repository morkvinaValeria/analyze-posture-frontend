import React, { ReactElement } from 'react';

export interface StepContextType {
  fileList: string[];
  setFileList: (fileList: string[]) => void;
}

interface StepContextProps {
  children: ReactElement | ReactElement[];
}

export const StepContext = React.createContext<StepContextType | null>(null);

export const StepProvider = ({ children }: StepContextProps) => {
  const [fl, setfl] = React.useState<string[]>([]);
  return (
    <StepContext.Provider
      value={{
        fileList: fl,
        setFileList: (fileList: string[]) => setfl(fileList),
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
