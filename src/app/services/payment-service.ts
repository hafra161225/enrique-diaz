import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiUrl; // Your PHP server URL

  constructor(private http: HttpClient) { }

  startCheckout(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const fullUrl = `${this.baseUrl}payment.php`;
    console.log('Starting checkout:', fullUrl);
    return this.http.post(fullUrl, userData, { headers });

  }

}
