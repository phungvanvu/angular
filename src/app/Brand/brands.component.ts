import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api/api.service';
import { AuthService } from '../core/auth/auth.service';
import { GenericTableComponent } from '../shared/components/generic-table/generic-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericTableComponent],
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  brandColumns = [
    { field: 'select', header: '', type: 'checkbox' },
    {
      field: 'thumbnail',
      header: 'Logo',
      type: 'image',
    },
    { field: 'name', header: 'Tên thương hiệu' },
    { field: 'created', header: 'Ngày tạo' },
    { field: 'status', header: 'Trạng thái' },
  ];

  brands: any[] = [];
  private _selectedBrandIds: number[] = [];

  @Input()
  set selectedBrandIds(value: number[]) {
    console.log('🔔 selectedBrandIds updated:', value);
    this._selectedBrandIds = value;
    this.cd.detectChanges();
  }

  get selectedBrandIds(): number[] {
    return this._selectedBrandIds;
  }

  loading = true;
  error = '';
  page = 0;
  size = 10;
  totalItems = 0;
  keyword = '';
  isActive: boolean | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    const valid = await this.auth.isAccessTokenValid();
    if (!valid) {
      this.error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      this.loading = false;
      this.cd.detectChanges();
      return;
    }
    this.searchBrands();
  }

  searchBrands() {
    this.loading = true;

    const params: any = {
      page: this.page,
      size: this.size,
      keyword: this.keyword,
    };

    if (this.isActive !== null) {
      params.isActive = this.isActive;
    }

    console.log('🔍 API request params:', params); // Debug API params

    this.api.get('/brands/search', { params }).subscribe({
      next: (res: any) => {
        const pageResult = res?.result;
        const rawBrands = pageResult?.content ?? [];

        this.brands = rawBrands.map((b: any) => ({
          id: b.id,
          thumbnail: b.fileLogo
            ? `http://localhost:8080/elec/${b.fileLogo.replace(/\\/g, '/')}`
            : 'assets/default-logo.png', // hoặc để rỗng nếu không có logo
          name: b.name,
          created: new Date(b.createdAt).toLocaleString('vi-VN'),
          status: b.isActive ? 'Hiển thị' : 'Ẩn',
        }));

        this.totalItems = pageResult?.totalElements ?? 0;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Không thể tải dữ liệu thương hiệu.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.searchBrands();
  }

  onPageSizeChange(newSize: number) {
    console.log('📄 BrandsComponent: Page size changed to:', newSize);
    this.size = newSize;
    this.page = 0; // Reset to first page
    this.searchBrands();
  }

  deleteSelectedBrands() {
    console.log(
      '🗑️ deleteSelectedBrands called with IDs:',
      this.selectedBrandIds
    );
    const ids = [...this.selectedBrandIds];

    if (ids.length === 0) {
      alert('Vui lòng chọn ít nhất một thương hiệu để xóa.');
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc chắn muốn xóa ${ids.length} thương hiệu?`
    );
    if (!confirmed) return;

    this.api.post('/brands/delete-many', ids).subscribe({
      next: () => {
        this.selectedBrandIds = this.selectedBrandIds.filter(
          (id) => !ids.includes(id)
        );
        this.searchBrands();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Xóa thất bại!');
      },
    });
  }

  onSearch() {
    this.page = 0;
    this.searchBrands();
  }

  onCreate() {
    this.router.navigate(['/app-layout/app-create-brands']);
  }

  onBrandRowClick(brand: any) {
    this.router.navigate(['/app-layout/app-create-brands'], {
      queryParams: { id: brand.id },
    });
  }
}
