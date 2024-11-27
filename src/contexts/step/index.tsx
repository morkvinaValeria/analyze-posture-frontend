import type { UploadFile } from 'antd';
import React, { ReactElement } from 'react';
import { DetectedPoints } from '../../common/types';

interface Base64 {
  base64: string;
}
export type UploadFileWithBase64 = UploadFile & Base64;

export interface StepContextType {
  fileList: UploadFileWithBase64[];
  isNextValid: boolean;
  pointList: Record<string, DetectedPoints>;
  setFileList: (fileList: UploadFileWithBase64[]) => void;
  setIsNextValid: (flag: boolean) => void;
  setPointList: (pointList: Record<string, DetectedPoints>) => void;
}

interface StepContextProps {
  children: ReactElement | ReactElement[];
}

export const StepContext = React.createContext<StepContextType | null>(null);

export const StepProvider = ({ children }: StepContextProps) => {
  const [fl, setfl] = React.useState<UploadFileWithBase64[]>([]);
  const [isNextValid, setIsNextValid] = React.useState<boolean>(false);
  const [pointList, setPointList] = React.useState<
    Record<string, DetectedPoints>
  >({});
  return (
    <StepContext.Provider
      value={{
        fileList: fl,
        isNextValid,
        pointList,
        setFileList: (fileList: UploadFileWithBase64[]) => setfl(fileList),
        setIsNextValid,
        setPointList,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
