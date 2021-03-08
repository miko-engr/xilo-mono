import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Flow } from "../models/flow.model";
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class FlowService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'flow';

  constructor(private http: HttpClient) {}

  //delete a flow
  delete(flow: Flow) {
    return this.http.delete(this.apiUrl + '/' + flow.id);
  }

  // Get one flow or by company
  //get(flow?: Flow): Observable<Flow[]> {
    get(flow?: Flow){
      const flowId = flow ? '/' + flow : '';
      return this.http.get(this.apiUrl + flowId);
    //   .pipe(map(result =>
    //     result['obj']
    //   ));
  }

  // Get one flow or by company
    getNewLeadFlow(){
      return this.http.get(`${this.apiUrl}/new/lead`);
  }

  findSearch(searchTitle){
    //const searchTitle = flow ? '/' + flow : '';
    let searchData = {searchTitle : searchTitle};
    return this.http.post(this.apiUrl + '/search', searchData);
  }

  // Update a flow
  patch(flow: Flow) {
        return this.http.patch(this.apiUrl + '/edit' + flow.id, flow);
  }

  // Create a new flow
  post(flow: Flow) {
      return this.http.post(this.apiUrl, flow);
  }

  getList() {
    return this.http.get(`${this.apiUrl}`);
  }

}
