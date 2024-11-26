import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/auth';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user$!: Observable<firebase.User | null>;
  isLoading:boolean = false;
  errorMenssage: string = '';
  constructor(private _srvAuth: AuthService){}

  ngOnInit(): void {
    this.user$ = this._srvAuth.getUser();
  }

  async onGoogleLogin():Promise<void> {
    this.isLoading = true;
    try{
      await this._srvAuth.loginWithGoogle();
      console.log('Login exitoso');
    } catch(error){
      this.errorMenssage = 'Error al iniciar sesión';
      console.error(error);
    }finally{
      this.isLoading = false;
    }
    }

    async logout(): Promise<void> {
      this.isLoading = true;
      try{
        await this._srvAuth.logout();
        console.log('Logout exitoso');
      } catch(error){
        this.errorMenssage = 'Error al cerrar sesión';
        console.error(error);
      }finally{
        this.isLoading = false;
      }
  }



}