import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../User/Shop/shop.component';
import { ApiService } from '../core/api/api.service';
import { AuthService } from '../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<
    { product: Product; quantity: number }[]
  >([]);
  cart$: Observable<{ product: Product; quantity: number }[]> =
    this.cartSubject.asObservable();
  private subtotalSubject = new BehaviorSubject<number>(0);
  subtotal$: Observable<number> = this.subtotalSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.fetchCartItems();
      } else {
        this.cartSubject.next([]);
        this.subtotalSubject.next(0);
        this.loadingSubject.next(false);
      }
    } else {
      // During SSR, initialize empty state
      this.cartSubject.next([]);
      this.subtotalSubject.next(0);
      this.loadingSubject.next(false);
    }
  }

  async fetchCartItems(): Promise<void> {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.cartSubject.next([]);
      this.subtotalSubject.next(0);
      this.loadingSubject.next(false);
      return;
    }

    let isAuthenticated = await this.auth.isAccessTokenValid();
    if (!isAuthenticated) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.cartSubject.next([]);
        this.subtotalSubject.next(0);
        this.loadingSubject.next(false);
        return;
      }
      isAuthenticated = await this.auth.isAccessTokenValid();
      if (!isAuthenticated) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.cartSubject.next([]);
        this.subtotalSubject.next(0);
        this.loadingSubject.next(false);
        return;
      }
    }

    this.loadingSubject.next(true);
    this.api.get('/carts').subscribe({
      next: (res: any) => {
        console.log('Cart API response:', res);
        const cartItems = res?.result?.cartItems ?? [];

        const cart = cartItems.map((item: any) => ({
          product: {
            id: item.productId,
            name: item.productName,
            variantName: item.variantName || '', // từ API
            variantId: item.productVariantId,
            price: item.unitPrice || 0, // từ API
            image: item.productThumbnail
              ? `http://localhost:8080/elec/${item.productThumbnail.replace(
                  /\\/g,
                  '/'
                )}`
              : 'assets/placeholder.jpg',
            inStock: true,
          },
          quantity: item.qty || 1,
        }));

        // Nếu muốn lấy subtotal từ API luôn
        const subtotal = res?.result?.total ?? 0;

        this.cartSubject.next(cart);
        this.subtotalSubject.next(subtotal);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('Fetch cart error:', err);
        if (err.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        this.cartSubject.next([]);
        this.subtotalSubject.next(0);
        this.loadingSubject.next(false);
      },
    });
  }

  async addToCart(product: Product): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Cart operations not supported on server');
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    let isAuthenticated = await this.auth.isAccessTokenValid();
    if (!isAuthenticated) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        throw new Error('Vui lòng đăng nhập');
      }
      isAuthenticated = await this.auth.isAccessTokenValid();
      if (!isAuthenticated) {
        throw new Error('Vui lòng đăng nhập');
      }
    }

    const cartProductName = product.variantName
      ? `${product.name} ${product.variantName}`
      : product.name;
    const cartProduct = { ...product, name: cartProductName };

    const cartItem = {
      cartItems: [
        {
          productId: product.id,
          productVariantId: product.variantId,
          qty: product.quantity,
          cartItemVariations: product.variantName
            ? [
                {
                  variationId: 1,
                  type: 'Value',
                  value: product.variantName,
                  cartItemVariationValues: [
                    { variationValueId: product.variantId },
                  ],
                },
              ]
            : [],
        },
      ],
    };

    return new Promise((resolve, reject) => {
      this.api.post('/carts', cartItem).subscribe({
        next: () => {
          const currentCart = this.cartSubject.getValue();
          const existingItem = currentCart.find(
            (item) =>
              item.product.id === product.id &&
              item.product.variantId === product.variantId
          );
          if (existingItem) {
            existingItem.quantity++;
          } else {
            currentCart.push({ product: cartProduct, quantity: 1 });
          }
          this.cartSubject.next([...currentCart]);
          this.updateSubtotal();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  async increaseQty(item: {
    product: Product;
    quantity: number;
  }): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Cart operations not supported on server');
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    let isAuthenticated = await this.auth.isAccessTokenValid();
    if (!isAuthenticated) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        throw new Error('Vui lòng đăng nhập');
      }
      isAuthenticated = await this.auth.isAccessTokenValid();
      if (!isAuthenticated) {
        throw new Error('Vui lòng đăng nhập');
      }
    }

    const newQty = item.quantity + 1;
    return new Promise((resolve, reject) => {
      this.api
        .put('/carts/item/qty', {
          productVariantId: item.product.variantId,
          qty: newQty,
        })
        .subscribe({
          next: () => {
            item.quantity = newQty;
            this.cartSubject.next([...this.cartSubject.getValue()]);
            this.updateSubtotal();
            resolve();
          },
          error: (err) => reject(err),
        });
    });
  }

  async decreaseQty(item: {
    product: Product;
    quantity: number;
  }): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Cart operations not supported on server');
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    let isAuthenticated = await this.auth.isAccessTokenValid();
    if (!isAuthenticated) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        throw new Error('Vui lòng đăng nhập');
      }
      isAuthenticated = await this.auth.isAccessTokenValid();
      if (!isAuthenticated) {
        throw new Error('Vui lòng đăng nhập');
      }
    }

    if (item.quantity <= 1) {
      return this.removeItem(item);
    }

    const newQty = item.quantity - 1;
    return new Promise((resolve, reject) => {
      this.api
        .put('/carts/item/qty', {
          productVariantId: item.product.variantId,
          qty: newQty,
        })
        .subscribe({
          next: () => {
            item.quantity = newQty;
            this.cartSubject.next([...this.cartSubject.getValue()]);
            this.updateSubtotal();
            resolve();
          },
          error: (err) => reject(err),
        });
    });
  }

  async removeItem(item: {
    product: Product;
    quantity: number;
  }): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Cart operations not supported on server');
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    let isAuthenticated = await this.auth.isAccessTokenValid();
    if (!isAuthenticated) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        throw new Error('Vui lòng đăng nhập');
      }
      isAuthenticated = await this.auth.isAccessTokenValid();
      if (!isAuthenticated) {
        throw new Error('Vui lòng đăng nhập');
      }
    }

    return new Promise((resolve, reject) => {
      this.api
        .delete('/carts/item', {
          body: { productVariantId: item.product.variantId },
        })
        .subscribe({
          next: () => {
            const currentCart = this.cartSubject
              .getValue()
              .filter((i) => i.product.variantId !== item.product.variantId);
            this.cartSubject.next(currentCart);
            this.updateSubtotal();
            resolve();
          },
          error: (err) => reject(err),
        });
    });
  }

  async clearCart(): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('Cart operations not supported on server');
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    let isAuthenticated = await this.auth.isAccessTokenValid();
    if (!isAuthenticated) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        throw new Error('Vui lòng đăng nhập');
      }
      isAuthenticated = await this.auth.isAccessTokenValid();
      if (!isAuthenticated) {
        throw new Error('Vui lòng đăng nhập');
      }
    }

    return new Promise((resolve, reject) => {
      this.api.delete('/carts/clear').subscribe({
        next: () => {
          this.cartSubject.next([]);
          this.subtotalSubject.next(0);
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  private updateSubtotal(): void {
    const subtotal = this.cartSubject
      .getValue()
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
    this.subtotalSubject.next(subtotal);
  }
}
