import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import LoginComponent from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  implements CanActivate {
  constructor(private authService: LoginComponent, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    debugger
    if (this.authService.isAuthenticated()) {
      debugger
      return true;
    } else {
      window.location.href = '/sign-in';
      return this.router.createUrlTree(['/sign-in']);
    }
  }
}
