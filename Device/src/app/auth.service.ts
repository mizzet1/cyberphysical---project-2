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

  
}
