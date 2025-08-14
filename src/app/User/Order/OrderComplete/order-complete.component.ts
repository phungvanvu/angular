import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/api/api.service';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css'],
})
export class OrderCompleteComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);

  order: any = null;
  loading = false;
  error = '';
  orderId: string | null = null;

  // Steps - set current = 3 (Order Complete)
  steps = {
    current: 3,
    cart: 1,
    checkout: 2,
    orderComplete: 3,
  };

  ngOnInit(): void {
    // Lấy id từ route param /orders/:id
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.orderId = id;
      if (!id) {
        this.error = 'Không tìm thấy order id trong đường dẫn.';
        return;
      }
      this.fetchOrder(id);
    });
  }

  private fetchOrder(id: string): void {
    this.loading = true;
    this.error = '';
    this.apiService.get(`/orders/${id}`).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.code === 200 && res.result) {
          this.order = res.result;
          // đảm bảo các giá trị số là number
          this.order.subTotal = Number(this.order.subTotal || 0);
          this.order.shippingCost = Number(this.order.shippingCost || 0);
          this.order.discount = Number(this.order.discount || 0);
          this.order.total = Number(this.order.total || 0);
        } else {
          this.error = res?.message || 'Lỗi khi tải thông tin đơn hàng.';
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error =
          (err?.error?.message as string) ||
          `Lỗi khi gọi API (${err?.status || 'unknown'})`;
        console.error('fetchOrder error', err);
        this.cd.detectChanges();
      },
    });
  }

  formatPrice(price: number): string {
    if (price == null || isNaN(price)) return '-';
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  // sanitize/normalize image path từ server (thay \ -> /, add leading / nếu cần)
  // sanitize/normalize image path từ server (thay \ -> /, add leading / nếu cần)
  imageSrc(thumbnail: string | null | undefined): string {
    if (!thumbnail) return '/assets/no-image.png';
    if (thumbnail.startsWith('http')) return thumbnail;
    const normalized = thumbnail.replace(/\\/g, '/').replace(/^\/+/, '');
    return `http://localhost:8080/elec/${normalized}`;
  }

  // step helpers (dùng trong template)
  isCurrentStep(step: number): boolean {
    return this.steps.current === step;
  }

  isCompletedStep(step: number): boolean {
    return this.steps.current > step;
  }

  // copy text (ví dụ copy order id)
  copyToClipboard(text: string): void {
    try {
      navigator.clipboard.writeText(text);
      // optional: thông báo nhẹ bằng alert hoặc toast (tùy hệ thống)
      alert('Đã sao chép: ' + text);
    } catch (e) {
      console.error('Clipboard failed', e);
    }
  }

  printInvoice(): void {
    window.print();
  }
}
