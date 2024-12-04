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
  isStatisticalMode: boolean;
  statisticalPoints: Record<string, DetectedPoints>;
  statisticalFileList: UploadFileWithBase64[];
  setFileList: (fileList: UploadFileWithBase64[]) => void;
  setIsNextValid: (flag: boolean) => void;
  setPointList: (pointList: Record<string, DetectedPoints>) => void;
  setIsStatisticalMode: (flag: boolean) => void;
  setStatisticalPoints: (pointList: Record<string, DetectedPoints>) => void;
  setStatisticalFileList: (fileList: UploadFileWithBase64[]) => void;
}

interface StepContextProps {
  children: ReactElement | ReactElement[];
}

export const StepContext = React.createContext<StepContextType | null>(null);

export const StepProvider = ({ children }: StepContextProps) => {
  const [fileList, setFileList] = React.useState<UploadFileWithBase64[]>([]);
  const [isNextValid, setIsNextValid] = React.useState<boolean>(false);
  const [pointList, setPointList] = React.useState<
    Record<string, DetectedPoints>
  >({});
  const [isStatisticalMode, setIsStatisticalMode] =
    React.useState<boolean>(false);
  const [statisticalPoints, setStatisticalPoints] = React.useState<
    Record<string, DetectedPoints>
  >({});
  const [statisticalFileList, setStatisticalFileList] = React.useState<
    UploadFileWithBase64[]
  >([]);
  return (
    <StepContext.Provider
      value={{
        fileList,
        isNextValid,
        pointList,
        isStatisticalMode,
        statisticalPoints,
        statisticalFileList,
        setFileList,
        setIsNextValid,
        setPointList,
        setIsStatisticalMode,
        setStatisticalPoints,
        setStatisticalFileList,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
