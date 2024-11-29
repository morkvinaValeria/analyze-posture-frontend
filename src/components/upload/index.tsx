import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import { StepContext } from '../../contexts/step';

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

    console.log(listWithBase64.length);
    if (listWithBase64.length >= 1) {
      stepContext?.setIsNextValid(true);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className={styles.uploadContainer}>
      <h5>Upload Your Photos</h5>
      <p>
        To receive an accurate assessment of your posture, please provide clear
        and properly aligned photos. Follow the instructions below to ensure the
        best results.
      </p>
      <br />
      <Upload
        multiple={true}
        action="http://127.0.0.1:8000/upload"
        method="POST"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 3 ? null : uploadButton}
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
      <h5>Photo Requirements</h5>
      <p>
        <b>Number of Photos:</b>
        <br />
        You can upload one or more photos (maximum is 3). The system requires at
        least one image of your body in one of the following positions: front
        view, side view or back view.
      </p>
      <p>
        <b>Pose Guidelines:</b>
        <br />
        The person in the photo should be standing in a relaxed, natural posture
        that closely resembles their everyday stance. Make sure not to correct
        your posture while taking the photo to get an accurate analysis of your
        typical body alignment.
      </p>
      <p>
        <b>Clothing:</b>
        <br />
        Wear form-fitting clothing to ensure the visibility of body structure
        (avoid baggy or loose clothing). Ensure that the arms, legs, and torso
        are visible for better assessment.
      </p>
    </div>
  );
};

export default UploadImages;
