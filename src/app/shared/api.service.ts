import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  updateData: any;

  postPermission(data: any) {
    return this._http.post<any>("http://localhost:3000/posts", data).pipe(map((res: any) => {
      return res;
    }))
  }
  getPermission() {
    return this._http.get<any>("http://localhost:3000/posts").pipe(map((res: any) => {
      return res;
    }))
  }
  updatePermission(data: any, id: any) {
    return this._http.put<any>("http://localhost:3000/posts/" + id, data).pipe(map((res: any) => {
      return res;
    }))
  }

  deletePermission(id: number) {
    return this._http.delete<any>("http://localhost:3000/posts/" + id).pipe(map((res: any) => {
      return res;
    }))
  }

  sendUpdateData(data: any) {
    this.updateData = data;
  }

  getUpdateData() {
    return this.updateData;
  }

}
