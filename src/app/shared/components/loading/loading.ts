import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.html'
})
export class Loading {
  message = input('Loading...');
}