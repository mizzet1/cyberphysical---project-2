import { Component } from '@angular/core';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
const dotenv = require('dotenv');
dotenv.config();



@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/json'
  });
  private m1Params: HttpParams = new HttpParams();
  
  constructor(private http: HttpClient){}
  generateM1(): Observable<any>{
    
    const deviceId = process.env['deviceId']!;
    const sessionId = this.generateSessionId();

    this.m1Params.set('deviceId', deviceId).set('sessionId', sessionId );


    return this.http.get('http://localhost:3000/m1',{headers: this.headers, params: this.m1Params})

  }

  generateSessionId(){
    const sessionId = Math.floor(Math.random() * 1000).toString();
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

  authM2(){
   
    this.generateM1().subscribe({
      next: (res) => {
       const m2 = res.body.M2;
      },
      error: (err) => {
        if(err.status==403){
         
        }
      
      }
    });
  }

}
