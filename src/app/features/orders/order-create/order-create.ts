import {Component,computed,inject,signal} from '@angular/core';
import {Router,RouterLink} from '@angular/router';

import {Customer} from '../../../core/models/customer/customer.model';
import {Currency} from '../../../core/models/currency/currency.model';
import {CreateOrderRequest} from '../../../core/models/order/create-order-request.model';
import {OrderItem} from '../../../core/models/order/order-item.model';

import {OrderService} from '../../../core/services/order.service';
import {CustomerService} from '../../../core/services/customer.service';
import {CurrencyService} from '../../../core/services/currency.service';

import {OrderInformation} from './components/order-information/order-information';
import {ShippingAddress} from './components/shipping-address/shipping-address';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {
OrderItemDialog,
OrderItemFormValue
} from '../../../shared/components/order-item-dialog/order-item-dialog';

import {OrderItems} from '../../../shared/components/order-items/order-items';
import {ContentHeader} from '../../../shared/components/content-header/content-header';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
@Component({
selector:'app-order-create',
standalone:true,
imports:[
RouterLink,
ContentHeader,
OrderInformation,
FontAwesomeModule,
ShippingAddress,
OrderItems,
OrderItemDialog
],
templateUrl:'./order-create.html'
})
export class OrderCreate{

private readonly orderService=inject(OrderService);
private readonly customerService=inject(CustomerService);
private readonly currencyService=inject(CurrencyService);
private readonly router=inject(Router);

customers=signal<Customer[]>([]);
currencies=signal<Currency[]>([]);

orderNumber=signal(1024);
customerId=signal(0);
currencyCode=signal('');

city=signal('');
street=signal('');
buildingNumber=signal('');

items=signal<OrderItem[]>([]);

error=signal('');

showItemDialog=signal(false);
selectedItem=signal<OrderItem|null>(null);

itemDialogMode=signal<'add'|'editQuantity'>('add');
faChevronRight=faChevronRight;
totalAmount=computed(() =>
this.items()
.reduce((sum,item)=>sum+(item.price*item.quantity),0)
);

constructor(){
this.loadCustomers();
this.loadCurrencies();
}

loadCustomers():void{
this.customerService
.getCustomers()
.subscribe(data =>
this.customers.set(
data.filter(x=>x.isActive)
));
}

loadCurrencies():void{
this.currencyService
.getCurrencies()
.subscribe(data =>
this.currencies.set(data));
}

openItemDialog():void{
this.selectedItem.set(null);
this.itemDialogMode.set('add');
this.showItemDialog.set(true);
}

editItem(item:OrderItem):void{
this.selectedItem.set(item);
this.itemDialogMode.set('editQuantity');
this.showItemDialog.set(true);
}

closeItemDialog():void{
this.showItemDialog.set(false);
this.selectedItem.set(null);
}

addItem(value:OrderItemFormValue):void{

this.items.update(items=>[
...items,
{
itemId:0,
itemName:value.itemName,
itemNameAlternate:value.itemNameAlternate,
quantity:value.quantity,
price:value.price
}
]);

this.closeItemDialog();

}

updateQuantity(quantity:number):void{

const item=this.selectedItem();

if(!item)
return;

this.items.update(items =>
items.map(x =>
x===item
? {...x,quantity}
: x
)
);

this.closeItemDialog();

}

removeItem(item:OrderItem):void{
this.items.update(items =>
items.filter(x=>x!==item)
);
}

validate():boolean{

this.error.set('');

if(!this.orderNumber() || this.orderNumber()<=0){
this.error.set('Order number must be greater than 0.');
return false;
}

if(!this.customerId()){
this.error.set('Please select a customer.');
return false;
}

if(!this.currencyCode()){
this.error.set('Please select a currency.');
return false;
}

if(!this.city().trim()){
this.error.set('City is required.');
return false;
}

if(!this.street().trim()){
this.error.set('Street is required.');
return false;
}

if(!this.buildingNumber().trim()){
this.error.set('Building number is required.');
return false;
}

if(this.items().length===0){
this.error.set('Order must contain at least one item.');
return false;
}

return true;

}

createOrder():void{

if(!this.validate())
return;

const request:CreateOrderRequest={
orderNumber:this.orderNumber(),
customerId:this.customerId(),
city:this.city(),
street:this.street(),
buildingNumber:this.buildingNumber(),
currencyCode:this.currencyCode(),
orderItems:this.items().map(item=>({
itemName:item.itemName,
itemNameAlternate:item.itemNameAlternate??null,
quantity:item.quantity,
price:item.price
}))
};

this.orderService
.createOrder(request)
.subscribe({
next:id=>{
this.router.navigate(['/orders',id]);
},
error:()=>{
this.error.set('Failed to create order.');
}
});

}

}