/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../common/enums';
import { DetectedPoints } from '../../common/types';
import { StepContext } from '../../contexts/step';
import { DetectPointsService } from '../../services/detect-points.service';
import ImageWithPoints from './image-with-points';

const IdentifyPoints: React.FC = () => {
  const navigate = useNavigate();

  const stepContext = useContext(StepContext);
  const detectPointsService = new DetectPointsService();

  const [points, setPoints] = useState<Record<string, DetectedPoints>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPoints = async (): Promise<Record<string, DetectedPoints>> => {
    setIsLoading(true);
    const fileList = stepContext?.fileList || [];
    console.log(fileList);
    let points: Record<string, DetectedPoints> = {};

    for (let i = 0; i < fileList.length; i++) {
      const base64 = fileList[i].base64.split(',')[1];
      const uid = fileList[i].uid;
      const resp = await detectPointsService.getPosturePoints(base64);
      points[uid] = resp;
    }
    console.log(points);
    return points;
  };

  useEffect(() => {
    getPoints()
      .then((result) => result && setPoints(result))
      .catch((e: any) => navigate(`/${AppRoute.NOT_FOUND}`));
  }, []);

  useEffect(() => {
    if (Object.keys(points).length !== 0) {
      setIsLoading(false);
    }
  }, [points]);

  return (
    <>
      <h5>Change positions of dots if needed</h5>
      <br />
      {isLoading === false ? (
        stepContext?.fileList.map((file, i) => (
          //{x: 0.485744833946228, y: 0.18744662404060364}
          <ImageWithPoints
            file={file}
            points={points[file.uid]}
            adjustPoints={(newPoints: DetectedPoints) =>
              setPoints({ ...points, [file.uid]: newPoints })
            }
            key={i}
          />
        ))
      ) : (
        <></>
      )}
    </>
  );
};

export default IdentifyPoints;
