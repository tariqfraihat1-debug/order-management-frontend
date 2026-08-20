import {Component,input} from '@angular/core';
import {RouterLink} from '@angular/router';


export interface BreadcrumbItem{
  label:string;
  link?:string;
}


@Component({
selector:'app-breadcrumb',
standalone:true,
imports:[
RouterLink
],
templateUrl:'./breadcrumb.html',
styles:`
.breadcrumb-item::before{
    content:none !important;
}
`
})
export class Breadcrumb{

items=input.required<BreadcrumbItem[]>();

}