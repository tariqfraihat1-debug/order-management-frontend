import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './customers.html'
})
export class Customers {

  onActivate(component: unknown): void {

    console.log(
      'Customer child activated:',
      component
    );

  }


  onDeactivate(component: unknown): void {

    console.log(
      'Customer child deactivated:',
      component
    );

  }

}