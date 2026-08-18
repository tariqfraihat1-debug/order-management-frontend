import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compactCurrency',
  standalone: true
})
export class CompactCurrencyPipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 1_000_000) {
      return `$${this.format(value / 1_000_000)}M`;
    }

    if (value >= 1_000) {
      return `$${this.format(value / 1_000)}K`;
    }

    return `$${Math.round(value)}`;
  }

  private format(value: number): string {
    return value % 1 === 0
      ? value.toString()
      : value.toFixed(1);
  }
}