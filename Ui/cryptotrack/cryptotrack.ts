import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
}

@Component({
  selector: 'app-cryptotrack',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './cryptotrack.html',
  styleUrls: ['./cryptotrack.css']
})
export class Cryptotrack implements OnInit {
  coins: Coin[] = [];
  filtered: Coin[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  activeCurrency = 'usd';
  activeSort = 'market_cap_desc';

  currencies = [
    { key: 'usd', label: 'USD $' },
    { key: 'eur', label: 'EUR €' },
    { key: 'inr', label: 'INR ₹' },
    { key: 'gbp', label: 'GBP £' }
  ];

  private readonly baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCoins();
  }

  fetchCoins(): void {
    this.loading = true;
    this.error = null;

    this.http.get<Coin[]>(
      `${this.baseUrl}/coins/markets?vs_currency=${this.activeCurrency}&order=${this.activeSort}&per_page=50&page=1&sparkline=false`
    ).pipe(
      catchError(() => {
        this.error = 'Failed to load crypto data. Please try again.';
        this.loading = false;
        return of([]);
      })
    ).subscribe(data => {
      this.coins = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  setCurrency(currency: string): void {
    this.activeCurrency = currency;
    this.fetchCoins();
  }

  filterCoins(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filtered = q
      ? this.coins.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : [...this.coins];
  }

  getCurrencySymbol(): string {
    const map: Record<string, string> = { usd: '$', eur: '€', inr: '₹', gbp: '£' };
    return map[this.activeCurrency] || '$';
  }

  formatPrice(price: number): string {
    if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(6);
  }

  formatMarketCap(val: number): string {
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    return val.toLocaleString();
  }

  getPriceChangeClass(change: number): string {
    return change >= 0 ? 'change-up' : 'change-down';
  }
}