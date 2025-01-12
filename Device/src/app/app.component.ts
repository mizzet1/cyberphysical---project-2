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
  console.log("Authentication started!");
  //call sendM1
  this.authService.sendM1().subscribe({
    next: (res1) => {
      console.log("Server message - M2: ", res1.message);
      console.log("Server response - M2: ", res1.M2);
      
      const m2_json = JSON.parse(res1.M2);
      console.log("m2_json: ", m2_json);
      //call sendM3
      this.authService.sendM3(m2_json.r1, m2_json.C1).subscribe({
        next: (res2) => {
          console.log("Server message - M4: ", res2.message);
          console.log("Server response - M4: ", res2);
        },
        error: (err2) => {
          if(err2){
            alert("Error: " + err2.message);
            console.log("error: ", err2);
          }
        }
      });
    },
    error: (err1) => {
      if(err1){
        alert("Error: " + err1.message);
        console.log("error: ", err1);
      }
    }
  });
}

}
