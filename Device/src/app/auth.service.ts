import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SecureVaultService } from './securevalut.service';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class AuthService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private m1Params: HttpParams = new HttpParams();
  constructor(private http: HttpClient, private secureVaultService: SecureVaultService) {}


//generateM1
generateM1(): Observable<any>{
  const deviceId = environment.device_id;
  const sessionId = this.generateSessionId();
  // Body data to be sent in the POST request
  const body = { deviceId, sessionId };
  // Send POST request to the server
  this.secureVaultService.getVault();
  return this.http.post('http://localhost:3000/auth/m1', body, {headers: this.headers});
}

//generateSessionId
generateSessionId(){
  const sessionId = Math.floor(Math.random() * 1000).toString();
  localStorage.setItem('sessionId', sessionId);
  return sessionId;
}
 
//generateKey k
generateKey(indices: number[]): string {
  const vault = this.secureVaultService.getVault();
  // XOR all keys at the given indices
  return indices
    .map((index) => vault[index.toString()]) // Fetch keys as hex strings
    .reduce((acc, key) => (parseInt(acc, 16) ^ parseInt(key, 16)).toString(16), '0');
}

// generateT1
generateT1(): string{
  // Generate a random 64-bit (16-character) hexadecimal string
  const hex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return hex;
}

//generateC2
generateC2(): number[] {
  const c2: number[] = [];
  // Generates p, a random number from 2 and 7 (i.e. at least 2 keys, at most 7 (n-1) keys). 
  // p determines the number of keys indeces for C2
  const p: number = Math.floor(Math.random() * 6) + 2; 

  const indeces = [0,1,2,3,4,5,6,7];
  for (let i = 0; i < p; i++) {
    const current_index = Math.floor(Math.random() * indeces.length)  
    c2.push(indeces[current_index]);
    indeces.splice(current_index,1); 
  }
  return c2;
}

//generateR2
generateR2(): string{
  // Generate a random 64-bit (16-character) hexadecimal string
  const hex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return hex;
}

//generateM3
generateM3(r1: string): string {
  const t1 = this.generateT1();
  const c2 = this.generateC2();
  const r2 = this.generateR2();
  const k = this.generateKey(c2);
  const m3 = t1 + c2.join('') + r2;
  return m3;
}

}
