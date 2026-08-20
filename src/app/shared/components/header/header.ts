import {Component,computed,inject} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faBars,faBell} from '@fortawesome/free-solid-svg-icons';

import {AuthService} from '../../../core/services/auth.service';
import {SearchInput} from '../search-input/search-input';

@Component({
selector:'app-header',
standalone:true,
imports:[
FontAwesomeModule,
SearchInput
],
templateUrl:'./header.html'
})
export class Header{
private readonly authService=inject(AuthService);

faBars=faBars;
faBell=faBell;

initials=computed(()=>{
const username=this.authService.username();
return username
?username.substring(0,2).toUpperCase()
:'';
});
}