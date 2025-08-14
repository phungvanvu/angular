import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../ShoppingCart/cart.service';
import { debounceTime, Subject } from 'rxjs';

interface ApiProduct {
  id: number;
  thumbnail: string;
  gallery: string[];
  brand: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  manageStock: boolean;
  qty: number;
  inStock: boolean;
  isActive: boolean;
  newFrom: string;
  newTo: string;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  variations: {
    id: number;
    name: string;
    type: string;
    isGlobal: boolean;
    variationValues: {
      id: number;
      label: string;
      value: string;
    }[];
    updatedAt: string;
  }[];
  variants: {
    id: number;
    name: string;
    product: string;
    price: number;
    specialPrice: number;
    specialPriceType: number;
    specialPriceStart: string;
    specialPriceEnd: string;
    sellingPrice: number;
    sku: string;
    manageStock: boolean;
    qty: number;
    inStock: boolean;
    isActive: boolean;
  }[];
  updatedAt: string;
}

@Component({
  selector: 'product-detail',
  templateUrl: 'detailproduct.component.html',
  styleUrls: ['detailproduct.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class ProductDetailComponent implements OnInit {
  apiProduct: ApiProduct | null = null;
  product: any = {}; // Mapped for display
  variants: any[] = [];
  selectedVariant: any = null;
  selectedVariantName: string = '';
  maxQuantity: number = Infinity;
  images: string[] = [];
  selectedImage = 0;
  quantity = 1;
  activeTab = 'description';
  showSizeChart = false;
  toastText: string = '';
  toastVisible: boolean = false;
  toastTimeout: ReturnType<typeof setTimeout> | null = null;
  showLoginModal: boolean = false;
  variantLabel = 'Tùy chọn'; // mặc định
  // Keep hardcoded parts that aren't in API
  relatedProducts = [
    {
      name: 'DUDUALISS Men Long Sleeve Shirt Men...',
      price: 17.3,
      image: 'assets/images/related1.jpg',
      rating: 4,
    },
    {
      name: 'S-5XL Plus Size Brand Clothing Cotton Mens...',
      price: 7.47,
      image: 'assets/images/related2.jpg',
      rating: 4,
    },
    {
      name: '2019 brand casual spring luxury plaid lon...',
      price: 5.24,
      image: 'assets/images/related3.jpg',
      rating: 4,
    },
    {
      name: 'Long-sleeved Camisa Masculina Chamise...',
      price: 9.69,
      image: 'assets/images/related4.jpg',
      rating: 5,
    },
    {
      name: 'Europe size Summer Short Sleeve Solid Polo...',
      price: 8.35,
      image: 'assets/images/related5.jpg',
      rating: 4,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private cartService: CartService,
    private router: Router,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.fetchProduct(id);
      }
    });

    if (this.variants?.length > 0 && this.variants[0].type) {
      this.variantLabel = this.variants[0].type;
    }
  }

  fetchProduct(id: string): void {
    this.api
      .get(`/products/${id}`, { headers: { 'skip-auth': 'true' } })
      .subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.result) {
            this.apiProduct = res.result;
            this.mapProductData();
            this.cd.detectChanges();
          } else {
            this.showToast('Không tìm thấy sản phẩm.');
          }
        },
        error: (err) => {
          console.error('API error:', err);
          this.showToast('Lỗi khi tải thông tin sản phẩm.');
        },
      });
  }

  mapProductData(): void {
    if (!this.apiProduct) return;

    const baseUrl = 'http://localhost:8080/elec/';
    const thumbnail = this.apiProduct.thumbnail
      ? baseUrl + this.apiProduct.thumbnail.replace(/\\/g, '/')
      : '';
    const gallery =
      this.apiProduct.gallery?.map((g) => baseUrl + g.replace(/\\/g, '/')) ||
      [];

    // Danh sách ảnh
    this.images = thumbnail ? [thumbnail, ...gallery] : [...gallery];

    // Lấy danh sách biến thể
    this.variants = this.apiProduct.variants || [];

    // Gán biến thể mặc định + label
    if (this.variants.length > 0) {
      this.selectedVariant = this.variants[0];
      this.selectedVariantName = this.selectedVariant.name;
      if (this.apiProduct.variations?.length > 0) {
        this.variantLabel = this.apiProduct.variations[0].name;
      } else {
        this.variantLabel = 'Tùy chọn';
      }
    }

    this.product = {
      id: this.apiProduct.id,
      name: this.apiProduct.name,
      description: this.apiProduct.description,
      shortDescription: this.apiProduct.shortDescription,
      category: this.apiProduct.categories?.join(', ') || 'Chưa phân loại',
      brand: this.apiProduct.brand,
      sku: this.apiProduct.sku,
      inStock: this.apiProduct.inStock,
      rating: 0,
      reviews: 0,
      tags: [],
      features: [
        '24/7 SUPPORT - Support every time',
        'ACCEPT PAYMENT - Visa, Paypal, Master',
        'SECURED PAYMENT - 100% Secured',
        'FREE SHIPPING - Order over 100K',
        '30 DAYS RETURN - 30 days guarantee',
      ],
      warranty: 'Bảo hành theo nhà sản xuất',
      images: this.images,
    };

    this.updateDisplayFromVariant();
    this.cd.detectChanges();
  }

  updateDisplayFromVariant(): void {
    if (this.selectedVariant) {
      this.product.price = this.selectedVariant.sellingPrice;
      this.product.originalPrice =
        this.selectedVariant.price > this.selectedVariant.sellingPrice
          ? this.selectedVariant.price
          : null;
      this.product.inStock = this.selectedVariant.inStock;
      this.product.sku = this.selectedVariant.sku;
      this.maxQuantity = this.selectedVariant.manageStock
        ? this.selectedVariant.qty
        : Infinity;
    }
  }

  selectImage(index: number) {
    this.selectedImage = index;
  }

  changeQuantity(change: number) {
    const newQty = this.quantity + change;
    this.quantity = Math.max(1, Math.min(newQty, this.maxQuantity));
  }

  async addToCart() {
    if (!this.selectedVariant) {
      this.showToast('Vui lòng chọn biến thể sản phẩm.');
      return;
    }

    if (this.selectedVariant.inStock === false) {
      this.showToast(
        `${this.product.name} (${this.selectedVariantName}) hiện đã hết hàng`
      );
      return;
    }

    const accessToken = this.auth.getAccessToken();
    if (!accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    let isValid = await this.auth.isAccessTokenValid();
    if (!isValid) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        this.auth.logout();
        return;
      }
      isValid = await this.auth.isAccessTokenValid();
      if (!isValid) {
        this.showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        this.auth.logout();
        return;
      }
    }

    const cartProduct = {
      id: this.apiProduct!.id,
      name: this.apiProduct!.name,
      quantity: this.quantity,
      minPrice: this.apiProduct!.minPrice,
      maxPrice: this.apiProduct!.maxPrice,
      variantName: this.selectedVariant.name,
      variantId: this.selectedVariant.id,
      variantType: this.selectedVariant.type,
      price: this.selectedVariant.sellingPrice,
      image: this.images[0],
      updatedAt: this.apiProduct!.updatedAt,
      categories: this.apiProduct!.categories,
      isActive: this.selectedVariant.isActive,
      inStock: this.selectedVariant.inStock,
      newFrom: this.apiProduct!.newFrom,
      newTo: this.apiProduct!.newTo,
    };

    try {
      await this.cartService.addToCart(cartProduct);
      this.showToast(
        `${this.product.name} (${this.selectedVariantName}) đã được thêm vào giỏ hàng`
      );
    } catch (err: any) {
      console.error('Cart API error:', err);
      if (
        err.status === 401 ||
        err.error?.message === 'Không tìm thấy người dùng.'
      ) {
        this.auth.logout();
      } else {
        this.showToast('Lỗi khi thêm sản phẩm vào giỏ hàng');
      }
    }
    this.cd.detectChanges();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSizeChart() {
    this.showSizeChart = !this.showSizeChart;
  }

  shareProduct(platform: string) {
    console.log('Sharing on', platform);
  }

  getStars(rating: number): string[] {
    return Array(5)
      .fill('')
      .map((_, i) => (i < rating ? 'star' : 'star_border'));
  }

  showToast(message: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
      this.toastVisible = false;
    }
    this.ngZone.run(() => {
      this.toastText = message;
      this.toastVisible = true;
      this.cd.detectChanges();
      this.toastTimeout = setTimeout(() => {
        this.toastVisible = false;
        this.toastTimeout = null;
        this.cd.detectChanges();
      }, 3000);
    });
  }

  formatPrice(value: number): string {
    if (value == null) return '';
    return value.toLocaleString('vi-VN');
  }
}
