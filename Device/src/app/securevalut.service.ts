import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecureVaultService {
  private secureVault: { [key: string]: string } = {};

  constructor(private http: HttpClient) {}

  // Load secure vault from JSON file
  loadVault(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>('./assets/secure_vault.json');
  }

  // Store the secure vault locally in the service
  setVault(vault: { [key: string]: string }) {
    this.secureVault = vault;
  }

  // Retrieve the secure vault for use
  getVault(): { [key: string]: string } {
    return this.secureVault;
  }
}
