import { Component } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone:false
})
export class Tab1Page {
  currencies = ['USD', 'EUR', 'BRL', 'GBP', 'JPY'];
  amount = 1;
  fromCurrency = 'USD';
  toCurrency = 'BRL';
  convertedAmount: number | null = null;
  rates: any = {};

  constructor(private currencyService: CurrencyService) {}

  async loadRates() {
    this.rates = await this.currencyService.getExchangeRates(this.fromCurrency);
  }

  async convert() {
  try {
    const result = await this.currencyService.convert(
      this.amount,
      this.fromCurrency,
      this.toCurrency
    );
    this.convertedAmount = result;
  } catch (error) {
    console.error(error);
  }
}
}