import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class NoReuseRouteStrategy implements RouteReuseStrategy {

  shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    return false; // never detach
  }

  store(_route: ActivatedRouteSnapshot, _handle: DetachedRouteHandle | null): void {}

  shouldAttach(_route: ActivatedRouteSnapshot): boolean {
    return false; // never reattach
  }

  retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig; // reuse only same route
  }
}
