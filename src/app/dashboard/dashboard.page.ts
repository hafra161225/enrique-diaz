import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController, IonActionSheet, IonInput, 
          IonNote, IonSkeletonText, IonThumbnail } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Browser } from '@capacitor/browser';
import * as allIcons from 'ionicons/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { GetStats } from '../services/get-stats';
import { GetAppointmentsToday } from '../services/get-appointments-today';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            RouterLink, ReactiveFormsModule,
            IonActionSheet, IonInput, IonNote, 
            IonSkeletonText, IonThumbnail],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardPage implements OnInit {
  customerStats: FormGroup;
  isLoadingStats = false;
  isLoadingApp= false;
  clients: any;
  revenue: any;
  payments: any;
  stats: any;
  appointments: any[]= [];
  totalAppointments: any;

  constructor(private router: Router,
              private getStats: GetStats,
              private appointmentsToday: GetAppointmentsToday,
              private fb: FormBuilder,
              private actionSheetController: ActionSheetController, 
              private toastController: ToastController,
              private cdr: ChangeDetectorRef) { 
              addIcons(allIcons);
              this.customerStats = this.fb.group({
                adminId: ['null', [Validators.required]],
              });
                              
              // then update legal name async, 
              Preferences.get({ key: 'adminId' }).then(result => {
                this.customerStats.patchValue({ adminId: result.value });
                console.log('Admin ID loaded in form:', result.value);
                this.gettingStats();
                this.getAppointmentsToday();
              });
            }

  ngOnInit() {
  }

  logout(){
    Preferences.remove({ key: 'adminId' });
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
    Object.keys(this.customerStats.controls).forEach(key => {
      this.customerStats.get(key)?.markAsTouched();
    });
  }

  async gettingStats(){
    this.isLoadingStats = true;
    this.cdr.detectChanges();      
      try {
        // Get form values
        const formData = this.customerStats.value;
        console.log('Great: ', formData);

        this.getStats.getStats(formData).subscribe({
          next: async (response: any) => {
            this.isLoadingStats = false;
            if (response) {
              if (response.success === true) {
                console.log('Stats data:', response);
                this.clients = response.clients;
                this.payments = response.payments;
                this.revenue = response.revenue;
                this.cdr.detectChanges();
              } else {
                console.warn('Response received but no valid data:', response);
                this.stats = '0';
                this.clients = '0';
                this.revenue = '$0.00';
              }
            } else {
              console.error('No response received (null or undefined)');
              this.stats = '0';
              this.clients = '0';
              this.revenue = '$0.00';
            }


          },
          error: async (error: any) => {
            // await loading.dismiss();
            this.isLoadingStats = true;
            console.error('Login error:', error);

            await this.showToast('Something went wrong. Check your internet connection', 'danger');
          }
        });
        
      } catch (error) {
        // await loading.dismiss();
        this.isLoadingStats = true;
        console.error('Unexpected error:', error);

        await this.showToast('Something went wrong. Check your internet connection', 'danger');
      }

  }

  async getAppointmentsToday() {
    this.isLoadingApp = true;
    this.cdr.detectChanges();      

    try {
      const formData = this.customerStats.value;
      console.log('Great: ', formData);

      this.appointmentsToday.appointmentsToday(formData).subscribe({
        next: async (response: any) => {
          this.isLoadingApp = false;
          console.log('Give me fucking: ',response);

          if (response) {
            if (response.success === true) {
              console.log('Appointments data:', response);

              // Assign data properly
              this.appointments = response.appointments;
              this.totalAppointments = response.totalAppointments;

              // Optional UI display
              this.cdr.detectChanges();
            } else {
              console.warn('Response received but no valid data:', response);
              this.appointments = [];
              this.totalAppointments = 0;
            }
          } else {
            console.error('No response received (null or undefined)');
            this.appointments = [];
            this.totalAppointments = 0;
          }
        },
        error: async (error: any) => {
          this.isLoadingApp = false;
          console.error('API error:', error);
          await this.showToast('Something went wrong. Check your internet connection', 'danger');
        }
      });

    } catch (error) {
      this.isLoadingApp = false;
      console.error('Unexpected error:', error);
      await this.showToast('Something went wrong. Check your internet connection', 'danger');
    }
  }


}
