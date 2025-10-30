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
import { Capacitor } from '@capacitor/core';
import { SafePipe  } from '../pipes/safe-pipe';
import { loadStripe } from '@stripe/stripe-js';
import { FinalizePaymentService } from '../services/finalize-payment';

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
            ReactiveFormsModule, FormsModule, IonAvatar, 
            IonTextarea, SafePipe ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmPayPage implements OnInit {
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  isLoading= false;
  isLoadingM= false;
  isLoadingP= false;
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
  paymentForm: FormGroup;
  noteForm: FormGroup;
  paymentUrl: string = '';
  showPaymentModal = false;
  paymentSuccess= false;
  paymentFailure= false;
  paidAmount: any;
  packageNamed: any;
  reservationDate: any;

  
  stripePromise = loadStripe('pk_test_51SMn20FqodbQ1fVEaKAs9FSRMXGr0q5KdrTsUcQSRaLTlI5opfXvUpCm0ByW0o2DIHwSVc9vwKt9MdY5funkXAjS00nVnJfwWN');
  
  private route: ActivatedRoute = inject(ActivatedRoute);
  savedDate: any;

  constructor(private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private formBuilder: FormBuilder, // ← Keep these in constructor
              private paymentService: PaymentService,
              private cdr: ChangeDetectorRef,
              private finalizePaymentService: FinalizePaymentService,
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

                this.paymentForm= this.formBuilder.group({
                  userId: ['null', Validators.required],
                  name: ['', Validators.required],
                  number: ['', Validators.required],
                  expiry: ['', Validators.required],
                  cvc: ['', Validators.required],
                  price: ['null', Validators.required]
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
                Preferences.get({ key: 'price' }).then(result => {
                  this.paymentForm.patchValue({ price: Number(result.value)});
                });
                Preferences.get({ key: 'enriqueId' }).then(result => {
                  this.paymentForm.patchValue({ userId: result.value });
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

  async startPayment(url: string) {
    this.paymentUrl = url;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.paymentUrl = '';
  }

  async closePaymentSuccessModal() {
    this.paymentSuccess= false;
    // await Preferences.clear();
    setTimeout(() => {
      this.router.navigate(['/tabs/work-with-me']);
    }, 2000);
  }

  // NEW FUNCTION TO PAYMENT
  async openPaymentModal() {
    this.showPaymentModal = true;

    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Payment error:', error);
      } else {
        console.log('Payment method created:', paymentMethod);
        // send paymentMethod.id to backend PHP for confirmation/charge
      }
    });
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

              if(response.userId && response.url){
                  const urlM= response.url;
                  this.openPaymentModal();
              }else{
                await this.showToast(message_not_sent, 'danger');
              }
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

  // all functions associated with payment
  // Format card number: add spaces every 4 digits
  formatCardNumber(event: any) {
    let value = event.target.value;

    // Remove all non-digit characters
    value = value.replace(/\D/g, '');

    // Limit to 16 digits (standard card length)
    if (value.length > 16) {
      value = value.substring(0, 16);
    }

    // Add spaces after every 4 digits
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();

    // Update the input display and form control
    event.target.value = formattedValue;
    this.paymentForm.get('number')?.setValue(formattedValue, { emitEvent: false });
  }


  // Format expiry: ensure MM/YY
  formatExpiry(event: any) {
    let value = event.target.value;

    // Remove any non-digit or slash characters
    value = value.replace(/[^\d]/g, '');

    // Limit to 4 digits (MMYY)
    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    // Auto-insert slash after month
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    // Validate month (optional)
    const month = parseInt(value.substring(0, 2), 10);
    if (month > 12) {
      value = '12' + value.substring(2); // Cap at 12
    }

    // Update input and form control
    event.target.value = value;
    this.paymentForm.get('expiry')?.setValue(value, { emitEvent: false });
  }

  // Luhn check for card number
  validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s+/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Validate expiry (MM/YY)
  validateExpiry(expiry: string): boolean {
    const match = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;

    const now = new Date();
    const expiryDate = new Date(year, month - 1, 1);

    return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  }

  async paymentSuccessful(){
    this.paymentSuccess= true;
    const {value}= await Preferences.get({key : 'datetime'});
    const dateRes= value;
    this.reservationDate= this.formatDate(dateRes ?? '');

    const {value: amount}= await Preferences.get({key : 'price'});
    this.paidAmount= '$'+amount+'.00';

    const {value: packageN}= await Preferences.get({key : 'package'});
    if(packageN == this.freeSession){
      this.packageNamed= this.translationService.translate('FREE_SESSION');
    }else if(packageN == this.singleSession){
      this.packageNamed= this.translationService.translate('SINGLE_SESSION');
    }else if(packageN == this.intensiveSession){
      this.packageNamed= this.translationService.translate('INTENSIVE_SESSION');
    }else if(packageN == this.monthlySession){
      this.packageNamed= this.translationService.translate('MONTHLY_SESSION');
    }else if(packageN == this.premiumSession){
      this.packageNamed= this.translationService.translate('PREMIUM_SESSION');
    }
    
  }

  // open payment failed modal
  async paymentFailed(){
    this.paymentFailure= true;
  }

  async closePaymentFailedModal() {
    this.paymentFailure= false;
    // await Preferences.clear();
    setTimeout(() => {
      this.router.navigate(['/tabs/work-with-me']);
    }, 2000);
  }

  // confirma payment 
  async onPaying(){
    this.isLoadingP = true;

    if (this.paymentForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }

    const message = this.translationService.translate('PAYMENT_SUCCESS');
    const message_not_sent= this.translationService.translate('PAYMENT_FAILED');
    const login_failed_and = this.translationService.translate('LOGIN_FAILED_AND');
    const email_registered= this.translationService.translate('EMAIL_SUBSCRIBED_ALREADY');
    const login_failed = this.translationService.translate('LOGIN_FAILED');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
    const wrong_email_or_password = this.translationService.translate('WRONG_EMAIL_OR_PASSWORD');
        
    try {
      // Get form values
      const formData = this.paymentForm.value;
      console.log('Great: ', formData);

      this.finalizePaymentService.finalizePayment(formData).subscribe({
        next: async (response: any) => {
          this.isLoadingP= false;
          
          if (response && response.success == true) {
              this.paymentForm.reset(); // Reset the form
              await this.showToast(message, 'success');
              console.log('After being successful:', response)

              if(response.userId && response.charge_id){
                  this.paymentSuccessful();
              }else{
                this.paymentFailed();
              }
            // if a user finished all the application process
          } else {
            if(response?.message == "Message not sent!"){
              console.log('Bemoaning failed:', response);
              this.paymentFailed();
              this.markFormGroupTouched();
              await this.showToast(message_not_sent, 'danger');
            } else {  
              console.log('Bemoaning failed:', response);
              this.paymentFailed();
              this.markFormGroupTouched();
              await this.showToast(unexpected_error, 'danger');
            }
          }
        },
        error: async (error: any) => {
          this.isLoadingP= false;
          console.error('Login error:', error);
          
          await this.showToast(unexpected_error, 'danger');
        }
      });
      
    } catch (error) {
      this.isLoadingP= false;
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
