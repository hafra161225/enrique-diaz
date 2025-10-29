import { Component, CUSTOM_ELEMENTS_SCHEMA, 
          inject, AfterViewInit, ViewEncapsulation, 
          ChangeDetectorRef,  OnDestroy,
          ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView,
          IonAccordion, IonAccordionGroup, ToastController } from '@ionic/angular/standalone';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { TranslationService } from '../services/translation-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Newsletter } from '../services/newsletter';

@Component({
  selector: 'app-work-with-me',
  templateUrl: './work-with-me.page.html',
  styleUrls: ['./work-with-me.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            IonSegment, IonSegmentButton, IonSegmentContent, 
            IonSegmentView, IonAccordion, IonAccordionGroup,
            RouterLink, ReactiveFormsModule,],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkWithMePage implements AfterViewInit {
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  currentTestimonial = 0;
  isLoadingSub= false;
  freeSession= 'free-session';
  singleSession= 'single-session';
  intensiveSession= 'intensive-session';
  monthlySession= 'monthly-session';
  premiumSession= 'premium-session';
  subscribeForm: FormGroup;
  enriqueId: any;
  testimonials = [
    {
      quote: "The coaching sessions transformed my leadership approach completely. I now lead with confidence and clarity.",
      author: "Sarah Johnson",
      title: "CEO, TechStart"
    },
    {
      quote: "Working with this coach helped our team achieve 40% better performance and stronger collaboration.",
      author: "Michael Chen", 
      title: "VP Operations, InnovateCorp"
    },
    {
      quote: "The personalized approach and actionable insights made all the difference in my career growth.",
      author: "Emily Rodriguez",
      title: "Director, GrowthCo"
    }
  ];

  constructor(private formBuilder: FormBuilder, 
              private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private cdr: ChangeDetectorRef,
              private newsletterService: Newsletter,
              private toastController: ToastController) {
                addIcons(allIcons);
                this.initLanguagePreference();
                this.checkUserSession();
                this.translationService.loadLanguage(this.selectedLang);
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
    } else {
      this.selectedLang = value;
      this.translationService.loadLanguage(this.selectedLang);
    }
  }

  checkUserSession() {
    Preferences.get({ key: 'enriqueId' }).then(result => {
      this.enriqueId = result.value;
    });
  }

  onSubmitEmail(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.signupError = true;
      this.signupMessage = 'Please enter a valid email.';
      return;
    }
    this.signupError = false;
    this.signupMessage = 'Super, we\'ll be in touch';
    form.reset();
  }

  // async showCookieActionSheet() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Cookie Policy',
  //     subHeader: 'This website uses cookies to enhance your experience.',
  //     buttons: [
  //       {
  //         text: 'Learn More',
  //         handler: () => {
  //           // You can add navigation to privacy policy here
  //           console.log('Learn more clicked');
  //         }
  //       },
  //       {
  //         text: 'Accept',
  //         role: 'confirm',
  //         handler: () => {
  //           console.log('Cookies accepted');
  //         }
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    this.updateTestimonialDisplay();
  }

  prevTestimonial() {
    this.currentTestimonial = this.currentTestimonial === 0 ? this.testimonials.length - 1 : this.currentTestimonial - 1;
    this.updateTestimonialDisplay();
  }

  updateTestimonialDisplay() {
    const slides = document.querySelectorAll('.testimonial-slide');
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentTestimonial);
    });
  }

  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Here you would typically send the email to your backend
    alert('Thank you for subscribing! You\'ll receive our latest insights soon.');
    form.reset();
  }

  ngAfterViewInit(): void {
    // To get a value
    Preferences.get({ key: 'language' }).then(({ value }) => {
      console.log(value);
    });
    if (typeof window === 'undefined') { return; }
    gsap.registerPlugin(ScrollTrigger);

    // Parallax background
    const bg = document.querySelector('.bg-gradient');
    if (bg) {
      gsap.to(bg, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });
    }

    // Reveal up elements
    const revealUpEls = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="reveal-up"]'));
    revealUpEls.forEach((el) => {
      const delay = Number(el.dataset['delay'] || 0);
      gsap.fromTo(el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay,
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      );
    });

    // Fade in elements
    const fadeInEls = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="fade-in"]'));
    fadeInEls.forEach((el) => {
      const delay = Number(el.dataset['delay'] || 0);
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, delay, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // Stagger cards
    const cardEls = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="stagger-card"]'));
    gsap.fromTo(cardEls,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: document.querySelector('.programs .grid'), start: 'top 80%' }
      }
    );
    // nothing at all

    // Testimonials stagger
    const testiEls = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="stagger-testi"]'));
    gsap.fromTo(testiEls,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: document.querySelector('.testimonials'), start: 'top 85%' }
      }
    );

    // Split words for headlines marked with [data-anim="words"]
    const wordTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="words"]'));
    wordTargets.forEach((el) => {
      const originalHtml = el.innerHTML;
      // Clean up any Angular attributes that might be in the text content
      const cleanHtml = originalHtml.replace(/_ngcontent-[^=]*="[^"]*"/g, '');
      const parts = cleanHtml.split(/(\s+|<br\s*\/?>)/gi);
      const wrapped = parts.map((p) => {
        if (p.match(/^\s+$/) || p.startsWith('<br')) { return p; }
        return `<span class="word-split"><span class="word">${p}</span></span>`;
      }).join('');
      el.innerHTML = wrapped;
      const words = Array.from(el.querySelectorAll<HTMLElement>('.word-split .word'));
      gsap.set(words, { yPercent: 120, opacity: 0, rotate: 6, filter: 'blur(4px)' });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        filter: 'blur(0px)',
        ease: 'power3.out',
        stagger: { each: 0.05, from: 'start' },
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true }
      });
    });

    // Floating portrait
    const floatEl = document.querySelector<HTMLElement>('[data-anim="float"]');
    if (floatEl) {
      gsap.to(floatEl, { y: -12, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    // Orbs parallax
    const orbs = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="orb"]'));
    orbs.forEach((orb, index) => {
      gsap.to(orb, { y: (index % 2 === 0 ? 1 : -1) * 40, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
  }

  // go to services page
  gotoAboutMe(){
    this.router.navigate(['/tabs/about-me']);
  }

  gotoPodcasts(){
    this.router.navigate(['/tabs/podcasts']);
  }

  gotoContact(){
    this.router.navigate(['/tabs/contact']);
  }

  gotoReservations(){
    this.router.navigate(['/tabs/reservations']);
  }
  // go to work with me page
  gotoWorkWithMe(){
    this.router.navigate(['/tabs/work-with-me']);
  }

  onSignup() {
    // handle signup logic
    this.router.navigate(['/signup']);
  }

  onLogin() {
    // handle login logic
    this.router.navigate(['/login']);
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
    Object.keys(this.subscribeForm.controls).forEach(key => {
      this.subscribeForm.get(key)?.markAsTouched();
    });
  }

  async onSubmit(){
    this.isLoadingSub = true;

    if (this.subscribeForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }
        
    const message = this.translationService.translate('SUBSCRIBED');
    const login_failed_and = this.translationService.translate('LOGIN_FAILED_AND');
    const email_registered= this.translationService.translate('EMAIL_SUBSCRIBED_ALREADY');
    const login_failed = this.translationService.translate('LOGIN_FAILED');
    const unexpected_error = this.translationService.translate('UNEXPECTED_ERROR');
    const unexpected_error_occured = this.translationService.translate('UNEXPECTED_ERROR_OCCURED');
    const wrong_email_or_password = this.translationService.translate('WRONG_EMAIL_OR_PASSWORD');
    
    try {
      // Get form values
      const formData = this.subscribeForm.value;
      console.log('Great: ', formData);

      this.newsletterService.addNewsletter(formData).subscribe({
        next: async (response: any) => {
          this.isLoadingSub= false;
          
          if (response && response.success == true) {
            this.subscribeForm.reset(); // Reset the form
              await this.showToast(message, 'success');
            // if a user finished all the application process
          } else {
            if(response?.message == "Email address already subscribed to the newsletter"){
              this.markFormGroupTouched();
              await this.showToast(email_registered, 'danger');
            } else {  
              this.markFormGroupTouched();
              await this.showToast(unexpected_error, 'danger');
            }
          }
        },
        error: async (error: any) => {
          this.isLoadingSub= false;
          console.error('Login error:', error);
          
          await this.showToast(unexpected_error, 'danger');
        }
      });
      
    } catch (error) {
      this.isLoadingSub= false;
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

  // scroll to the services section
  scrollToServices() {
    const el = document.getElementById('servicesis');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

    async signout(){
      await Preferences.remove({ key: 'enriqueId' });
      this.enriqueId = null;
      this.cdr.detectChanges();
      this.router.navigate(['/tabs/work-with-me']);
    }
  
  
    public lgActionSheetButtons = [
      {
        text: this.translationService.translate('LOGOUT'),
        icon: 'power-outline',
        handler: () => {
          this.signout();
        }
      },
      {
        text: this.translationService.translate('CANCEL'),
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];
  
    
    public smActionSheetButtons = [
      {
        text: this.translationService.translate('LOGOUT'),
        icon: 'power-outline',
        handler: () => {
          this.signout();
        }
      },
      {
        text: this.translationService.translate('CANCEL'),
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];
  
    async notLoggedIn(){
      const message = this.translationService.translate('PLEASE_LOGIN_TO_BOOK');
      await this.showToast(message, 'warning');
    }

}
