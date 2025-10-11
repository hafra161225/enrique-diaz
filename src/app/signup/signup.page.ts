import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController, IonInputPasswordToggle, IonFab, 
          IonFabButton  } from '@ionic/angular/standalone';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ← Import this
import { Preferences } from '@capacitor/preferences';
import { TranslationService } from '../services/translation-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            ReactiveFormsModule, FormsModule, IonInputPasswordToggle, 
            IonFab, IonFabButton],
  encapsulation: ViewEncapsulation.None,
})
export class SignupPage implements OnInit {
  loginForm!: FormGroup;
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  isLoading= false;

  constructor(private fb: FormBuilder, 
              private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private toastController: ToastController) { 
              addIcons(allIcons);
              this.initLanguagePreference();
              this.translationService.loadLanguage(this.selectedLang);
            }

  async initLanguagePreference() {
    const { value } = await Preferences.get({ key: 'language' });
    if (!value) {
      await Preferences.set({ key: 'language', value: 'en' });
      this.selectedLang = 'en';
      this.translationService.loadLanguage(this.selectedLang);
    } else {
      this.selectedLang = value;
      this.translationService.loadLanguage(this.selectedLang);
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    this.isLoading = true;

    if (this.loginForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
    
    const message = this.translationService.translate('MESSAGE_LOGIN_SUCCESS');
    setTimeout(() => {
      this.showToast(message, 'success');
      this.isLoading= false;
      this.loginForm.reset();
      this.router.navigate(['/login']);
    }, 4000);
  }

  getLangShort(lang: string): string {
    switch (lang) {
      case 'en': return 'EN';
      case 'sv': return 'SV';
      case 'es': return 'ES';
      default: return '';
    }
  }

  async onLanguageChange(event: any) {
    this.selectedLang = event.detail.value;
    await Preferences.set({ key: 'language', value: this.selectedLang });
    this.translationService.changeLanguage(this.selectedLang);
  }

  goBack(){
    this.router.navigate(['/tabs/home']);
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.loginForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Getter methods for easy access to form controls
  get name() { return this.loginForm.get('name'); }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
