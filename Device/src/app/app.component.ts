import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { SecureVaultService } from './securevault.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/json'
  });
  constructor(private authService: AuthService, private secureVaultService: SecureVaultService) {}
  // Initialize the secure vault
  ngOnInit(): void {
    this.secureVaultService.initializeSecureVault();
  }

//Function invoked when user clicks on "Authenticate" button
onAuthenticate() {
  console.log("CLIENT: Authentication started!");
  //call sendM1: generates and sends M1 message
  const m1 = this.authService.generateM1();
  this.authService.sendM1(m1).subscribe({
    next: (res1) => {
      console.log("Server responded to M1! \n" + "Server message - M2: "+ res1.message 
        + "\n" + "Server response - M2: "+ res1.M2);

      //Only if server responds set timeout to change secure vault
      console.log("Timeout of " + JSON.parse(m1).duration + "started!");
      setTimeout(() => {this.authService.changeSecureVault()}, JSON.parse(m1).duration); 

      const m2_json = JSON.parse(res1.M2);
      //call sendM3: generates and sends M3 message
      this.authService.sendM3(m2_json.r1, m2_json.C1).subscribe({
        next: (res2) => {
          console.log("Server responded to M3! \n" + "Server message - M4: ", res2.message
          + "\n" + "Server response - M4: ", res2.M4);
          
          //decrypt M4
          const decryptedM4 = this.authService.decryptM4(res2.M4);
          
          //verify decryptedM4.r1 = cache['r1']
          if(decryptedM4.r1 == localStorage.getItem('r1')){
            //generate T = t1+t2  
            const t1 = localStorage.getItem('t1')!;
            const t2 = decryptedM4.t2;
            //generate Session Key T
            this.authService.generateT(t1, t2);
          }
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
