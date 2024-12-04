import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, message, Upload } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { StepContext } from '../../contexts/step';
import ToggleSwitch from '../common/toggle-switch';

import styles from './styles.module.scss';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImages: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const stepContext = useContext(StepContext);
  const [mode, setMode] = useState(stepContext?.isStatisticalMode || false);
  const savedFileList = stepContext?.fileList?.map((file) => ({
    ...file,
    status: 'done',
  }));
  const [fileList, setFileList] = useState<UploadFile[]>(
    (savedFileList as UploadFile[]) || []
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.preview as string);
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    const filteredFileList = fileList.filter(
      (file) => file.status !== 'removed'
    );
    const listWithBase64 = [];
    for (let i = 0; i < filteredFileList.length; i++) {
      const file = filteredFileList[i];
      if (!file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
      }

      listWithBase64.push({ ...file, base64: file.preview });
    }

    stepContext?.setFileList(listWithBase64);
  };

  const handleValidation = (file: UploadFile) => {
    const isEligible = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isEligible) {
      message.error(`${file.name} is not a PNG/JPEG file`);
    }
    return isEligible || Upload.LIST_IGNORE;
  };

  const onModeChange = (checked: boolean) => {
    setMode(checked);
    stepContext?.setIsStatisticalMode(checked);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    const listWithBase64 = stepContext?.fileList || [];
    stepContext?.setIsNextValid(false);
    if (
      (listWithBase64.length >= 1 && !mode) ||
      (listWithBase64.length >= 4 && mode)
    ) {
      stepContext?.setIsNextValid(true);
    }
  }, [stepContext?.fileList, mode, stepContext]);

  return (
    <div className={styles.uploadContainer}>
      <h5>Upload Your Photos</h5>
      <p>
        To receive an accurate assessment of your posture, please provide clear
        and properly aligned photos.
      </p>
      <ul>
        We offer two analysis modes:
        <li>
          <b> Single Mode:</b> Each photo is processed individually to identify
          specific posture problems.
        </li>
        <li>
          <b>Statistical Mode:</b> A more comprehensive and accurate method that
          analyzes multiple photos to classify your overall posture type.
        </li>
      </ul>

      <div>
        <ToggleSwitch id="mode" checked={mode} onChange={onModeChange} />
        <label>
          Choose your preferred mode and follow the instructions below to ensure
          optimal results.
        </label>
      </div>
      <br />
      <Upload
        multiple={true}
        action="http://127.0.0.1:8000/upload"
        method="POST"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={handleValidation}
      >
        {(fileList.length >= 3 && !mode) || (fileList.length >= 6 && mode)
          ? null
          : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      <p className={styles.note}>
        <b>Note:</b> The processing time for analysis may take a few minutes,
        depending on the quality and number of images submitted.
      </p>
      <br />
      {!mode ? (
        <>
          <h5>Photo Requirements for Single Mode</h5>
          <p>
            <b>Number of Photos:</b>
            <br />
            📸 Upload 1 to 3 photos. The minimum requirement is one image of
            your body in one of the following positions: front view, side view,
            or back view.
          </p>
        </>
      ) : (
        <>
          <h5>Photo Requirements for Statistical Mode</h5>
          <p>
            <b>Number of Photos:</b>
            <br />
            📸 Upload 4 to 6 photos, all taken from
            <b> the same position</b>
            (front view, back view, side left view or side right view)
            <b> at different times of the day</b>. <br />
            Take photos at key intervals, such as: after waking up, after
            breakfast, after lunch, after a workday, after dinner, before going
            to bed.
            <br />
            📸 Arrange the photos in chronological order, ensuring
            <b> the final photo is labeled as "before going to bed"</b>. This
            provides a detailed and comprehensive analysis of your posture
            throughout the day.
          </p>
        </>
      )}
      <p>
        <b>Pose Guidelines:</b>
        <br />
        📸The person in the photo should be standing in a relaxed, natural
        posture that closely resembles their everyday stance. <br />
        📸 Make sure not to correct your posture while taking the photo to get
        an accurate analysis of your typical body alignment.
      </p>
      <p>
        <b>Clothing:</b>
        <br />
        📸 Wear form-fitting clothing to ensure the visibility of body structure
        (avoid baggy or loose clothing). <br />
        📸 Ensure that the arms, legs, and torso are visible for better
        assessment.
      </p>
      <p>
        <b>Additional Tips:</b>
        <br />
        📸 Lighting: Ensure good lighting to eliminate shadows that may obscure
        key features. <br />
        📸 Background: Use a plain background to avoid distractions. <br />
        📸 Camera Angle: Position the camera at shoulder height for consistent
        and accurate framing.
      </p>
    </div>
  );
};

export default UploadImages;
