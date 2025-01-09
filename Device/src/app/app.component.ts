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

  
  constructor(private http: HttpClient) {}

  //generateM1
  generateM1(): Observable<any>{
    const deviceId = environment.device_id;
    const sessionId = this.generateSessionId();
    // Body data to be sent in the POST request
    const body = { deviceId, sessionId };
    // Send POST request to the server
    return this.http.post('http://localhost:3000/auth/m1', body, {headers: this.headers});
  }

  //onAuthenticate
  onAuthenticate() {
    alert('Authentication started!');
    console.log("Authentication started!");

    this.generateM1().subscribe({
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

  //generateSessionId
  generateSessionId(){
    const sessionId = Math.floor(Math.random() * 1000).toString();
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

}
