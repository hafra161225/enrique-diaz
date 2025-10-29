import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Newsletter {
  private baseUrl = environment.apiUrl; // Your PHP server URL

  constructor(private http: HttpClient) { }

  addNewsletter(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const fullUrl = `${this.baseUrl}newsletter.php`;
    console.log('Nothing:', fullUrl);
    
    return this.http.post(fullUrl, userData, { headers });
  }
  
}
