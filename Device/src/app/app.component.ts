import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/json'
  });

  
  constructor(private http: HttpClient, private authService: AuthService) {}

//onAuthenticate
onAuthenticate() {
  alert('Authentication started!');
  console.log("Authentication started!");

  this.authService.generateM1().subscribe({
    next: (res) => {
      console.log("Server response: ", res);
    },
    error: (err) => {
      if(err){
        alert("Error: " + err.message);
        console.log("error: ", err);
      }
    }
  });
}

}
