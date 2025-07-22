import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private zoomLevel = new BehaviorSubject<number>(1);
  private zoomStep: number = 0.1;
  private maxZoom: number = 2;
  private minZoom: number = 0.5;
  public check :any;
  zoomLevel$ = this.zoomLevel.asObservable();
  zoomIn() {
    if (this.zoomLevel.value < this.maxZoom) {
      this.zoomLevel.next(this.zoomLevel.value + this.zoomStep);
    }
  }
  zoomOut() {
    if (this.zoomLevel.value > this.minZoom) {
      this.zoomLevel.next(this.zoomLevel.value - this.zoomStep);
    }
  }
  resetZoom() {
    this.zoomLevel.next(1);
  }
  searchCountry (name:string):Observable <any>{
    return this.http.get(`${this.apiUrl}/name/${name}`)
  }

  public apiUrl = 'http://localhost:3000/api';
  
  constructor(private http:HttpClient){}

  // getAll(entity: string) {
  //   return this.http.get<any[]>(`${this.apiUrl}/${entity}`);
  // }
  getAll(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }

  post(entity: string, data: any) {
    return this.http.post(`${this.apiUrl}/${entity}`, data);
  }

  put(entity: string, id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${entity}/${id}`, data);
  }

  delete(entity: string, id: string) {
    return this.http.delete(`${this.apiUrl}/${entity}/${id}`);
  }

  // 🔐 Login
  loginUser(data: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  // 🔁 Reset Password
  resetPassword(data: any) {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, data);
  }
}
