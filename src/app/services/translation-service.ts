import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations: Record<string, any> = {};
  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor(private http: HttpClient) {}

  /** Load a language JSON file */
  async loadLanguage(lang: string) {
    const data = await this.http.get(`/assets/i18n/${lang}.json`).toPromise();
    this.translations = data as any;
    this.currentLang.next(lang);
  }

  /** Return a single string translation */
  translate(key: string): string {
    const value = this.translations[key];
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return key; // fallback
    }
  }

  /** Return an array for *ngFor (always string[]) */
  translateArray(key: string): string[] {
    const value = this.translations[key];
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      return value.split(',').map(item => item.trim());
    } else {
      return [];
    }
  }

  /** Change language dynamically */
  changeLanguage(lang: string) {
    this.loadLanguage(lang);
  }
}
