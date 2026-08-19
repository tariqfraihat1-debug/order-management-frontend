import {HttpErrorResponse,HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError,throwError} from 'rxjs';

export const errorInterceptor:HttpInterceptorFn=(req,next)=>{
const router=inject(Router);

return next(req).pipe(
catchError((error:HttpErrorResponse)=>{
if(error.status===401&&!req.url.includes('/auth/login')){
localStorage.removeItem('token');
localStorage.removeItem('username');
router.navigate(['/login']);
}

if(error.status===0)console.error('Cannot connect to the server.');
else if(error.status===400)console.error('Bad request.',error.error);
else if(error.status===401)console.error('Unauthorized.');
else if(error.status===403)console.error('Forbidden.');
else if(error.status===404)console.error('Resource not found.');
else if(error.status===409)console.error('Conflict.',error.error);
else if(error.status>=500)console.error('Server error.');
else console.error('Unexpected error.',error);

return throwError(()=>error);
})
);
};