import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Signup {
  private baseUrl = environment.apiUrl; // Your PHP server URL

  constructor(private http: HttpClient) { }

  signup(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const fullUrl = `${this.baseUrl}signup.php`;
    console.log('Nothing:', fullUrl);
    
    return this.http.post(fullUrl, userData, { headers });
  }
  
}
