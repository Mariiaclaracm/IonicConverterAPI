// src/app/services/currency.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest';
  private _storage: Storage | null = null;

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    this._storage = await this.storage.create();
  }

  async getExchangeRates(baseCurrency: string): Promise<any> {
    try {
      const response = await this.http.get(`${this.apiUrl}/${baseCurrency}`).toPromise();
      await this._storage?.set(`rates_${baseCurrency}`, response);
      return response;
    } catch (error) {
      console.error('API error, using cached rates');
      return await this._storage?.get(`rates_${baseCurrency}`);
    }
  }

  async saveConversion(conversion: any) {
    let history = (await this._storage?.get('conversions')) || [];
    history.unshift(conversion);
    await this._storage?.set('conversions', history.slice(0, 50));
  }

  async getHistory() {
    return (await this._storage?.get('conversions')) || [];
  }
}