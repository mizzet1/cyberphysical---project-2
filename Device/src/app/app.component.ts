import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  
  constructor(private authService: AuthService) {}


//onAuthenticate
onAuthenticate() {
  alert('Authentication started!');
  console.log("Authentication started!");

  //call sendM1
  this.authService.sendM1().subscribe({
    next: (res) => {
      alert("Server response: " + res.message);
      console.log("Server response - M2: ", res.M2);
      
      //call sendM3
      this.authService.sendM3(res.M2.r1, res.M2.C1).subscribe({
        next: (res) => {
          alert("Server response: " + res.message);
          console.log("Server response - M4: ", res);
        },
        error: (err) => {
          if(err){
            alert("Error: " + err.message);
            console.log("error: ", err);
          }
        }
      });
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
