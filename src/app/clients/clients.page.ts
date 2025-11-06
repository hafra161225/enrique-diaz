import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
          IonImg, IonMenu, IonButtons, IonMenuButton, 
          IonList, IonItem, IonIcon, IonMenuToggle, 
          ActionSheetController, IonButton, IonSelect, 
          IonSelectOption, IonLabel, IonText, IonAvatar,
          ToastController, IonActionSheet, IonInput, 
          IonNote, IonSearchbar, IonSkeletonText, IonThumbnail, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Browser } from '@capacitor/browser';
import * as allIcons from 'ionicons/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { GetAllClients } from '../services/get-all-clients';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, 
            IonImg, IonIcon, IonTitle, IonContent, 
            IonMenu, IonButtons, IonMenuButton, IonList, 
            IonItem, IonMenuToggle, IonButton, IonSelect,
            IonSelectOption, IonLabel, IonText, IonAvatar,
            RouterLink, ReactiveFormsModule, IonActionSheet, 
            IonInput, IonNote, IonSearchbar, IonSkeletonText, 
            IonThumbnail,],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ClientsPage implements OnInit {
  clientsF: FormGroup;
  isLoadingApp= false;
  users: any[] = [];
  results: any;
  totalUsers: any;
  filteredClients: any[]= [];
  filterQuery: string = '';

  constructor(private router: Router,
              private getAllClients: GetAllClients,
              private fb: FormBuilder,
              private actionSheetController: ActionSheetController, 
              private toastController: ToastController,
              private cdr: ChangeDetectorRef) { 
              addIcons(allIcons);
              this.clientsF = this.fb.group({
                adminId: ['null', [Validators.required]],
              });
                              
              // then update legal name async, 
              Preferences.get({ key: 'adminId' }).then(result => {
                this.clientsF.patchValue({ adminId: result.value });
                console.log('Admin ID loaded in form:', result.value);
                this.gettingAllClients();
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
    Object.keys(this.clientsF.controls).forEach(key => {
      this.clientsF.get(key)?.markAsTouched();
    });
  }
  
  async gettingAllClients(){
    this.isLoadingApp = true;
    this.cdr.detectChanges();      

    try {
      const formData = this.clientsF.value;
      console.log('Great: ', formData);

      this.getAllClients.getAllClients(formData).subscribe({
        next: async (response: any) => {
          this.isLoadingApp = false;

          if (response) {
            if (response.success === true) {
              console.log('Appointments data:', response);

              // Assign data properly
              this.users = response.users || [];
              this.filteredClients = [...this.users]; // <-- set AFTER data arrives
              this.totalUsers = response.totalUsers;
              console.log('Clients: ', this.users);

              // Optional UI display
              this.cdr.detectChanges();
            } else {
              console.warn('Response received but no valid data:', response);
              this.users = [];
              this.totalUsers = 0;
            }
          } else {
            console.error('No response received (null or undefined)');
            this.users = [];
            this.totalUsers = 0;
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

  filterClients(event: any) {
    this.filterQuery = event.target.value || '';
    const query = this.filterQuery.toLowerCase();

    if (!query || query.trim() === '') {
      this.filteredClients = [...this.users];
    } else {
      this.filteredClients = this.users.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query)
      );
    }

    this.cdr.detectChanges();
  }

}
