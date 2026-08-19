import {Component, effect, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {CustomerDetails}
from '../../../core/models/customer/customer-details.model';

import {UpdateCustomerRequest}
from '../../../core/models/customer/update-customer-request.model';


@Component({

selector:'app-customer-form',

standalone:true,

imports:[
FormsModule
],

templateUrl:'./customer-form.html',

styles:``
})
export class CustomerForm{


customer=input<CustomerDetails|null>(null);



saved=output<{
customerName:string;
email:string;
phone:string;
isActive:boolean;
}>();

cancelled=output<void>();



customerName=signal('');

email=signal('');

phone=signal('');

isActive=signal(true);



nameError=signal('');

emailError=signal('');

phoneError=signal('');



constructor(){

effect(()=>{

const data=this.customer();


if(data){

this.customerName.set(data.customerName);

this.email.set(data.email);

this.phone.set(data.phone);

this.isActive.set(data.isActive);

}

});

}



validate():boolean{


let valid=true;


this.nameError.set('');

this.emailError.set('');

this.phoneError.set('');



if(!this.customerName().trim()){

this.nameError.set(
'Full name is required.'
);

valid=false;

}



if(!this.email().trim()){

this.emailError.set(
'Email is required.'
);

valid=false;

}



if(!this.phone().trim()){

this.phoneError.set(
'Phone is required.'
);

valid=false;

}



return valid;

}




submit():void{


if(!this.validate())
return;



this.saved.emit({

customerName:this.customerName().trim(),

email:this.email().trim(),

phone:this.phone().trim(),

isActive:this.isActive()

});


}




cancel():void{

this.cancelled.emit();

}


}