import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {
  history: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private currencyService: CurrencyService) {}

  async ngOnInit() {
    await this.loadHistory();
  }

  async ionViewWillEnter() {
   
    await this.loadHistory();
  }

  private async loadHistory(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = null;
      
      this.history = await this.currencyService.getHistory();
      
      
      this.history.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      this.errorMessage = 'Erro ao carregar histórico de conversões';
      this.history = [];
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}