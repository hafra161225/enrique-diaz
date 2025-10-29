import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController, IonInputPasswordToggle, IonFab, 
          IonFabButton, IonInputOtp  } from '@ionic/angular/standalone';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ← Import this
import { Preferences } from '@capacitor/preferences';
import { TranslationService } from '../services/translation-service';
import { ConfirmCode } from '../services/confirm-code';

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.page.html',
  styleUrls: ['./confirm-code.page.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            ReactiveFormsModule, FormsModule, IonInputPasswordToggle, 
            IonFab, IonFabButton, IonInputOtp],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmCodePage implements OnInit {
  codeForm!: FormGroup;
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  userId: any;
  isLoading= false;

  constructor(private fb: FormBuilder, 
              private actionSheetController: ActionSheetController, 
              private router: Router, 
              private confirmCodeService: ConfirmCode,
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
    Object.keys(this.codeForm.controls).forEach(key => {
      this.codeForm.get(key)?.markAsTouched();
    });
  }

  ngOnInit() {
    this.codeForm = this.fb.group({
      userId: [''],
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
    Preferences.get({ key: 'emailId' }).then(result => {
      this.codeForm.patchValue({ userId: result.value });
    });
  }

  async onLogin() {
    this.isLoading = true;

    if (this.codeForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
    
    const message = this.translationService.translate('CODE_SUCCESS');
    const something_went_wrong = this.translationService.translate('SOMETHING_WENT_WRONG');
    const timeout = this.translationService.translate('TIMEOUT_RESEND_CODE');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
    const wrong_code = this.translationService.translate('WRONG_CODE_ENTERED');
        
    this.isLoading = true;
    
    try {
      // Get form values
      const formData = this.codeForm.value;
      console.log('Great: ', formData);

      this.confirmCodeService.confirmCode(formData).subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          
          if (response && response.success == true) {
            this.codeForm.reset(); // Reset the form

            // if a user finished all the application process
            if(response.userId){
              console.log('Got user ID:', response.userId);
              await Preferences.remove({ key: 'emailId' });
              await Preferences.set({
                key: 'newPassId',
                value: response.userId,
              });

              console.log('Saved preference: ', response.userId);

              setTimeout(() => {
                  this.showToast(message, 'success');
                  this.router.navigate(['/new-password']);
              }, 2000);
            }
          } else {
            if(response?.message == "Something Went Wrong"){
              this.markFormGroupTouched();
              await this.showToast(wrong_code, 'danger');
            } else if(response?.message =="Timeout. Please resend confirm code."){
              this.markFormGroupTouched();
              await this.showToast(timeout, 'danger');
            }else{
              this.markFormGroupTouched();
              await this.showToast(something_went_wrong, 'danger');
            }
          }
        },
        error: async (error: any) => {
          // await loading.dismiss();
          this.isLoading = false;
          console.error('Login error:', error);
          
          await this.showToast(something_went_wrong, 'danger');
        }
      });
      
    } catch (error) {
      // await loading.dismiss();
      this.isLoading = false;
      console.error(unexpected_error, error);
      
      await this.showToast(unexpected_error_occured, 'danger');
    }
  }

  // resend the code
  async resendCode() {
    const resendMessage = this.translationService.translate('REENTER_EMAIL');
    await Preferences.remove({ key: 'emailId' });
    setTimeout(() => {
      this.showToast(resendMessage, 'success');
      this.router.navigate(['/forgot-password']);
    }, 2000);
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

  async goBack(){
    await Preferences.remove({ key: 'emailId' });
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
    this.codeForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Getter methods for easy access to form controls
  get code() { return this.codeForm.get('code'); }
}
