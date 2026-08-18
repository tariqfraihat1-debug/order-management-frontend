import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faPen,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

export type TableAction = 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-table-action-icons',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './table-action-icons.html'
})
export class TableActionIcons {

  actions = input<TableAction[]>(['view']);

  view = output<void>();
  edit = output<void>();
  delete = output<void>();

  faEye = faEye;
  faPen = faPen;
  faTrash = faTrash;
}