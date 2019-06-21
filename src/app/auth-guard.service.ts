import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {
  public user = null;

  constructor(
    private router: Router,
    public fireauth: AngularFireAuth,
  ) {
    this.fireauth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = this.fireauth.auth.currentUser;
      }
    });
  }

  ongOnInit() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.fireauth.authState.map((auth) => {
      if (auth == null) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    });
  }
}
