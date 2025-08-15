import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from './product.service';
import { GenericTableComponent } from '../shared/components/generic-table/generic-table.component';
import { ApiService } from '../core/api/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent],
  templateUrl: './product.component.html',
  styleUrls: [],
})
export class ProductComponent implements OnInit {
  productColumns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Product Name' },
    { field: 'maxPrice', header: 'Price' },
    { field: 'status', header: 'Status' },
    { field: 'updatedAt', header: 'Updated' },
  ];

  products: Product[] = [];
  loading = true;
  error: string | null = null;

  // Quản lý selected IDs
  private _selectedProductIds: number[] = [];
  @Input()
  set selectedProductIds(value: number[]) {
    console.log('🔔 selectedProductIds updated:', value);
    this._selectedProductIds = value;
    this.cdr.detectChanges();
  }
  get selectedProductIds(): number[] {
    return this._selectedProductIds;
  }

  // Properties cho phân trang & tìm kiếm
  page = 0;
  size = 10;
  totalItems = 0;
  keyword = '';

  constructor(
    private productService: ProductService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.products = data;
        } else if (data && Array.isArray(data.result)) {
          this.products = data.result;
          this.totalItems = data.totalItems || data.result.length;
        } else {
          console.error('Dữ liệu không đúng định dạng:', data);
          this.products = [];
          this.error = 'Invalid data format received from server';
        }
        this.products = this.mapProductsWithNames(this.products);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to fetch products';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  searchProducts(): void {
    this.loadProducts();
  }

  onRowClick(product: Product) {
    this.router.navigate(['app-layout/edit-product', product.id]);
  }

  onCreate() {
    this.router.navigate(['/app-layout/app-create-products']);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.searchProducts();
  }

  onPageSizeChange(newSize: number) {
    console.log('📄 ProductsComponent: Page size changed to:', newSize);
    this.size = newSize;
    this.page = 0;
    this.searchProducts();
  }

  deleteSelectedProducts() {
    console.log(
      '🗑️ deleteSelectedProducts called with IDs:',
      this.selectedProductIds
    );
    const ids = [...this.selectedProductIds];

    if (ids.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để xóa.');
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc chắn muốn xóa ${ids.length} sản phẩm?`
    );
    if (!confirmed) return;

    this.api.post('/products/delete-many', ids).subscribe({
      next: () => {
        this.selectedProductIds = this.selectedProductIds.filter(
          (id) => !ids.includes(id)
        );
        this.searchProducts();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Xóa thất bại!');
      },
    });
  }

  private mapProductsWithNames(products: Product[]): Product[] {
    const serviceData = this.productService.getServiceData();
    const brands = serviceData.brands || [];
    const categories = serviceData.categories || [];

    return products.map((product) => {
      product.brandName =
        product.brandId && brands.length > 0
          ? brands.find((b) => b.id === product.brandId)?.name ||
            'Unknown Brand'
          : 'Unknown Brand';

      product.categoryName =
        product.categoryId && categories.length > 0
          ? categories.find((c) => c.id === product.categoryId)?.name ||
            'Unknown Category'
          : 'Unknown Category';

      product.status = product.isActive ? 'Active' : 'Inactive';

      product.maxPrice =
        Array.isArray(product.variants) && product.variants.length > 0
          ? Math.max(...product.variants.map((v) => v.price || 0))
          : 0;

      return product;
    });
  }
}
