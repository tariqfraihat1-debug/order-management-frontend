import { Component,inject,OnInit,signal } from '@angular/core';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { OrderDetails as OrderDetailsModel } from '../../../core/models/order/order-details.model';
import { OrderItem } from '../../../core/models/order/order-item.model';
import { OrderService } from '../../../core/services/order.service';

import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { Loading } from '../../../shared/components/loading/loading';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { OrderItems } from '../../../shared/components/order-items/order-items';
import { OrderItemDialog,OrderItemFormValue } from '../../../shared/components/order-item-dialog/order-item-dialog';

import { OrderActions,OrderDetailsAction } from './components/order-actions/order-actions';
import { OrderSummary } from './components/order-summary/order-summary';
import { DatePipe } from '@angular/common';
export type OrderAction='confirm'|'ship'|'cancel'|'delete'|'removeItem';

@Component({
  selector:'app-order-details',
  standalone:true,
  imports:[
    RouterLink,
    FontAwesomeModule,
    ContentHeader,
    Loading,
    StatusBadge,
    ConfirmDialog,
    OrderSummary,
    OrderActions,
    OrderItems,
    OrderItemDialog,
    DatePipe
  ],
  templateUrl:'./order-details.html'
})
export class OrderDetails implements OnInit{

  private readonly route=inject(ActivatedRoute);
  private readonly router=inject(Router);
  private readonly orderService=inject(OrderService);

  order=signal<OrderDetailsModel|null>(null);
  loading=signal(true);
  error=signal('');

  selectedAction=signal<OrderAction|null>(null);
  selectedItem=signal<OrderItem|null>(null);

  showConfirmDialog=signal(false);
  showItemDialog=signal(false);

  itemDialogMode=signal<'add'|'editQuantity'>('add');

  faChevronRight=faChevronRight;

  ngOnInit(){
    const id=Number(this.route.snapshot.paramMap.get('orderId'));

    if(!id){
      this.error.set('Invalid order id.');
      this.loading.set(false);
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id:number){
    this.loading.set(true);

    this.orderService.getOrderById(id).subscribe({
      next:order=>{
        this.order.set(order);
        this.loading.set(false);
      },
      error:()=>{
        this.error.set('Failed to load order details.');
        this.loading.set(false);
      }
    });
  }

  isEditable(){
    const state=this.order()?.orderStateName;
    return state==='Pending'||state==='Confirmed';
  }

  onActionSelected(action:OrderDetailsAction){
    this.selectedAction.set(action);
    this.showConfirmDialog.set(true);
  }

  confirmSelectedAction(){
    const order=this.order();
    const action=this.selectedAction();

    if(!order||!action)return;

    switch(action){

      case 'confirm':
        this.orderService.confirmOrder(order.orderId)
        .subscribe(()=>this.refresh());
        break;

      case 'ship':
        this.orderService.shipOrder(order.orderId)
        .subscribe(()=>this.refresh());
        break;

      case 'cancel':
        this.orderService.cancelOrder(order.orderId)
        .subscribe(()=>this.refresh());
        break;

      case 'delete':
        this.orderService.deleteOrder(order.orderId)
        .subscribe(()=>this.router.navigate(['/orders']));
        break;

      case 'removeItem':
        const item=this.selectedItem();

        if(item){
          this.orderService.removeOrderItem(order.orderId,item.itemId)
          .subscribe(()=>this.refresh());
        }
        break;
    }
  }

  openAddItem(){
    this.selectedItem.set(null);
    this.itemDialogMode.set('add');
    this.showItemDialog.set(true);
  }

  editItem(item:OrderItem){
    this.selectedItem.set(item);
    this.itemDialogMode.set('editQuantity');
    this.showItemDialog.set(true);
  }

  removeItem(item:OrderItem){
    this.selectedItem.set(item);
    this.selectedAction.set('removeItem');
    this.showConfirmDialog.set(true);
  }

  addItem(value:OrderItemFormValue){
    const order=this.order();

    if(!order)return;

    this.orderService.addOrderItem(order.orderId,value)
    .subscribe(()=>this.refresh());

    this.closeItemDialog();
  }

  updateItemQuantity(quantity:number){
    const order=this.order();
    const item=this.selectedItem();

    if(!order||!item)return;

    this.orderService.updateOrderItemQuantity(
      order.orderId,
      item.itemId,
      quantity
    ).subscribe(()=>this.refresh());

    this.closeItemDialog();
  }

  closeItemDialog(){
    this.showItemDialog.set(false);
    this.selectedItem.set(null);
  }

  cancelDialog(){
    this.showConfirmDialog.set(false);
    this.selectedAction.set(null);
    this.selectedItem.set(null);
  }

  confirmationTitle(){
    const titles:Record<string,string>={
      confirm:'Confirm Order',
      ship:'Ship Order',
      cancel:'Cancel Order',
      delete:'Delete Order',
      removeItem:'Remove Item'
    };

    return titles[this.selectedAction()??'']??'Confirmation';
  }

  confirmationMessage(){
    const messages:Record<string,string>={
      confirm:'Are you sure you want to confirm this order?',
      ship:'Are you sure you want to ship this order?',
      cancel:'Are you sure you want to cancel this order?',
      delete:'Are you sure you want to delete this order?'
    };

    return messages[this.selectedAction()??'']
    ??`Are you sure you want to remove ${this.selectedItem()?.itemName}?`;
  }

  confirmationText(){
    const buttons:Record<string,string>={
      confirm:'Confirm',
      ship:'Ship',
      cancel:'Cancel',
      delete:'Delete',
      removeItem:'Remove'
    };

    return buttons[this.selectedAction()??'']??'Confirm';
  }

  isDangerAction(){
    return ['cancel','delete','removeItem']
    .includes(this.selectedAction()??'');
  }

  private refresh(){
    const id=this.order()?.orderId;

    this.cancelDialog();

    if(id){
      this.loadOrder(id);
    }
  }
}