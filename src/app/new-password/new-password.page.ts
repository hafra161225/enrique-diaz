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
import { NewPassword } from '../services/new-password';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
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
export class NewPasswordPage implements OnInit {
  newPassForm!: FormGroup;
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  isLoading= false;

  constructor(private fb: FormBuilder, 
              private actionSheetController: ActionSheetController, 
              private router: Router, 
              private newPasswordService: NewPassword,
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
    Object.keys(this.newPassForm.controls).forEach(key => {
      this.newPassForm.get(key)?.markAsTouched();
    });
  }

  ngOnInit() {
    this.newPassForm = this.fb.group({
      userId: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      conf_password: ['', [Validators.required, Validators.minLength(6)]]
    });
    Preferences.get({ key: 'newPassId' }).then(result => {
      this.newPassForm.patchValue({ userId: result.value });
    });
  }

  async onLogin() {
    this.isLoading = true;

    if (this.newPassForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
    
    if(this.newPassForm.value.password !== this.newPassForm.value.conf_password){
      this.showToast(this.translationService.translate('PASSWORD_MISMATCH'), 'warning');
      this.isLoading= false;
      return;
    }
    
    const message = this.translationService.translate('PASSWORD_UPDATE_SUCCESS');
    const new_not_old= this.translationService.translate('OLD_PASSWORD_SAME_AS_NEW');
    const pass_reset_failed= this.translationService.translate('PASSWORD_RESET_FAILED');
    const something_went_wrong = this.translationService.translate('SOMETHING_WENT_WRONG');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
            
    this.isLoading = true;
    
    try {
      // Get form values
      const formData = this.newPassForm.value;
      console.log('Great: ', formData);

      this.newPasswordService.updatePassword(formData).subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          
          if (response && response.success == true) {
            this.newPassForm.reset(); // Reset the form

            // if a user finished all the application process
            if(response.userId){
              console.log('Got user ID:', response.userId);
              await Preferences.remove({ key: 'newPassId' }); 

              console.log('Saved preference: ', response.userId);

              setTimeout(() => {
                  this.showToast(message, 'success');
                  this.router.navigate(['/login']);
              }, 2000);
            }
          } else {
            if(response?.message == "Your old password can not be the same as your new password"){
              this.markFormGroupTouched();
              await this.showToast(new_not_old, 'danger');
            }else if(response?.message == "Password reset failed!"){
              this.markFormGroupTouched();
              await this.showToast(pass_reset_failed, 'danger');
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
    await Preferences.remove({ key: 'newPassId' }); 
    this.router.navigate(['/tabs/home']);
  }

  goToSignup(){
    this.router.navigate(['/signup']);
  }

  goToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

  // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.newPassForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Getter methods for easy access to form controls
  get password() { return this.newPassForm.get('password'); }
  get confirm_pass() { return this.newPassForm.get('confirm_pass'); }
// C-383662-1999
}
