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
  title = 'Device';


  // private headers: HttpHeaders = new HttpHeaders({
  //   'Content-Type':  'application/json'
  // });

  // private m1Params: HttpParams = new HttpParams();
  
  // //constructor
  // constructor(private http: HttpClient){}
  // generateM1(): Observable<any>{
    
  //   const deviceId = environment.device_id;
  //   const sessionId = this.generateSessionId();

  //   this.m1Params.set('deviceId', deviceId).set('sessionId', sessionId );


  //   return this.http.get('http://localhost:3000/m1',{headers: this.headers, params: this.m1Params})

  // }

  // //onAuthenticate (from client click)
  // onAuthenticate() {
  //   alert('Authentication started!');
  //   //generateM1 ...
  // }

  
  // generateSessionId(){
  //   const sessionId = Math.floor(Math.random() * 1000).toString();
  //   localStorage.setItem('sessionId', sessionId);
  //   return sessionId;
  // }

  // authM2(){
  //   this.generateM1().subscribe({
  //     next: (res) => {
  //      const m2 = res.body;
  //     },
  //     error: (err) => {
  //       if(err.status==403){
         
  //       }
      
  //     }
  //   });
  // }

}
