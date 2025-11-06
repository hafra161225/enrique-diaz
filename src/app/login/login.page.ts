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
import { Login } from '../services/login';
import { AdminLogin } from '../services/admin-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            ReactiveFormsModule, FormsModule, IonInputPasswordToggle, 
            IonFab, IonFabButton, IonInput],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  isLoading= false;

  constructor(private fb: FormBuilder, 
              private actionSheetController: ActionSheetController, 
              private router: Router, 
              private loginService: Login,
              private adminLogin: AdminLogin,
              public translationService: TranslationService,
              private toastController: ToastController) { 
              addIcons(allIcons);
              this.initLanguagePreference();
              this.translationService.loadLanguage(this.selectedLang);
              this.loginForm = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]]
              });
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
  }

  async onLogin() {
    this.isLoading = true;

    if (this.loginForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }

    const email= this.loginForm.value.email;

    if(email.startsWith('//')){
      this.showToast('Entering Admins', 'success');
      const cleanEmail= email.replace('//','');
      this.loginForm.patchValue({ email: cleanEmail });
      this.specialLogin();
    }else{
      const message = this.translationService.translate('MESSAGE_LOGIN_SUCCESS');
      const login_failed_and = this.translationService.translate('LOGIN_FAILED_AND');
      const login_failed = this.translationService.translate('LOGIN_FAILED');
      const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
      const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
      const wrong_email_or_password = this.translationService.translate('WRONG_EMAIL_OR_PASSWORD');
      
      this.isLoading = true;
      
      try {
        // Get form values
        const formData = this.loginForm.value;
        console.log('Great: ', formData);

        this.loginService.login(formData).subscribe({
          next: async (response: any) => {
            this.isLoading = false;
            
            if (response && response.success == true) {
              this.loginForm.reset(); // Reset the form

              // if a user finished all the application process
              if(response.userId){
                console.log('Got user ID:', response.userId);
                await Preferences.set({
                  key: 'enriqueId',
                  value: response.userId,
                });

                console.log('Saved preference: ', response.userId);

                setTimeout(() => {
                    this.showToast(message, 'success');
                    this.router.navigate(['/tabs/home']);
                }, 2000);
              }
            } else {
              if(response?.message == "Wrong  email or password!"){
                this.markFormGroupTouched();
                await this.showToast(wrong_email_or_password, 'danger');
              } else {  
                this.markFormGroupTouched();
                await this.showToast(login_failed, 'danger');
              }
            }
          },
          error: async (error: any) => {
            // await loading.dismiss();
            this.isLoading = false;
            console.error('Login error:', error);
            
            await this.showToast(login_failed_and, 'danger');
          }
        });
        
      } catch (error) {
        // await loading.dismiss();
        this.isLoading = false;
        console.error(unexpected_error, error);
        
        await this.showToast(unexpected_error_occured, 'danger');
      }

    }

  }

  async specialLogin() {
        
    const message = this.translationService.translate('MESSAGE_LOGIN_SUCCESS');
    const login_failed_and = this.translationService.translate('LOGIN_FAILED_AND');
    const login_failed = this.translationService.translate('LOGIN_FAILED');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
    const wrong_email_or_password = this.translationService.translate('WRONG_EMAIL_OR_PASSWORD');
    
    this.isLoading = true;
    
    try {
      // Get form values
      const formData = this.loginForm.value;
      console.log('Admin coming: ', formData);

      this.adminLogin.login(formData).subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          
          if (response && response.success == true) {
            console.log('returning data:', response);

            // if a user finished all the application process
            if(response.adminId){
              this.loginForm.reset(); // Reset the form
              console.log('Got admin ID:', response.adminId);
              await Preferences.set({
                key: 'adminId',
                value: response.adminId,
              });
              await Preferences.get({ key: 'adminId' }).then((result) => {
                console.log('Retrieved adminId from Preferences:', result.value);
              });

              console.log('Saved preference: ', response.adminId);

              setTimeout(() => {
                  this.showToast(message, 'success');
                  this.router.navigate(['/dashboard']);
              }, 2000);
            }
          } else {
            if(response?.message == "Wrong  email or password!"){
              this.markFormGroupTouched();
              await this.showToast(wrong_email_or_password, 'danger');
            } else {  
              this.markFormGroupTouched();
              await this.showToast(login_failed, 'danger');
            }
          }
        },
        error: async (error: any) => {
          // await loading.dismiss();
          this.isLoading = false;
          console.error('Login error:', error);
          
          await this.showToast(login_failed_and, 'danger');
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

  goToSignup(){
    this.router.navigate(['/signup']);
  }

  goToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

  // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.loginForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Getter methods for easy access to form controls
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
