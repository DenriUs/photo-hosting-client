export interface User {
  id: string;
  login: string;
  email: string;
}

export interface Photo {
  id: string;
  authorId: string;
  url: string;
  creationDate: number;
  locationLatitude?: number;
  locationLongitude?: number;
}
