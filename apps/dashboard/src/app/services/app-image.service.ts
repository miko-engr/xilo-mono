import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AppImage } from "../models/app-image.model";

@Injectable()
export class AppImageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'app-image';

  constructor(private http: HttpClient) {}

  //delete an App Image
  delete(appImage: AppImage) {
    return this.http.delete(this.apiUrl + '/' + appImage.id);
  }

  // Get One App Image
  getById(appImage?: AppImage) {
      const appImageId = appImage ? '/' + appImage.id : '';
    return this.http.get(this.apiUrl + appImageId);
  }

  // Get all AppImages
  getAll() {
      return this.http.get(this.apiUrl + '/');
  }

  // Update an App Image
  patch(appImage: AppImage) {
        return this.http.patch(this.apiUrl + '/' + appImage.id, appImage);
  }

  // Create a new AppImage
  post(appImage: AppImage) {
      return this.http.post(this.apiUrl, appImage);
  }

  // Create a new AppImage
  bulkCreate(appImages: AppImage[]) {
      return this.http.post(this.apiUrl + '/bulk', appImages);
  }
}
