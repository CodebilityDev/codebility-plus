import { useEffect, useState } from "react";
import { ServiceImageComponentProps } from "../_types/service";
import Image from "next/image";

const ServiceImageUpload: React.FC<ServiceImageComponentProps> = ({ selectedFile, imageType }) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>();
    const [fileName, setFileName] = useState<string | undefined>();
    const [fileSize, setFileSize] = useState<string | undefined>();
  
    useEffect(() => {
      const file = selectedFile[`${imageType}File`] as File;
      
      if (file instanceof File) {
        const objectURL = URL.createObjectURL(file);
        setImageSrc(objectURL);
        setFileName(file.name);
        setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
  
        return () => {
          URL.revokeObjectURL(objectURL);
        };
      } else if (typeof file === 'string') {
        const image = selectedFile.images?.find(img => img[imageType]);
        const url = image?.[imageType]?.url;
        setImageSrc(url || file);
        setFileName(image?.[imageType]?.fileName);
        setFileSize(image?.[imageType]?.metadata?.size
          ? `${(image[imageType].metadata.size / (1024 * 1024)).toFixed(2)} MB`
          : 'Unknown size');
      } else {
        setImageSrc(undefined);
        setFileName(undefined);
        setFileSize(undefined);
      }
    }, [selectedFile, imageType]);
  
    return (
      <>
        <div className="w-24 flex items-center justify-center border border-[#3F3F46]">
          <Image
            width={60}
            height={60}
            alt={fileName || 'No Image'}
            src={imageSrc || 'https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg'}
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col items-start justify-center gap-1 p-4 text-sm border border-[#3F3F46]">
          <p>{fileName || 'No file selected'}</p>
          <p>{fileSize || 'Unknown size'}</p>
        </div>
      </>
    );
};

export default ServiceImageUpload;