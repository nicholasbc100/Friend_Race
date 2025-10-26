export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface Player {
  name: string;
  originalImage: ImageFile | null;
  faceImage: string | null;
  isLoading: boolean;
}
