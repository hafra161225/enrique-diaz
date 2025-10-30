import { Routes } from '@angular/router';
import { loggedInGuard } from './guards/logged-in-guard';
import { confirmCodeGuard } from './guards/confirm-code-guard';
import { confirmSentCodeGuard } from './guards/confirm-sent-code-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage),
    children: [
      { 
        path: '', 
        redirectTo: 'tabs/home', 
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
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'book-a-session/:type',
    loadComponent: () => import('./book-a-session/book-a-session.page').then( m => m.BookASessionPage),
    canActivate: [loggedInGuard] // 🔒 Protected!
  },
  {
    path: 'confirm-pay/:type',
    loadComponent: () => import('./confirm-pay/confirm-pay.page').then( m => m.ConfirmPayPage),
    canActivate: [loggedInGuard] // 🔒 Protected!
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'confirm-code',
    loadComponent: () => import('./confirm-code/confirm-code.page').then( m => m.ConfirmCodePage),
    canActivate: [confirmCodeGuard]
  },
  {
    path: 'new-password',
    loadComponent: () => import('./new-password/new-password.page').then( m => m.NewPasswordPage),
    canActivate: [confirmSentCodeGuard]
  },
];
