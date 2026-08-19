import {Component,output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
selector:'app-shipping-address',
standalone:true,
imports:[FormsModule],
templateUrl:'./shipping-address.html'
})
export class ShippingAddress{

cityChanged=output<string>();
streetChanged=output<string>();
buildingChanged=output<string>();

onCityChange(value:string):void{
this.cityChanged.emit(value);
}

onStreetChange(value:string):void{
this.streetChanged.emit(value);
}

onBuildingChange(value:string):void{
this.buildingChanged.emit(value);
}

}