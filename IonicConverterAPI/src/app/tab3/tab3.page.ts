import { Component, ViewChild, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  @ViewChild('rateChart', { static: true }) rateChartRef: any;
  chart: any;

  constructor(private currencyService: CurrencyService) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    await this.loadChartData();
  }

  private async loadChartData() {
    try {
      const rates = await this.currencyService.getExchangeRates('USD');
      if (rates) {
        const currencies = Object.keys(rates).slice(0, 5);
        const values = Object.values(rates).slice(0, 5) as number[];
        this.createChart(currencies, values);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }

  private createChart(labels: string[], values: number[]): void {
    if (!this.rateChartRef?.nativeElement) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.rateChartRef.nativeElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Taxas em relação ao USD',
          data: values,
          backgroundColor: [
            'rgba(56, 128, 255, 0.7)',
            'rgba(61, 194, 255, 0.7)',
            'rgba(45, 211, 111, 0.7)',
            'rgba(255, 196, 9, 0.7)',
            'rgba(235, 68, 90, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}