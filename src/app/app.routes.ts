import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage),
    children: [
      { 
        path: '', 
        redirectTo: '/tabs/home', 
        pathMatch: 'full' 
      },
      { 
        path: 'home', 
        loadComponent: () => import('./home/home.page').then(m => m.HomePage) 
      },
      { 
        path: 'about-me', 
        loadComponent: () => import('./about-me/about-me.page').then(m => m.AboutMePage) 
      },
      { 
        path: 'work-with-me', 
        loadComponent: () => import('./work-with-me/work-with-me.page').then(m => m.WorkWithMePage) 
      },
      { 
        path: 'podcasts', 
        loadComponent: () => import('./podcasts/podcasts.page').then(m => m.PodcastsPage) 
      },
      { 
        path: 'contact', 
        loadComponent: () => import('./contact/contact.page').then(m => m.ContactPage) 
      },
    ]
  },
];
