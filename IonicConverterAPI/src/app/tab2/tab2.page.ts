import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone:false
})
export class Tab2Page implements OnInit {
  history: any[] = [];

  constructor(private currencyService: CurrencyService) {}

  async ngOnInit() {
    this.history = await this.currencyService.getHistory();
  }
}