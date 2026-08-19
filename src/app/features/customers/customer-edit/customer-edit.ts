import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {CustomerService} from '../../../core/services/customer.service';

import {CustomerDetails}
from '../../../core/models/customer/customer-details.model';

import {UpdateCustomerRequest}
from '../../../core/models/customer/update-customer-request.model';

import {getApiErrorMessage}
from '../../../core/utils/api-error.util';


import {Breadcrumb}
from '../../../shared/components/breadcrumb/breadcrumb';

import {ContentHeader}
from '../../../shared/components/content-header/content-header';

import {Loading}
from '../../../shared/components/loading/loading';
import { CustomerForm } from '../../../shared/components/customer-form/customer-form';





@Component({

selector:'app-customer-edit',

standalone:true,

imports: [
    Breadcrumb,
    ContentHeader,
    Loading,
    
    CustomerForm
    
],

templateUrl:'./customer-edit.html',

styles:``
})
export class CustomerEdit implements OnInit{


private readonly route=inject(ActivatedRoute);

private readonly router=inject(Router);

private readonly customerService=inject(CustomerService);



customer=signal<CustomerDetails|null>(null);

loading=signal(true);

error=signal('');



ngOnInit():void{


const id =
Number(
this.route.snapshot.paramMap.get('customerId')
);



if(!id){

this.error.set('Invalid customer id.');

this.loading.set(false);

return;

}



this.loadCustomer(id);

}



loadCustomer(id:number):void{


this.customerService
.getCustomerById(id)
.subscribe({

next:customer=>{

this.customer.set(customer);

this.loading.set(false);

},


error:error=>{

this.error.set(
getApiErrorMessage(
error,
'Failed to load customer.'
)
);

this.loading.set(false);

}

});


}



updateCustomer(
value:{
customerName:string;
email:string;
phone:string;
isActive:boolean;
}
):void{

const customer=this.customer();

if(!customer)
return;


const updateRequest:UpdateCustomerRequest = {

customerName:value.customerName,

email:value.email,

phone:value.phone

};


this.customerService
.updateCustomer(
customer.customerId,
updateRequest
)
.subscribe({

next:()=>{

if(customer.isActive !== value.isActive){

const statusRequest =
value.isActive
?
this.customerService.activateCustomer(customer.customerId)
:
this.customerService.deactivateCustomer(customer.customerId);


statusRequest.subscribe(()=>{

this.router.navigate([
'/customers',
customer.customerId
]);

});

}
else{

this.router.navigate([
'/customers',
customer.customerId
]);

}

},

error:error=>{

this.error.set(
getApiErrorMessage(
error,
'Failed to update customer.'
)
);

}

});

}


cancel():void{

const id=this.customer()?.customerId;


if(id){

this.router.navigate([
'/customers',
id
]);

}
else{

this.router.navigate([
'/customers'
]);

}

}


}