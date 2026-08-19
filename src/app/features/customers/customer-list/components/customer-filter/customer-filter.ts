import {Component,output,signal} from '@angular/core';
import {SearchInput} from '../../../../../shared/components/search-input/search-input';

@Component({
selector:'app-customer-filter',
standalone:true,
imports:[SearchInput],
templateUrl:'./customer-filter.html',
styles:``
})
export class CustomerFilter{

searchChanged=output<string>();
statusChanged=output<string>();

search=signal('');
status=signal('');

onSearch(value:string):void{
this.search.set(value);
this.searchChanged.emit(value);
}

onStatusChange(value:string):void{
this.status.set(value);
this.statusChanged.emit(value);
}

}