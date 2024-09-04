export type ImageMetadata = {
    fileName: string;
    metadata: {
      eTag: string;
      size: number;
      mimetype: string;
      cacheControl: string;
      lastModified: string;
      contentLength: number;
      httpStatusCode: number;
    };
    createdAt: string;
    url: string;
};
  
export type ServiceImages = {
    mainImage?: ImageMetadata;
    picture1?: ImageMetadata;
    picture2?: ImageMetadata;
};
  
export type Service = {
    id?: string;
    name: string;
    category: string;
    description: string;
    mainImage?: File | null;
    picture1?: File | null;
    picture2?: File | null;
    images: ServiceImages[];
};

export type ServiceSelectedFile = {  
    mainImageFile?: File | string | null;
    picture1File?: File | string | null;
    picture2File?: File | string | null;
    images?: ServiceImages[]; 
}

export type ServiceImageComponentProps = {
    selectedFile: ServiceSelectedFile;
    imageType: 'mainImage' | 'picture1' | 'picture2';
};