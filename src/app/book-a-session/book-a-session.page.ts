import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          IonDatetime, IonGrid, IonRow, IonCol,ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { TranslationService } from '../services/translation-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-a-session',
  templateUrl: './book-a-session.page.html',
  styleUrls: ['./book-a-session.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            RouterLink, IonDatetime, IonGrid, IonRow, IonCol,
            ReactiveFormsModule, FormsModule],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class BookASessionPage implements OnInit {
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  isLoading= false;
  selectedLang = 'en';
  locale: string = 'en-US'; // default locale
  currentTestimonial = 0;
  isLoadingSub= false;
  freeSession= 'free-session';
  singleSession= 'single-session';
  intensiveSession= 'intensive-session';
  monthlySession= 'monthly-session';
  premiumSession= 'premium-session';
  activeType: any;
  dateTimeForm: FormGroup;
  subscribeForm: FormGroup;
  
  private route: ActivatedRoute = inject(ActivatedRoute);
  
  minDate = new Date().toISOString();

  allowedHours = Array.from({ length: 10 }, (_, i) => i + 9); // 9–18
  allowedMinutes = ['00', '30'];

  isDateEnabled = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = localDate.getDay();
    return day !== 0 && day !== 6; // Mon–Fri only
  };

  constructor(private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private formBuilder: FormBuilder, // ← Keep these in constructor
              private cdr: ChangeDetectorRef,
              private toastController: ToastController) {
                addIcons(allIcons);
                this.initLanguagePreference();
                this.translationService.loadLanguage(this.selectedLang);
                this.dateTimeForm = this.formBuilder.group({
                  userId: ['null'],
                  date: ['', [Validators.required]],
                });
                
                // then update legal name async, 
                Preferences.get({ key: 'enriqueId' }).then(result => {
                  this.dateTimeForm.patchValue({ userId: result.value });
                });
                this.activeType= this.route.snapshot.paramMap.get('type');
                console.log('Type of session: ', this.activeType);
                if(this.activeType != this.freeSession && this.activeType != this.singleSession
                  && this.activeType != this.intensiveSession && this.activeType != this.monthlySession
                  && this.activeType != this.premiumSession
                ){
                  this.router.navigate(['/tabs/work-with-me']);
                }
                
                this.subscribeForm = this.formBuilder.group({
                  email: ['', [Validators.required, Validators.email]],
                });
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

  ngOnInit() {
  }

  gotoWorkWithMe(){
    this.router.navigate(['/tabs/work-with-me']);
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
  }
  onDateTimeChange(event: any) {
    console.log('Selected date/time:', event.detail.value);
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
    Object.keys(this.dateTimeForm.controls).forEach(key => {
      this.dateTimeForm.get(key)?.markAsTouched();
    });
  }

  async onSubmit(){
    this.isLoading = true;

    if (this.dateTimeForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
    
    
    await Preferences.set({ key: 'datetime', value: this.dateTimeForm.value.date });
    console.log('Active package:', this.activeType);

    if(this.activeType == this.freeSession){    
      const price : number= 0;
      const packageName = 'Discovery Session';
      await Preferences.set({ key: 'price', value: price.toString() });
      await Preferences.set({ key: 'package', value: packageName });
    }else if(this.activeType == this.singleSession){
      const price : number= 50;
      const packageName = 'Single Coaching Session';
      await Preferences.set({ key: 'price', value: price.toString() });
      await Preferences.set({ key: 'package', value: packageName });
    }else if(this.activeType == this.intensiveSession){
      const price : number= 100;
      const packageName = 'Intensive Breakthrough Session';
      await Preferences.set({ key: 'price', value: price.toString() });
      await Preferences.set({ key: 'package', value: packageName });
    }else if(this.activeType == this.monthlySession){
      const price : number= 400;
      const packageName = 'Monthly Coaching (Basic)';
      await Preferences.set({ key: 'price', value: price.toString() });
      await Preferences.set({ key: 'package', value: packageName });
    }else{
      const price : number= 500;
      const packageName = 'Premium Transformation';
      await Preferences.set({ key: 'price', value: price.toString() });
      await Preferences.set({ key: 'package', value: packageName });
    }
    const message = this.translationService.translate('DATE_RESERVE_SUCCESS');
    setTimeout(() => {
      this.showToast(message, 'success');
      this.isLoading= false;
      this.dateTimeForm.reset();
      const sessionType = this.activeType;
      this.router.navigate(['/confirm-pay', sessionType]);
    }, 4000);
  }

  async onSubscribe(){
    this.isLoadingSub= true;

    if (this.subscribeForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
        
    const message = this.translationService.translate('SUBSCRIBED');
    setTimeout(() => {
      this.showToast(message, 'success');
      this.isLoadingSub= false;
      this.subscribeForm.reset();
      this.router.navigate(['/tabs/home']);
    }, 4000);

  }

  // Input date
  get date() { return this.dateTimeForm.get('date'); }
}
