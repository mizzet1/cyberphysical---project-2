import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import secureVaultData from '../assets/secure_vault.json';

@Injectable({
  providedIn: 'root',
})
export class SecureVaultService {
  private secureVault: { [key: string]: string } = secureVaultData;

  // Store a new secure vault locally in the service
  setVault(vault: { [key: string]: string }) {
    this.secureVault = vault;
  }

  // Retrieve the secure vault for use
  getVault(): { [key: string]: string } {
    return this.secureVault;
    
  }
}
