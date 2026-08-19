import {Component,computed,inject,OnInit,signal} from '@angular/core';
import {Router,RouterLink} from '@angular/router';



import {Customer} from '../../../core/models/customer/customer.model';
import {Currency} from '../../../core/models/currency/currency.model';
import {CreateOrderRequest} from '../../../core/models/order/create-order-request.model';

import {CustomerService} from '../../../core/services/customer.service';
import {CurrencyService} from '../../../core/services/currency.service';
import {OrderService} from '../../../core/services/order.service';
import {getApiErrorMessage} from '../../../core/utils/api-error.util';

import {ContentHeader} from '../../../shared/components/content-header/content-header';
import {OrderItemDialog,OrderItemFormValue} from '../../../shared/components/order-item-dialog/order-item-dialog';
import {OrderItems} from '../../../shared/components/order-items/order-items';

import {OrderInformation} from './components/order-information/order-information';
import {ShippingAddress} from './components/shipping-address/shipping-address';
import { Breadcrumb } from "../../../shared/components/breadcrumb/breadcrumb";

interface CreateOrderItemView{
itemId:number;
itemName:string;
itemNameAlternate:string|null;
quantity:number;
price:number;
}

@Component({
selector:'app-order-create',
standalone:true,
imports: [
    RouterLink,
    ContentHeader,
    OrderInformation,
    ShippingAddress,
    OrderItems,
    OrderItemDialog,
    Breadcrumb
],
templateUrl:'./order-create.html'
})
export class OrderCreate implements OnInit{

private readonly orderService=inject(OrderService);
private readonly customerService=inject(CustomerService);
private readonly currencyService=inject(CurrencyService);
private readonly router=inject(Router);

customers=signal<Customer[]>([]);
currencies=signal<Currency[]>([]);

orderNumber=signal(0);
customerId=signal(0);
currencyCode=signal('');

city=signal('');
street=signal('');
buildingNumber=signal('');

items=signal<CreateOrderItemView[]>([]);

error=signal('');

showItemDialog=signal(false);
selectedItem=signal<CreateOrderItemView|null>(null);

itemDialogMode=signal<'add'|'editQuantity'>('add');

readonly maxCityLength=50;
readonly maxStreetLength=100;
readonly maxBuildingNumberLength=20;



totalAmount=computed(()=>
this.items().reduce(
(sum,item)=>sum+(item.price*item.quantity),
0
)
);

ngOnInit():void{
this.loadCustomers();
this.loadCurrencies();
}

loadCustomers():void{
this.customerService.getCustomers().subscribe({
next:data=>{
this.customers.set(
data.filter(customer=>customer.isActive)
);
},
error:error=>{
this.error.set(
getApiErrorMessage(error,'Failed to load customers.')
);
}
});
}

loadCurrencies():void{
this.currencyService.getCurrencies().subscribe({
next:data=>{
this.currencies.set(data);
},
error:error=>{
this.error.set(
getApiErrorMessage(error,'Failed to load currencies.')
);
}
});
}

openItemDialog():void{
this.selectedItem.set(null);
this.itemDialogMode.set('add');
this.showItemDialog.set(true);
}

editItem(item:CreateOrderItemView):void{
this.selectedItem.set(item);
this.itemDialogMode.set('editQuantity');
this.showItemDialog.set(true);
}

closeItemDialog():void{
this.showItemDialog.set(false);
this.selectedItem.set(null);
}

addItem(value:OrderItemFormValue):void{

const nextId=this.items().length===0
?1
:Math.max(...this.items().map(item=>item.itemId))+1;

this.items.update(items=>[
...items,
{
itemId:nextId,
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

if(!item)return;

this.items.update(items=>
items.map(current=>
current.itemId===item.itemId
?{...current,quantity}
:current
)
);

this.closeItemDialog();
}

removeItem(item:CreateOrderItemView):void{
this.items.update(items=>
items.filter(current=>current.itemId!==item.itemId)
);
}

validate():boolean{

this.error.set('');

if(!this.orderNumber()||this.orderNumber()<=0){
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

const city=this.city().trim();
const street=this.street().trim();
const building=this.buildingNumber().trim();

if(!city){
this.error.set('City is required.');
return false;
}

if(city.length>this.maxCityLength){
this.error.set(
`City cannot exceed ${this.maxCityLength} characters.`
);
return false;
}

if(!street){
this.error.set('Street is required.');
return false;
}

if(street.length>this.maxStreetLength){
this.error.set(
`Street cannot exceed ${this.maxStreetLength} characters.`
);
return false;
}

if(!building){
this.error.set('Building number is required.');
return false;
}

if(building.length>this.maxBuildingNumberLength){
this.error.set(
`Building number cannot exceed ${this.maxBuildingNumberLength} characters.`
);
return false;
}

if(this.items().length===0){
this.error.set('Order must contain at least one item.');
return false;
}

const names=this.items()
.map(item=>item.itemName.trim().toLowerCase());

if(new Set(names).size!==names.length){
this.error.set('An order cannot contain duplicate items.');
return false;
}

return true;
}

createOrder():void{

if(!this.validate())return;

const request:CreateOrderRequest={
orderNumber:this.orderNumber(),
customerId:this.customerId(),
city:this.city().trim(),
street:this.street().trim(),
buildingNumber:this.buildingNumber().trim(),
currencyCode:this.currencyCode(),
orderItems:this.items().map(item=>({
itemName:item.itemName,
itemNameAlternate:item.itemNameAlternate??null,
quantity:item.quantity,
price:item.price
}))
};

this.orderService.createOrder(request).subscribe({
next:id=>{
this.router.navigate(['/orders',id]);
},
error:error=>{
this.error.set(
getApiErrorMessage(error,'Failed to create order.')
);
}
});

}

}