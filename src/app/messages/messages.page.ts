import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController, IonActionSheet, IonInput, 
          IonNote, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Browser } from '@capacitor/browser';
import * as allIcons from 'ionicons/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { SendNewsletter } from '../services/send-newsletter';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            RouterLink, ReactiveFormsModule, FormsModule,
            IonActionSheet, IonInput, IonNote, IonTextarea],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MessagesPage implements OnInit {
  newsletterForm: FormGroup;
  isLoadingForm= false;
  contentLoaded= false;

  constructor(private router: Router,
                private actionSheetController: ActionSheetController, 
                private cdr: ChangeDetectorRef,
                private sendNewsletter: SendNewsletter,
                private formBuilder: FormBuilder, // ← Keep these in constructor
                private toastController: ToastController) { 
              addIcons(allIcons);
                this.newsletterForm = this.formBuilder.group({
                  adminId: ['null', [Validators.required]],
                  title: ['', [Validators.required]],
                  message: ['', [Validators.required]],
                });   
              // then update legal name async, 
              Preferences.get({ key: 'adminId' }).then(result => {
                this.newsletterForm.patchValue({ adminId: result.value });
                console.log('Admin ID loaded in form:', result.value);
              });
            }

  ngOnInit() {
  }

  logout(){
    this.router.navigate(['/tabs/home']);
  }

  gotoDashboard(){
    this.router.navigate(['/dashboard']);
  }

  gotoAppointments(){
    this.router.navigate(['/appointments']);
  }

  gotoClients(){
    this.router.navigate(['/clients']);
  }

  gotoMessages(){
    this.router.navigate(['/messages']);
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
    Object.keys(this.newsletterForm.controls).forEach(key => {
      this.newsletterForm.get(key)?.markAsTouched();
    });
  }

  async submitNewsletterForm(){
    this.isLoadingForm = true;

    if (this.newsletterForm.invalid) {
      this.showToast('Please fill in all required fields correctly', 'warning');
      this.markFormGroupTouched();
      return;
    }

    const message= "Newsletter sent successfully!";
    const message_not_sent= "Message could not be sent. Please try again.";
    const unexpected_error= "An unexpected error occurred. Please try again.";
    const unexpected_error_occured= "An unexpected error occurred. Please try again later.";

        
    try {
      // Get form values
      const formData = this.newsletterForm.value;
      console.log('Great: ', formData);

      this.sendNewsletter.sendNewsletter(formData).subscribe({
        next: async (response: any) => {
          this.isLoadingForm = false;
          console.log('Here you are: ', response);
          
          if (response && response.success == true) {
            console.log('Give me a sign: ', response);
            this.newsletterForm.get('title')?.reset();
            this.newsletterForm.get('message')?.reset();

            await this.showToast(message, 'success');
            // if a user finished all the application process
          } else {
            if(response?.message == "Failed to send newsletter"){
              this.markFormGroupTouched();
              console.log('Display the message: ', message)
              await this.showToast(message_not_sent, 'danger');
            } else {  
              this.markFormGroupTouched();
              console.log('Display the second message: ', message)
              await this.showToast(unexpected_error, 'danger');
            }
          }
        },
        error: async (error: any) => {
          this.isLoadingForm = false;
          console.error('Login error:', error);
          
          await this.showToast(unexpected_error, 'danger');
        }
      });
      
    } catch (error) {
      this.isLoadingForm = false;
      console.error(unexpected_error, error);
      
      await this.showToast(unexpected_error_occured, 'danger');
    }
    
  }

    // enable back space
  onIonInput(controlName: string, ev: any) {
    const value = ev.detail?.value ?? '';
    this.newsletterForm.get(controlName)?.setValue(value, { emitEvent: true });
  }
  
  get message() { return this.newsletterForm.get('message'); }
  get title() { return this.newsletterForm.get('title'); }

}
