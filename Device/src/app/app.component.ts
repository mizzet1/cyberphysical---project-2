import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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

  private m1Params: HttpParams = new HttpParams();
  
  constructor(private http: HttpClient) {}

  //generateM1
  generateM1(): Observable<any>{
    const deviceId = environment.device_id;
    const sessionId = this.generateSessionId();
    this.m1Params.set('deviceId', deviceId).set('sessionId', sessionId );
    return this.http.post('http://localhost:3000/m1',null, {headers: this.headers, params: this.m1Params})
  }

  //onAuthenticate
  onAuthenticate() {
    alert('Authentication started!');
    console.log("Authentication started!");

    //generateM1()
    // this.generateM1().subscribe({
    //   next: (res) => {
    //     const m2 = res.body;
    //     console.log("Server response: ", m2);
    //   },
    //   error: (err) => {
    //     if(err){
    //       alert("Error: " + err.message);
    //       console.log("error: ", err);
    //     }
    //   }
    // });
  }

  //generateSessionId
  generateSessionId(){
    const sessionId = Math.floor(Math.random() * 1000).toString();
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

  //authM2
  authM2(){
    this.generateM1().subscribe({
      next: (res) => {
       const m2 = res.body;
      },
      error: (err) => {
        if(err.status==403){
         
        }
      
      }
    });
  }

}
