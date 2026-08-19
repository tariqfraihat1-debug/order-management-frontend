import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './orders.html'
})
export class Orders {
  onActivate(component: unknown): void {
    console.log('Order child activated:', component);
  }

  onDeactivate(component: unknown): void {
    console.log('Order child deactivated:', component);
  }
}