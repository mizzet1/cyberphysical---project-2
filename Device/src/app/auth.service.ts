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


  /**
   * Generate M1 request
   * @returns Observable with server response
   */
  generateM1(): Observable<any> {
    const deviceId = environment.device_id;
    const sessionId = this.generateSessionId();
    this.m1Params = this.m1Params.set('deviceId', deviceId).set('sessionId', sessionId);

    return this.http.post('http://localhost:3000/auth/m1', null, {
      headers: this.headers,
      params: this.m1Params,
    });
  }

  /**
   * Generate a random session ID and store it in localStorage
   * @returns Generated session ID
   */
  private generateSessionId(): string {
    const sessionId = Math.floor(Math.random() * 1000).toString();
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

  /**
   * Authenticate with M2 response
   * @returns Observable with server response
   */
  authM2(): Observable<any> {
    return this.generateM1();
  }

  generateKey(indices: number[]): string {
    const vault = this.secureVaultService.getVault();
    // XOR all keys at the given indices
    return indices
      .map((index) => vault[index.toString()]) // Fetch keys as hex strings
      .reduce((acc, key) => (parseInt(acc, 16) ^ parseInt(key, 16)).toString(16), '0');
  }

  
}
