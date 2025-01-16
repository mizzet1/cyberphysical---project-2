import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataExchangedService {
  
  private dataExchanged: { [key: string]: string } = 
  {
    "message1": "Hello Server!",
    "message2": "Hello Client!",
    "message3": "Hello Pippo!",
    "message4": "Hello Pluto!"
    }

  // Store a new secure vault locally in the service
  setData(data: { [key: string]: string }) {
    this.dataExchanged = data;
  }

  // Retrieve the secure vault for use
  getData(): { [key: string]: string } {
    return this.dataExchanged;
  }
}
