import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/api/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private cd: ChangeDetectorRef) {}
  // Dữ liệu form thông tin tài khoản
  accountDetails = {
    email: '',
    phone: '',
  };

  // Dữ liệu form thông tin thanh toán
  billingDetails = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };

  // Dữ liệu form thông tin giao hàng
  shippingDetails = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };

  // Chi tiết đơn hàng bổ sung
  orderDetails = {
    shippingMethod: 'Standard',
    paymentMethod: 'COD',
    note: '',
    currency: 'VND',
    currencyRate: 1,
    locale: 'vi_VN',
    status: 'PENDING',
    couponId: null as number | null,
  };

  // Thông tin giỏ hàng
  orderSummary = {
    cartItems: [] as any[],
    couponCode: '',
    subtotal: 0,
    shippingCost: 0.0,
    total: 0,
  };

  // Trạng thái checkbox sao chép địa chỉ
  sameAsBilling = true;

  // Lỗi validation
  errors: { [key: string]: string } = {};

  // Trạng thái các bước checkout
  steps = {
    current: 2, // Bước hiện tại (Checkout)
    cart: 1,
    checkout: 2,
    orderComplete: 3,
  };

  ngOnInit(): void {
    this.fetchCart();
  }

  // Lấy thông tin giỏ hàng từ CartService
  private async fetchCart(): Promise<void> {
    try {
      const isAuthenticated = await this.authService.isAccessTokenValid();
      if (!isAuthenticated) return;

      this.apiService.get('/carts').subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.result) {
            this.orderSummary.cartItems = res.result.cartItems.map(
              (ci: any) => ({
                product: {
                  name: ci.productName,
                  image:
                    'http://localhost:8080/elec/' +
                    ci.productThumbnail.replace(/\\/g, '/'),
                  variantName: ci.variantName,
                  price: ci.unitPrice,
                },
                quantity: ci.qty,
              })
            );

            this.orderSummary.subtotal = this.orderSummary.cartItems.reduce(
              (total, item) => total + item.product.price * item.quantity,
              0
            );
            this.orderSummary.total =
              this.orderSummary.subtotal + this.orderSummary.shippingCost;
            this.cd.detectChanges();
          }
        },
        error: (err) => console.error(err),
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Hàm áp dụng mã giảm giá
  applyCoupon(): void {
    if (this.orderSummary.couponCode.trim()) {
      // Logic áp dụng mã giảm giá (gọi API để validate và lấy couponId nếu cần)
      console.log('Áp dụng mã giảm giá:', this.orderSummary.couponCode);
      // Giả sử: this.orderDetails.couponId = someId; và cập nhật total nếu có discount
    }
  }

  // Hàm gửi đơn hàng đến API
  submitOrder(): void {
    this.errors = {}; // Reset lỗi

    // Sao chép nếu checkbox checked
    if (this.sameAsBilling) {
      this.shippingDetails = { ...this.billingDetails };
    }

    // Xây dựng payload cho API
    const payload = {
      customerEmail: this.accountDetails.email,
      customerPhone: this.accountDetails.phone,
      billingFirstName: this.billingDetails.firstName,
      billingLastName: this.billingDetails.lastName,
      billingAddress1: this.billingDetails.address1,
      billingAddress2: this.billingDetails.address2 || '',
      billingCity: this.billingDetails.city,
      billingState: this.billingDetails.state || '',
      billingZip: this.billingDetails.zip || '',
      billingCountry: this.billingDetails.country,
      shippingFirstName: this.shippingDetails.firstName || '',
      shippingLastName: this.shippingDetails.lastName || '',
      shippingAddress1: this.shippingDetails.address1 || '',
      shippingAddress2: this.shippingDetails.address2 || '',
      shippingCity: this.shippingDetails.city || '',
      shippingState: this.shippingDetails.state || '',
      shippingZip: this.shippingDetails.zip || '',
      shippingCountry: this.shippingDetails.country || '',
      shippingMethod: this.orderDetails.shippingMethod,
      shippingCost: this.orderSummary.shippingCost,
      couponId: this.orderDetails.couponId,
      paymentMethod: this.orderDetails.paymentMethod,
      currency: this.orderDetails.currency,
      currencyRate: this.orderDetails.currencyRate,
      locale: this.orderDetails.locale,
      status: this.orderDetails.status,
      note: this.orderDetails.note || '',
    };

    // Gọi API bằng ApiService để đảm bảo có authentication headers
    this.apiService.post('/orders', payload).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          if (this.orderDetails.paymentMethod === 'COD') {
            this.router.navigate(['/orders', res.result.id]);
          } else if (this.orderDetails.paymentMethod === 'DEBIT_CARD') {
            window.location.href = res.result.checkoutUrl;
          }
        }
      },
      error: (err) => {
        if (err.status === 400 && err.error.code === 400) {
          this.errors = err.error.result || {};
        } else {
          console.error('Lỗi khi gửi đơn hàng:', err);
        }
      },
    });
  }

  // Hàm định dạng giá tiền
  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  // Hàm kiểm tra bước hiện tại
  isCurrentStep(step: number): boolean {
    return this.steps.current === step;
  }

  // Hàm kiểm tra bước đã hoàn thành
  isCompletedStep(step: number): boolean {
    return this.steps.current > step;
  }
}
