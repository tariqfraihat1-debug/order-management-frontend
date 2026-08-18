import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { Sidebar } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Header
  ],
  templateUrl: './app.html'
})
export class App {
  private readonly router = inject(Router);

  isLoginPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/login'))
    ),
    {
      initialValue: this.router.url.startsWith('/login')
    }
  );
}