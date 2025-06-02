import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';


type CurrencyCode = 'USD' | 'EUR' | 'BRL' | 'GBP' | 'JPY';


interface ExchangeRateResponse {
  rates: { [key: string]: number };
  base: string;
  date: string;
}


interface MockRates {
  USD: { [key: string]: number };
  EUR: { [key: string]: number };
  BRL: { [key: string]: number };
  GBP: { [key: string]: number };
  JPY: { [key: string]: number };
  [key: string]: { [key: string]: number }; 
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest';
  private _storage: Storage | null = null;
  

  private readonly mockRates: MockRates = {
    USD: { EUR: 0.93, BRL: 5.05, GBP: 0.79, JPY: 148.32 },
    EUR: { USD: 1.07, BRL: 5.45, GBP: 0.85, JPY: 159.12 },
    BRL: { USD: 0.20, EUR: 0.18, GBP: 0.16, JPY: 29.35 },
    GBP: { USD: 1.27, EUR: 1.18, BRL: 6.25, JPY: 187.65 },
    JPY: { USD: 0.0067, EUR: 0.0063, BRL: 0.034, GBP: 0.0053 }
  };

  constructor(private http: HttpClient, private storage: Storage) {
    this.initializeStorage();
  }


  private async initializeStorage(): Promise<void> {
    try {
      this._storage = await this.storage.create();
    } catch (error) {
      console.error('Erro ao inicializar storage:', error);
    }
  }


  async getExchangeRates(baseCurrency: string): Promise<{ [key: string]: number }> {
    if (!this.isValidCurrency(baseCurrency)) {
      console.warn(`Moeda inválida: ${baseCurrency}, usando fallback`);
      return this.getFallbackRates(baseCurrency);
    }

    try {
      const response = await this.http.get<ExchangeRateResponse>(
        `${this.apiUrl}/${baseCurrency}`
      ).pipe(
        map(response => {
          if (!response?.rates) {
            throw new Error('Resposta da API inválida');
          }
          return response.rates;
        }),
        catchError(error => {
          console.error('Erro na API:', error);
          return of(this.getFallbackRates(baseCurrency));
        })
      ).toPromise();


      if (response) {
        await this._storage?.set(`rates_${baseCurrency}`, response);
      }
      return response || this.getFallbackRates(baseCurrency);

    } catch (error) {
      console.error('Erro geral:', error);
      return this.getFallbackRates(baseCurrency);
    }
  }


  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;

    const rates = await this.getExchangeRates(from);
    const rate = rates[to];

    if (!rate) {
      throw new Error(`Taxa de conversão ${from}→${to} não disponível`);
    }

    const result = amount * rate;
    await this.saveConversion({
      amount,
      from,
      to,
      result,
      rate,
      date: new Date().toISOString()
    });

    return result;
  }


  async saveConversion(conversion: {
    amount: number;
    from: string;
    to: string;
    result: number;
    rate: number;
    date: string;
  }): Promise<void> {
    if (!this._storage) {
      await this.initializeStorage();
    }

    const history = (await this._storage?.get('conversions')) || [];
    history.unshift(conversion);
    await this._storage?.set('conversions', history.slice(0, 100));
  }


  async getHistory(): Promise<any[]> {
    if (!this._storage) {
      await this.initializeStorage();
    }
    return (await this._storage?.get('conversions')) || [];
  }

  private async getCachedOrMockedRates(baseCurrency: string): Promise<{ [key: string]: number }> {
    try {
      const cached = await this._storage?.get(`rates_${baseCurrency}`);
      if (cached && typeof cached === 'object') {
        return cached;
      }
    } catch (error) {
      console.error('Erro ao acessar cache:', error);
    }
    return this.getFallbackRates(baseCurrency);
  }


  private getFallbackRates(baseCurrency: string): { [key: string]: number } {
    return this.mockRates[baseCurrency] || this.mockRates['USD'];
  }


  private isValidCurrency(currency: string): boolean {
    return Object.keys(this.mockRates).includes(currency);
  }
}