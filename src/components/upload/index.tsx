import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import { StepContext } from '../../contexts/step';

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
    <>
      <h5>Load your photo.</h5>
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
    </>
  );
};

export default UploadImages;
