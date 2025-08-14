import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api/api.service';
import { AuthService } from '../core/auth/auth.service';
import { GenericTableComponent } from '../shared/components/generic-table/generic-table.component';
import { Router } from '@angular/router';

interface ColumnConfig {
  field: string;
  header: string;
  type?: string;
}

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericTableComponent],
  templateUrl: './variation.component.html',
})
export class VariationsComponent implements OnInit {
  variationColumns: ColumnConfig[] = [
    { field: 'select', header: '', type: 'checkbox' },
    { field: 'name', header: 'Tên Biến thể' },
    { field: 'type', header: 'Kiểu' },
    { field: 'isGlobal', header: 'Toàn cục' },
    { field: 'variationValues', header: 'Giá trị' },
    { field: 'updated', header: 'Cập nhật' },
  ];

  variations: any[] = [];
  private _selectedVariationIds: number[] = [];

  @Input()
  set selectedVariationIds(value: number[]) {
    console.log('🔔 selectedVariationIds updated:', value);
    this._selectedVariationIds = value;
    this.cd.detectChanges();
  }

  get selectedVariationIds(): number[] {
    return this._selectedVariationIds;
  }

  loading = true;
  error = '';
  page = 0;
  size = 10;
  totalItems = 0;
  keyword = '';
  isGlobal: boolean | null = null;

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
    this.searchVariations();
  }

  searchVariations() {
    this.loading = true;

    const params: any = {
      page: this.page,
      size: this.size,
      keyword: this.keyword,
    };

    if (this.isGlobal !== null) {
      params.isGlobal = this.isGlobal;
    }

    console.log('🔍 API request params:', params);

    this.api.get('/variations/search', { params }).subscribe({
      next: (res: any) => {
        const pageResult = res?.result;
        const rawVariations = pageResult?.content ?? [];

        this.variations = rawVariations.map((v: any) => ({
          id: v.id,
          name: v.name,
          type: v.type,
          isGlobal: v.isGlobal ? 'Có' : 'Không',
          variationValues: v.variationValues
            .map((val: any) => val.label)
            .join(', '),
          updated: new Date(v.updatedAt).toLocaleString('vi-VN'),
        }));

        this.totalItems = pageResult?.totalElements ?? 0;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Không thể tải dữ liệu biến thể.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.searchVariations();
  }

  onPageSizeChange(newSize: number) {
    console.log('📄 VariationsComponent: Page size changed to:', newSize);
    this.size = newSize;
    this.page = 0; // Reset to first page
    this.searchVariations();
  }

  deleteSelectedVariations() {
    console.log(
      '🗑️ deleteSelectedVariations called with IDs:',
      this.selectedVariationIds
    );
    const ids = [...this.selectedVariationIds];

    if (ids.length === 0) {
      alert('Vui lòng chọn ít nhất một biến thể để xóa.');
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc chắn muốn xóa ${ids.length} biến thể?`
    );
    if (!confirmed) return;

    this.api.post('/variations/delete-many', ids).subscribe({
      next: () => {
        this.selectedVariationIds = this.selectedVariationIds.filter(
          (id) => !ids.includes(id)
        );
        this.searchVariations();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Xóa thất bại!');
      },
    });
  }

  onCreate() {
    this.router.navigate(['/app-layout/create_variation']);
  }

  onVariationRowClick(brand: any) {
    this.router.navigate(['/app-layout/create_variation'], {
      queryParams: { id: brand.id },
    });
  }
}
