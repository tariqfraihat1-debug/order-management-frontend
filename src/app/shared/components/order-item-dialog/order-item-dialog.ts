import {Component,effect,input,output,signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

import {OrderItem} from '../../../core/models/order/order-item.model';
import { Button } from "../button/button";

export type OrderItemDialogMode='add'|'editQuantity';

export interface OrderItemFormValue{
itemName:string;
itemNameAlternate:string|null;
quantity:number;
price:number;
}

@Component({
selector:'app-order-item-dialog',
standalone:true,
imports: [
    FormsModule,
    CurrencyPipe,
    FontAwesomeModule,
    Button
],
templateUrl:'./order-item-dialog.html'
})
export class OrderItemDialog{

open=input(false);
mode=input<OrderItemDialogMode>('add');
item=input<OrderItem|null>(null);
serverError=input('');

saved=output<OrderItemFormValue>();
quantitySaved=output<number>();
cancelled=output<void>();
itemError = input('');
itemName=signal('');
itemNameAlternate=signal('');
quantity=signal(1);
price=signal(0);
error=signal('');

readonly maxItemNameLength=120;
readonly maxAlternateNameLength=120;

faXmark=faXmark;

constructor(){
effect(()=>{
if(!this.open())return;

this.error.set('');

if(this.mode()==='add'){
this.reset();
}

if(this.mode()==='editQuantity'&&this.item()){
this.quantity.set(this.item()!.quantity);
}
});
}

save():void{

this.error.set('');

if(this.mode()==='editQuantity'){

if(!this.isValidNumber(this.quantity())){
this.error.set(
'Quantity must be greater than 0 and have maximum 2 decimal places.'
);
return;
}

this.quantitySaved.emit(this.quantity());
return;
}

const name=this.itemName().trim();
const alternate=this.itemNameAlternate().trim();

if(!name){
this.error.set('Item name is required.');
return;
}

if(name.length>this.maxItemNameLength){
this.error.set(
`Item name cannot exceed ${this.maxItemNameLength} characters.`
);
return;
}

if(alternate.length>this.maxAlternateNameLength){
this.error.set(
`Alternate name cannot exceed ${this.maxAlternateNameLength} characters.`
);
return;
}

if(!this.isValidNumber(this.quantity())){
this.error.set(
'Quantity must be greater than 0 and have maximum 2 decimal places.'
);
return;
}

if(!this.isValidNumber(this.price())){
this.error.set(
'Price must be greater than 0 and have maximum 2 decimal places.'
);
return;
}

this.saved.emit({
itemName:name,
itemNameAlternate:alternate||null,
quantity:this.quantity(),
price:this.price()
});
}

cancel():void{
this.cancelled.emit();
}

private isValidNumber(value:number):boolean{
return Number.isFinite(value)
&&value>0
&&Number(value.toFixed(2))===value;
}

private reset():void{
this.itemName.set('');
this.itemNameAlternate.set('');
this.quantity.set(1);
this.price.set(0);
this.error.set('');
}

}