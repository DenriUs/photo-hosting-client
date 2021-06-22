export interface User {
  id: string;
  login: string;
  email: string;
  profilePhoto: string;
  backgroundPhoto: string;
  favoritePhotoIds: string[];
  accessedPhotoIds: string[];
}

export interface Photo {
  _id: string;
  authorId: string;
  authorLogin: string;
  originalName: string;
  hostUrl: string;
  creationDate: string;
  latitude: number;
  longitude: number;
  width?: number;
  height?: number;
  cameraModel?: string;
  apertureValue?: number;
  exposureTime?: number;
  focalLenght?: number;
  iso?: number;
  isShared?: boolean;
}
