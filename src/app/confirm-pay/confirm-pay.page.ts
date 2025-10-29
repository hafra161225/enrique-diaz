import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          IonDatetime, IonGrid, IonRow, IonCol,ToastController,
          IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Browser } from '@capacitor/browser';
import * as allIcons from 'ionicons/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { TranslationService } from '../services/translation-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment-service';

@Component({
  selector: 'app-confirm-pay',
  templateUrl: './confirm-pay.page.html',
  styleUrls: ['./confirm-pay.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            RouterLink, IonDatetime, IonGrid, IonRow, IonCol,
            ReactiveFormsModule, FormsModule, IonAvatar, IonTextarea],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmPayPage implements OnInit {
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  isLoading= false;
  isLoadingM= false;
  selectedLang = 'en';
  locale: string = 'en-US'; // default locale
  currentTestimonial = 0;
  dateTime: any;
  freeSession= 'free-session';
  singleSession= 'single-session';
  intensiveSession= 'intensive-session';
  monthlySession= 'monthly-session';
  premiumSession= 'premium-session';
  activeType: any;
  noteForm: FormGroup;
  
  private route: ActivatedRoute = inject(ActivatedRoute);
  savedDate: any;

  constructor(private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private formBuilder: FormBuilder, // ← Keep these in constructor
              private paymentService: PaymentService,
              private cdr: ChangeDetectorRef,
              private toastController: ToastController) {
                addIcons(allIcons);
                this.initLanguagePreference();
                this.dateTimeBusiness();
                this.translationService.loadLanguage(this.selectedLang);
                this.noteForm = this.formBuilder.group({
                  userId: ['null', Validators.required],
                  package: ['null', Validators.required],
                  datetime: ['null', Validators.required],
                  price: ['null', Validators.required],
                  note: [''],
                });
                
                // then update legal name async, 
                Preferences.get({ key: 'enriqueId' }).then(result => {
                  this.noteForm.patchValue({ userId: result.value });
                });
                Preferences.get({ key: 'package' }).then(result => {
                  this.noteForm.patchValue({ package: result.value });
                });
                Preferences.get({ key: 'datetime' }).then(result => {
                  this.noteForm.patchValue({ datetime: result.value });
                });
                Preferences.get({ key: 'price' }).then(result => {
                  this.noteForm.patchValue({ price: Number(result.value)});
                });

                this.activeType= this.route.snapshot.paramMap.get('type');
                console.log('Type of session: ', this.activeType);
                if(this.activeType != this.freeSession && this.activeType != this.singleSession
                  && this.activeType != this.intensiveSession && this.activeType != this.monthlySession
                  && this.activeType != this.premiumSession
                ){
                  this.router.navigate(['/tabs/work-with-me']);
                }

            }
  async initLanguagePreference() {
    const { value } = await Preferences.get({ key: 'language' });
    if (!value) {
      await Preferences.set({ key: 'language', value: 'en' });
      this.selectedLang = 'en';
      this.translationService.loadLanguage(this.selectedLang);
      this.locale= 'en-US'
    } else {
      this.selectedLang = value;
      this.translationService.loadLanguage(this.selectedLang);
      if(this.selectedLang == 'en'){
        this.locale= 'en-US';
      }else if(this.selectedLang == 'es'){
        this.locale= 'en-ES';
      }else{
        this.locale= 'en-SV';
      }
    }
  }

  async getNumber(key: string): Promise<number> {
    return key ? Number(key) : 0;
  }

  ngOnInit() {
  }

  async gotoWorkWithMe(){
    await Preferences.remove({ key: 'datetime' });
    const bookSession= this.route.snapshot.paramMap.get('type');
    this.router.navigate(['/book-a-session', bookSession]);
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
    console.log('Language Value:', this.selectedLang);

    await Preferences.set({ key: 'language', value: this.selectedLang });
    this.translationService.changeLanguage(this.selectedLang);

    // ✅ Use full locale codes
    if (this.selectedLang === 'en') {
      this.locale = 'en-US';
    } else if (this.selectedLang === 'es') {
      this.locale = 'es-ES';
    } else if (this.selectedLang === 'sv') {
      this.locale = 'sv-SE';
    }

    // ✅ Force Angular to detect the change
    this.cdr.detectChanges();
    
    const {value} = await Preferences.get({key : 'datetime'});
    this.savedDate= value;
    this.formatDate(this.savedDate); // or your dynamic date variable
  }

  async dateTimeBusiness(){
    // get date time
    const {value} = await Preferences.get({key : 'datetime'});
    this.savedDate= value;
    this.formatDate(this.savedDate);
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
    Object.keys(this.noteForm.controls).forEach(key => {
      this.noteForm.get(key)?.markAsTouched();
    });
  }

  async onSubmit(){
    this.isLoadingM = true;

    if (this.noteForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
    
    const message = this.translationService.translate('DATE_RESERVE_SUCCESS');
    const message_not_sent= this.translationService.translate('MESSAGE_NOT_SENT');
    const login_failed_and = this.translationService.translate('LOGIN_FAILED_AND');
    const email_registered= this.translationService.translate('EMAIL_SUBSCRIBED_ALREADY');
    const login_failed = this.translationService.translate('LOGIN_FAILED');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
    const wrong_email_or_password = this.translationService.translate('WRONG_EMAIL_OR_PASSWORD');
        
    try {
      // Get form values
      const formData = this.noteForm.value;
      console.log('Great: ', formData);

      this.paymentService.startCheckout(formData).subscribe({
        next: async (response: any) => {
          this.isLoadingM= false;
          
          if (response && response.success == true) {
              this.noteForm.reset(); // Reset the form
              await this.showToast(message, 'success');
              console.log('After being successful:', response)
            // if a user finished all the application process
          } else {
            if(response?.message == "Message not sent!"){
              this.markFormGroupTouched();
              await this.showToast(message_not_sent, 'danger');
            } else {  
              this.markFormGroupTouched();
              await this.showToast(unexpected_error, 'danger');
            }
          }
        },
        error: async (error: any) => {
          this.isLoadingM= false;
          console.error('Login error:', error);
          
          await this.showToast(unexpected_error, 'danger');
        }
      });
      
    } catch (error) {
      this.isLoadingM= false;
      console.error(unexpected_error, error);
      
      await this.showToast(unexpected_error_occured, 'danger');
    }
  }

  
  ionViewDidEnter() {
    // Close the browser if it’s still open (optional)
    Browser.addListener('browserFinished', () => {
      console.log('Checkout modal closed');
    });
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);

    // map your app’s language codes to full locale codes
    const localeMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      sv: 'sv-SE',
    };

    const locale = localeMap[this.selectedLang] || 'en-US';

    this.dateTime = date.toLocaleString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.noteForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Input date
  get note() { return this.noteForm.get('note'); }

}
