import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingcartComponent } from '../../ShoppingCart/shoppingcart.component';
import { ApiService } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../ShoppingCart/cart.service';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  minPrice: number;
  maxPrice: number;
  variantName?: string;
  variantId?: number;
  quantity?: number;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  updatedAt: string;
  categories: string[];
  isActive: boolean;
  inStock: boolean;
  newFrom: string;
  newTo: string;
  variants?: any[];
  variations?: any[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  expanded?: boolean;
}

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ShoppingcartComponent],
})
export class ShopComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'Default';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  priceRange: [number, number] = [0, 50000000];
  searchKeyword: string = '';
  cartItems: number = 0;
  isCartOpen: boolean = false;
  toastText: string = '';
  toastVisible: boolean = false;
  toastTimeout: ReturnType<typeof setTimeout> | null = null;
  showLoginModal: boolean = false;
  showUserMenu: boolean = false;
  userName: string = '';
  userEmail: string = '';

  sortOptions = ['Default', 'Latest', 'Price Low to High', 'Price High to Low'];
  itemsPerPageOptions = [5, 10, 20, 30];

  categories: Category[] = [
    { id: 'electronics', name: 'Electronics', icon: '', expanded: true },
    { id: 'mens-fashion', name: "Men's Fashion", icon: '', expanded: false },
    {
      id: 'consumer-electronics',
      name: 'Consumer Electronics',
      icon: '',
      expanded: false,
    },
    { id: 'watches', name: 'Watches', icon: '', expanded: false },
    {
      id: 'home-appliances',
      name: 'Home Appliances',
      icon: '',
      expanded: false,
    },
    { id: 'backpacks', name: 'Backpacks', icon: '', expanded: false },
    {
      id: 'womens-fashion',
      name: "Women's Fashion",
      icon: '',
      expanded: false,
    },
  ];

  filteredProducts: Product[] = [];
  latestProducts: Product[] = [];
  totalPages: number = 0;
  totalElements: number = 0;
  loading: boolean = true;
  error: string = '';

  private searchSubject = new Subject<void>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cartService: CartService,
    private router: Router,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.fetchProducts();
    });

    this.fetchProducts();
    this.loadUserInfo();

    this.cartService.cart$.subscribe((cart) => {
      this.cartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      this.cd.detectChanges();
    });
  }
  loadUserInfo() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || 'User';
        this.userEmail = payload.sub || '';
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown') && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  toggleCategory(categoryId: string): void {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) {
      category.expanded = !category.expanded;
      this.filterByCategory(categoryId);
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value || this.sortBy;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.fetchProducts();
  }

  onPriceRangeChange(event: any): void {
    const value = parseInt(event.target.value);
    if (event.target.type === 'range') {
      this.priceRange[1] = value;
    } else if (
      event.target ===
      event.target.ownerDocument.querySelector('.price-input:first-child')
    ) {
      this.priceRange[0] = value >= 0 ? value : 0;
    } else {
      this.priceRange[1] =
        value >= this.priceRange[0] ? value : this.priceRange[0];
    }
    this.currentPage = 1;
    this.ngZone.run(() => {
      this.searchSubject.next();
    });
  }

  onSearchInput(event: any): void {
    this.searchKeyword = event.target.value || '';
    this.currentPage = 1;
    this.ngZone.run(() => {
      this.searchSubject.next();
    });
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = '';

    const params: any = {
      page: this.currentPage - 1,
      size: this.itemsPerPage,
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1],
      isActive: true,
      inStock: true,
    };

    if (this.searchKeyword) {
      params.keyword = this.searchKeyword;
    }

    if (this.sortBy !== 'Default') {
      params.sort = this.getSortField();
    }

    this.api
      .get('/products/search', { params, headers: { 'skip-auth': 'true' } })
      .subscribe({
        next: (res: any) => {
          const pageResult = res?.result;
          const rawProducts = pageResult?.content ?? [];

          this.filteredProducts = rawProducts.map((product: any) => {
            let updatedAt = '';
            if (product.updatedAt) {
              const date = new Date(product.updatedAt);
              if (!isNaN(date.getTime())) {
                updatedAt = date.toISOString();
              } else {
                console.warn(
                  `Invalid updatedAt value for product ${product.id}:`,
                  product.updatedAt
                );
              }
            }

            // Lấy biến thể đầu tiên làm mặc định
            const firstVariant =
              product.variants && product.variants.length > 0
                ? product.variants[0]
                : {};
            const variantName = firstVariant.name || '';
            const variantId = firstVariant.id || null;
            const price = firstVariant.sellingPrice || product.minPrice || 0;

            const currentDate = new Date();
            const newFrom = product.newFrom ? new Date(product.newFrom) : null;
            const newTo = product.newTo ? new Date(product.newTo) : null;
            let badge = product.inStock === false ? 'Hết hàng' : undefined;
            let badgeColor = product.inStock === false ? 'danger' : 'success';
            if (
              !badge &&
              newFrom &&
              newTo &&
              !isNaN(newFrom.getTime()) &&
              !isNaN(newTo.getTime()) &&
              currentDate >= newFrom &&
              currentDate <= newTo
            ) {
              badge = 'Mới';
              badgeColor = 'success';
            }

            return {
              id: product.id || 0,
              name: product.name || 'Sản phẩm không xác định',
              minPrice: product.minPrice || 0,
              maxPrice: product.maxPrice || product.minPrice || 0,
              variantName,
              variantId,
              price,
              image: product.thumbnail
                ? `http://localhost:8080/elec/${product.thumbnail.replace(
                    /\\/g,
                    '/'
                  )}`
                : 'assets/placeholder.jpg',
              badge,
              badgeColor,
              updatedAt,
              categories: product.categories || [],
              isActive: product.isActive ?? true,
              inStock: product.inStock ?? true,
              newFrom: product.newFrom || '',
              newTo: product.newTo || '',
              variants: product.variants || [],
              variations: product.variations || [],
            };
          });

          const currentDate = new Date();
          this.latestProducts = [...this.filteredProducts]
            .filter((p) => {
              const newFrom = p.newFrom ? new Date(p.newFrom) : null;
              const newTo = p.newTo ? new Date(p.newTo) : null;
              return (
                newFrom &&
                newTo &&
                !isNaN(newFrom.getTime()) &&
                !isNaN(newTo.getTime()) &&
                currentDate >= newFrom &&
                currentDate <= newTo
              );
            })
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .slice(0, 5);

          this.totalPages = pageResult?.totalPages ?? 0;
          this.totalElements = pageResult?.totalElements ?? 0;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.error = 'Không thể tải dữ liệu sản phẩm.';
          this.loading = false;
          this.filteredProducts = [];
          this.latestProducts = [];
          this.totalPages = 0;
          this.totalElements = 0;
          this.showToast('Lỗi khi tải sản phẩm. Vui lòng thử lại.');
          this.cd.detectChanges();
        },
      });
  }

  getSortField(): string {
    switch (this.sortBy) {
      case 'Latest':
        return 'updatedAt,desc';
      case 'Price Low to High':
        return 'minPrice,asc';
      case 'Price High to Low':
        return 'minPrice,desc';
      default:
        return '';
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  async addToCart(product: Product): Promise<void> {
    if (product.inStock === false) {
      this.showToast(`${product.name} hiện đã hết hàng`);
      return;
    }
    if (!product.quantity || product.quantity < 1) {
      product.quantity = 1;
    }
    if (product.variants && product.variants.length > 0 && !product.variantId) {
      this.showToast('Không tìm thấy biến thể sản phẩm');
      return;
    }
    const accessToken = this.auth.getAccessToken();
    if (!accessToken) {
      this.showLoginModal = true;
      return;
    }
    let isValid = await this.auth.isAccessTokenValid();
    if (!isValid) {
      const refreshed = await this.auth.refreshToken();
      if (!refreshed) {
        this.auth.logout();
        this.showLoginModal = true;
        return;
      }
      isValid = await this.auth.isAccessTokenValid();
      if (!isValid) {
        this.showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        this.auth.logout();
        this.showLoginModal = true;
        return;
      }
    }
    try {
      await this.cartService.addToCart(product);
      const productName = product.variantName
        ? `${product.name} ${product.variantName}`
        : product.name;
      this.showToast(`${productName} đã được thêm vào giỏ hàng`);
    } catch (err: any) {
      console.error('Lỗi API giỏ hàng:', err);
      if (
        err.status === 401 ||
        err.error?.message === 'Không tìm thấy người dùng.'
      ) {
        this.auth.logout();
        this.showLoginModal = true;
      } else {
        this.showToast('Lỗi khi thêm sản phẩm vào giỏ hàng');
      }
    }
    this.cd.detectChanges();
  }

  confirmLogin(): void {
    this.showLoginModal = false;
    this.router.navigate(['/login']);
    this.cd.detectChanges();
  }

  cancelLogin(): void {
    this.showLoginModal = false;
    this.cd.detectChanges();
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

  addToWishlist(product: Product): void {
    const productName = product.variantName
      ? `${product.name} ${product.variantName}`
      : product.name;
    console.log('Đã thêm vào danh sách yêu thích:', productName);
    this.showToast(`${productName} đã được thêm vào danh sách yêu thích`);
  }

  filterByCategory(categoryId: string): void {
    const params: any = {
      page: this.currentPage - 1,
      size: this.itemsPerPage,
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1],
      isActive: true,
      inStock: true,
    };

    if (this.searchKeyword) {
      params.keyword = this.searchKeyword;
    }

    if (this.sortBy !== 'Default') {
      params.sort = this.getSortField();
    }

    this.api
      .get('/products/search', { params, headers: { 'skip-auth': 'true' } })
      .subscribe({
        next: (res: any) => {
          const pageResult = res?.result;
          const rawProducts = pageResult?.content ?? [];

          this.filteredProducts = rawProducts
            .filter(
              (p: any) => p.categories && p.categories.includes(categoryId)
            )
            .map((product: any) => {
              let updatedAt = '';
              if (product.updatedAt) {
                const date = new Date(product.updatedAt);
                if (!isNaN(date.getTime())) {
                  updatedAt = date.toISOString();
                } else {
                  console.warn(
                    `Invalid updatedAt value for product ${product.id}:`,
                    product.updatedAt
                  );
                }
              }

              const firstVariant =
                product.variants && product.variants.length > 0
                  ? product.variants[0]
                  : {};
              const variantName = firstVariant.name || '';
              const variantId = firstVariant.id || null;
              const price = firstVariant.sellingPrice || product.minPrice || 0;

              const currentDate = new Date();
              const newFrom = product.newFrom
                ? new Date(product.newFrom)
                : null;
              const newTo = product.newTo ? new Date(product.newTo) : null;
              let badge = product.inStock === false ? 'Hết hàng' : undefined;
              let badgeColor = product.inStock === false ? 'danger' : 'success';
              if (
                !badge &&
                newFrom &&
                newTo &&
                !isNaN(newFrom.getTime()) &&
                !isNaN(newTo.getTime()) &&
                currentDate >= newFrom &&
                currentDate <= newTo
              ) {
                badge = 'Mới';
                badgeColor = 'success';
              }

              return {
                id: product.id || 0,
                name: product.name || 'Sản phẩm không xác định',
                minPrice: product.minPrice || 0,
                maxPrice: product.maxPrice || product.minPrice || 0,
                variantName,
                variantId,
                price,
                image: product.thumbnail
                  ? `http://localhost:8080/elec/${product.thumbnail.replace(
                      /\\/g,
                      '/'
                    )}`
                  : 'assets/placeholder.jpg',
                badge,
                badgeColor,
                updatedAt,
                categories: product.categories || [],
                isActive: product.isActive ?? true,
                inStock: product.inStock ?? true,
                newFrom: product.newFrom || '',
                newTo: product.newTo || '',
                variants: product.variants || [],
                variations: product.variations || [],
              };
            });

          const currentDate = new Date();
          this.latestProducts = [...this.filteredProducts]
            .filter((p) => {
              const newFrom = p.newFrom ? new Date(p.newFrom) : null;
              const newTo = p.newTo ? new Date(p.newTo) : null;
              return (
                newFrom &&
                newTo &&
                !isNaN(newFrom.getTime()) &&
                !isNaN(newTo.getTime()) &&
                currentDate >= newFrom &&
                currentDate <= newTo
              );
            })
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .slice(0, 5);

          this.totalPages = pageResult?.totalPages ?? 0;
          this.totalElements = pageResult?.totalElements ?? 0;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.showToast('Lỗi khi lọc theo danh mục. Vui lòng thử lại.');
          this.filteredProducts = [];
          this.latestProducts = [];
          this.totalPages = 0;
          this.totalElements = 0;
          this.cd.detectChanges();
        },
      });
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToProductDetail(id: number): void {
    this.router.navigate(['/product-detail', id]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
    this.showUserMenu = false;
  }
}
