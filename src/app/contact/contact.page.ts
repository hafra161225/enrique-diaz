import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController } from '@ionic/angular/standalone';
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
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            ReactiveFormsModule, FormsModule],
  encapsulation: ViewEncapsulation.None, // Add this
})
export class ContactPage implements AfterViewInit {
  signupMessage: string | null = null;
  signupError = false;
  showCookieBanner = true;
  selectedLang = 'en';
  currentTestimonial = 0;
  isLoading= false;
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
  contactForm: FormGroup;

  constructor(private actionSheetController: ActionSheetController, 
              private router: Router, 
              public translationService: TranslationService,
              private formBuilder: FormBuilder, // ← Keep these in constructor
              private toastController: ToastController) {
                addIcons(allIcons);
                this.initLanguagePreference();
                this.translationService.loadLanguage(this.selectedLang);
                this.contactForm = this.formBuilder.group({
                  name: ['', [Validators.required]],
                  email: ['', [Validators.required, Validators.email]],
                  subject: ['', [Validators.required]],
                  message: ['', [Validators.required]],
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
  }

  onLogin() {
    // handle login logic
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
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  // submit contact form
  submitForm() {
    this.isLoading = true;

    if (this.contactForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }

    const message = this.translationService.translate('MESSAGE_SENT_SUCCESS');
    setTimeout(() => {
      this.showToast(message, 'success');
      this.isLoading= false;
      this.contactForm.reset();
    }, 4000);

  }

    // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.contactForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  // Getter methods for easy access to form controls
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}
