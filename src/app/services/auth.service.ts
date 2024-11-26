import { inject, Injectable } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private user$: Observable<User | null> = authState(this.auth);
  constructor() { }



  async loginWithGoogle(): Promise<void> {
  try{
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }
  catch(error){
    console.error(error);
    throw error;
  }
}


async logout(): Promise<void> {
  try{
    await this.auth.signOut();
    this.router.navigate(['/home']);
  }
  catch(error){
    console.error(error);
    throw error;
  }
}

getUser(): Observable<User | null> {
  return this.user$;
}




}