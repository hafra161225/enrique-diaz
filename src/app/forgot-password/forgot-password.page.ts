import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController, IonInputPasswordToggle, IonFab, 
          IonFabButton, IonInput  } from '@ionic/angular/standalone';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ← Import this
import { Preferences } from '@capacitor/preferences';
import { TranslationService } from '../services/translation-service';
import { ForgotPassword } from '../services/forgot-password';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            ReactiveFormsModule, FormsModule, IonInputPasswordToggle, 
            IonFab, IonFabButton, IonInput],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordPage implements OnInit {
  forgotForm!: FormGroup;
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  isLoading= false;

  constructor(private fb: FormBuilder, 
              private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private forgotPasswordService: ForgotPassword,
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
    Object.keys(this.forgotForm.controls).forEach(key => {
      this.forgotForm.get(key)?.markAsTouched();
    });
  }

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onLogin() {
    this.isLoading = true;

    if (this.forgotForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
    
    const message = this.translationService.translate('RESET_PASSWORD_SUCCESS');
    const cannot_find_email = this.translationService.translate('CANNOT_FIND_EMAIL');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
    const failed_to_send_code= this.translationService.translate('FAILED_TO_SEND_CODE');
    
    try {
      // Get form values
      const formData = this.forgotForm.value;
      console.log('Great: ', formData);

      this.forgotPasswordService.forgotPassword(formData).subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          
          if (response && response.success == true) {
            this.forgotForm.reset(); // Reset the form

            // if a user finished all the application process
            if(response.userId){
              console.log('Got user ID:', response.userId);
              await Preferences.set({
                key: 'emailId',
                value: response.userId,
              });

              console.log('Saved preference: ', response.userId);

              setTimeout(() => {
                  this.showToast(message, 'success');
                  this.router.navigate(['/confirm-code']);
              }, 2000);
            }
          } else {
            if(response?.message == "Can't find your  email"){
              this.markFormGroupTouched();
              await this.showToast(cannot_find_email, 'danger');
            } else {  
              this.markFormGroupTouched();
              await this.showToast(cannot_find_email, 'danger');
            }
          }
        },
        error: async (error: any) => {
          // await loading.dismiss();
          this.isLoading = false;
          console.error('Login error:', error);
          
          await this.showToast(failed_to_send_code, 'danger');
        }
      });
      
    } catch (error) {
      // await loading.dismiss();
      this.isLoading = false;
      console.error(unexpected_error, error);
      
      await this.showToast(unexpected_error_occured, 'danger');
    }
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

  goToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

  // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.forgotForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Getter methods for easy access to form controls
  get email() { return this.forgotForm.get('email'); }

}
