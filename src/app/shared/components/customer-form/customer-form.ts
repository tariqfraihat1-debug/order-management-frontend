import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerDetails } from '../../../core/models/customer/customer-details.model';
import { CreateCustomerRequest } from '../../../core/models/customer/create-customer-request.model';
import { Button } from "../button/button";

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    FormsModule,
    Button
],
  templateUrl: './customer-form.html',
  styles: ``
})
export class CustomerForm {
 customer = input<CustomerDetails | null>(null);
saved = output<CreateCustomerRequest>();

  cancelled = output<void>();
  customerName = signal('');
  email = signal('');
  phone = signal('');
  isActive = signal(true);
  nameError = signal('');
  emailError = signal('');
  phoneError = signal('');

  // Loads existing customer data into the form when editing
  constructor() {
    effect(() => {
      const data = this.customer();

      if (data) {
        this.customerName.set(data.customerName);
        this.email.set(data.email);
        this.phone.set(data.phone);
        this.isActive.set(data.isActive);
      }
    });
  }

  // Validates the customer form fields
  validate(): boolean {
    let valid = true;

    this.nameError.set('');
    this.emailError.set('');
    this.phoneError.set('');

    const name = this.customerName().trim();
    const email = this.email().trim();
    const phone = this.phone().trim();

    if (!name) {
      this.nameError.set('Full name is required.');
      valid = false;
    } else if (name.length > 100) {
      this.nameError.set('Name cannot exceed 100 characters.');
      valid = false;
    }

    if (!email) {
      this.emailError.set('Email is required.');
      valid = false;
    } else if (email.length > 150) {
      this.emailError.set('Email cannot exceed 150 characters.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.emailError.set('Enter a valid email address.');
      valid = false;
    }

    if (!phone) {
      this.phoneError.set('Phone is required.');
      valid = false;
    } else if (phone.length > 13) {
      this.phoneError.set('Phone cannot exceed 13 characters.');
      valid = false;
    } else if (!/^[0-9+\-]+$/.test(phone)) {
      this.phoneError.set('Phone can contain only digits, + and -.');
      valid = false;
    }

    return valid;
  }

  // Validates and emits the customer form data
  submit(): void {
    if (!this.validate()) {
      return;
    }

    this.saved.emit({
      customerName: this.customerName().trim(),
      email: this.email().trim(),
      phone: this.phone().trim(),
      isActive: this.isActive()
    });
  }

  // Cancels the form
  cancel(): void {
    this.cancelled.emit();
  }
}