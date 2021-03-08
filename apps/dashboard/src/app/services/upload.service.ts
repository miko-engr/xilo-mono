import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable()
export class UploadService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'upload';
    bucketUrl = environment.S3_BUCKET_URL;
    constructor(private http: HttpClient) {}

    postImage(formatData) {
        return this.http.post(this.apiUrl + '/logo', formatData);
    }
}
