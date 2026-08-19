import {CurrencyPipe} from '@angular/common';
import {Component,effect,input,output,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {OrderItem} from '../../../core/models/order/order-item.model';

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
imports:[FormsModule,CurrencyPipe,FontAwesomeModule],
templateUrl:'./order-item-dialog.html'
})
export class OrderItemDialog{
open=input(false);
mode=input<OrderItemDialogMode>('add');
item=input<OrderItem|null>(null);

saved=output<OrderItemFormValue>();
quantitySaved=output<number>();
cancelled=output<void>();

itemName=signal('');
itemNameAlternate=signal('');
quantity=signal(1);
price=signal(0);
error=signal('');

faXmark=faXmark;

constructor(){
effect(()=>{
if(!this.open())return;

this.error.set('');

if(this.mode()==='editQuantity'&&this.item())
this.quantity.set(this.item()!.quantity);

if(this.mode()==='add')
this.reset();
});
}

save(){
this.error.set('');

if(this.mode()==='editQuantity'){
if(!this.valid(this.quantity())){
this.error.set('Quantity must be greater than 0.');
return;
}
this.quantitySaved.emit(this.quantity());
return;
}

if(!this.itemName().trim()){
this.error.set('Item name is required.');
return;
}

if(this.itemName().length>120){
this.error.set('Item name maximum length is 120.');
return;
}

if(this.itemNameAlternate().length>120){
this.error.set('Alternate name maximum length is 120.');
return;
}

if(!this.valid(this.quantity())){
this.error.set('Quantity must be greater than 0.');
return;
}

if(!this.valid(this.price())){
this.error.set('Unit price must be greater than 0.');
return;
}

this.saved.emit({
itemName:this.itemName().trim(),
itemNameAlternate:this.itemNameAlternate().trim()||null,
quantity:this.quantity(),
price:this.price()
});
}

cancel(){
this.cancelled.emit();
}

valid(value:number){
return value>0&&Number(value.toFixed(2))===value;
}

reset(){
this.itemName.set('');
this.itemNameAlternate.set('');
this.quantity.set(1);
this.price.set(0);
}
}