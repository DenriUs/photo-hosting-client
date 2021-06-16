export interface Photo {
  id: string;
  authorId: string;
  url: string;
  creationDate: number;
  locationLatitude?: number;
  locationLongitude?: number;
}
