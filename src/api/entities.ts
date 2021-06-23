export interface User {
  _id: string;
  login: string;
  email: string;
  profilePhotoUrl: string;
  backgroundPhotoUrl: string;
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

export interface Comment {
  id: string;
  creationDate: string;
  text: string;
  photoId: string;
  authorId: User;
}
