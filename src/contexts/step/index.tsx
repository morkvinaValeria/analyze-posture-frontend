import React, { ReactElement } from 'react';
import type { UploadFile } from 'antd';

interface Base64 {
  base64: string;
}
type UploadFileWithBase64 = UploadFile & Base64;

export interface StepContextType {
  fileList: UploadFileWithBase64[];
  isNextValid: boolean;
  setFileList: (fileList: UploadFileWithBase64[]) => void;
  setIsNextValid: (flag: boolean) => void;
}

interface StepContextProps {
  children: ReactElement | ReactElement[];
}

export const StepContext = React.createContext<StepContextType | null>(null);

export const StepProvider = ({ children }: StepContextProps) => {
  const [fl, setfl] = React.useState<UploadFileWithBase64[]>([]);
  const [isNextValid, setIsNextValid] = React.useState<boolean>(false);
  return (
    <StepContext.Provider
      value={{
        fileList: fl,
        isNextValid,
        setFileList: (fileList: UploadFileWithBase64[]) => setfl(fileList),
        setIsNextValid,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
