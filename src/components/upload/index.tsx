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

const getBase64List = async (fileList: UploadFile[]): Promise<string[]> => {
  const base64List = [];
  console.log('HERE');
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    base64List.push(file.preview);
  }

  return base64List;
};

const UploadImages: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const stepContext = useContext(StepContext);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    console.log('handleChange-fileList', fileList);

    const filteredFileList = fileList.filter(
      (file) => file.status !== 'removed'
    );
    console.log('handleChange-filteredFileList', filteredFileList);
    const listBase64 = await getBase64List(filteredFileList);
    console.log('handleChange-listBase64', listBase64);
    stepContext?.setFileList(listBase64);
    console.log('handleChange-stepContext', stepContext?.fileList);
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
