import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendNewsletter {
  private baseUrl = environment.apiUrl; // Your PHP server URL

  constructor(private http: HttpClient) { }

  sendNewsletter(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const fullUrl = `${this.baseUrl}send-newsletter.php`;
    console.log('sending:', fullUrl);
    return this.http.post(fullUrl, userData, { headers });

  }
  
}
