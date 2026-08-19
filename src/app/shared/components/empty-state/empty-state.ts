import {Component, input, output} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
selector:'app-empty-state',
standalone:true,
imports:[
RouterLink
],
templateUrl:'./empty-state.html',
styles:``
})
export class EmptyState{

icon=input<string>('');

title=input<string>('');

message=input<string>('');

primaryText=input<string>('');

primaryLink=input<string>('');

secondaryText=input<string>('');

primaryAction=output<void>();

}