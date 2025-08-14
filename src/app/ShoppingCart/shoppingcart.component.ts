import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../User/Shop/shop.component';
import { CartService } from './cart.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'shoppingcart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css'],
})
export class ShoppingcartComponent implements OnInit, OnChanges {
  @Input() isCartOpen: boolean = false;
  @Input() closeCart!: () => void;

  cart: { product: Product; quantity: number }[] = [];
  subtotal: number = 0;

  loading: boolean = true;
  error: string = '';
  toastText: string = '';
  toastVisible: boolean = false;
  toastTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.cd.detectChanges();
    });

    this.cartService.subtotal$.subscribe((subtotal) => {
      this.subtotal = subtotal;
      this.cd.detectChanges();
    });

    this.cartService.loading$.subscribe((loading) => {
      this.loading = loading;
      this.cd.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isCartOpen'] && changes['isCartOpen'].currentValue) {
      this.cartService.fetchCartItems();
    }
  }

  async increaseQty(item: {
    product: Product;
    quantity: number;
  }): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await this.cartService.increaseQty(item);
      const productName = item.product.variantName
        ? `${item.product.name} ${item.product.variantName}`
        : item.product.name;
      this.showToast(`Đã tăng số lượng ${productName}`);
    } catch (err) {
      console.error('Increase quantity error:', err);
      this.showToast('Lỗi khi cập nhật số lượng');
      this.cd.detectChanges();
    }
  }

  async decreaseQty(item: {
    product: Product;
    quantity: number;
  }): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await this.cartService.decreaseQty(item);
      const productName = item.product.variantName
        ? `${item.product.name} ${item.product.variantName}`
        : item.product.name;
      this.showToast(`Đã giảm số lượng ${productName}`);
    } catch (err) {
      console.error('Decrease quantity error:', err);
      this.showToast('Lỗi khi cập nhật số lượng');
      this.cd.detectChanges();
    }
  }

  async removeItem(item: {
    product: Product;
    quantity: number;
  }): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await this.cartService.removeItem(item);
      const productName = item.product.variantName
        ? `${item.product.name} ${item.product.variantName}`
        : item.product.name;
      this.showToast(`Đã xóa ${productName} khỏi giỏ hàng`);
    } catch (err) {
      console.error('Remove item error:', err);
      this.showToast('Lỗi khi xóa sản phẩm');
      this.cd.detectChanges();
    }
  }

  async clearCart(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await this.cartService.clearCart();
      this.showToast('Đã xóa toàn bộ giỏ hàng');
    } catch (err) {
      console.error('Clear cart error:', err);
      this.showToast('Lỗi khi xóa giỏ hàng');
      this.cd.detectChanges();
    }
  }

  showToast(message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
      this.toastVisible = false;
    }
    this.toastText = message;
    this.toastVisible = true;
    this.cd.detectChanges();
    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
      this.toastTimeout = null;
      this.cd.detectChanges();
    }, 3000);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
