import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export const adminLoggedGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  // Get the user ID from Preferences
  const { value: adminId } = await Preferences.get({ key: 'adminId' });

  if (adminId) {
    // User is logged in → redirect to home
    return true; // block access to the page guarded
  } else {
    // User not logged in → allow access
    router.navigate(['/login']);
    return false;
  }
};
