import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

interface VariationValue {
  label: string;
  value?: string;
  color?: string;
}

@Component({
  selector: 'app-create-variation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create_variation.component.html',
  styleUrls: ['./create_variation.component.css'],
})
export class CreateVariationComponent implements OnInit {
  variationName = '';
  variationType = '';
  isGlobal = true;
  values: VariationValue[] = [];
  error = '';
  success = '';
  variationId: number | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetValues();
  }

  async ngOnInit() {
    const valid = await this.auth.isAccessTokenValid();
    if (!valid) {
      this.error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      this.cd.detectChanges();
      return;
    }

    // Lấy id từ query params
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.variationId = +params['id'];
        this.loadVariationDetail(this.variationId);
      }
    });
  }

  // Hàm load dữ liệu khi update
  loadVariationDetail(id: number) {
    this.api.get(`/variations/${id}`).subscribe({
      next: (res: any) => {
        const data = res.result;
        this.variationName = data.name;
        this.variationType = data.type === 'color' ? 'Color' : 'Text';
        this.isGlobal = data.isGlobal;
        this.values = data.variationValues.map((v: any) => ({
          label: v.label,
          value: v.value,
          color: data.type === 'color' ? v.value : undefined,
        }));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load variation detail', err);
        this.error = 'Không thể tải thông tin biến thể.';
        this.cd.detectChanges();
      },
    });
  }

  onTypeChange() {
    this.resetValues();
    this.cd.detectChanges();
  }

  resetValues() {
    if (this.variationType === 'Text') {
      this.values = [{ label: '', value: '' }];
    } else if (this.variationType === 'Color') {
      this.values = [{ label: '', value: '#000000', color: '#000000' }];
    } else {
      this.values = [];
    }
  }

  addRow() {
    if (this.variationType === 'Text') {
      this.values.push({ label: '', value: '' });
    } else if (this.variationType === 'Color') {
      this.values.push({ label: '', value: '#000000', color: '#000000' });
    }
    this.cd.detectChanges();
  }

  removeRow(index: number) {
    this.values.splice(index, 1);
    this.cd.detectChanges();
  }

  updateValueField(index: number) {
    const value = this.values[index];
    if (this.variationType === 'Text') {
      value.value = value.label.trim().toLowerCase();
    } else if (this.variationType === 'Color') {
      value.value = value.color || '#000000';
      value.color = value.color || '#000000';
    }
  }

  save() {
    this.error = '';
    this.success = '';

    // Validation
    if (!this.variationName.trim()) {
      this.error = 'Vui lòng nhập tên biến thể.';
      this.cd.detectChanges();
      return;
    }

    if (!this.variationType) {
      this.error = 'Vui lòng chọn kiểu biến thể.';
      this.cd.detectChanges();
      return;
    }

    if (this.values.length === 0) {
      this.error = 'Vui lòng thêm ít nhất một giá trị biến thể.';
      this.cd.detectChanges();
      return;
    }

    for (const value of this.values) {
      if (!value.label.trim()) {
        this.error = 'Tất cả các nhãn giá trị phải được điền.';
        this.cd.detectChanges();
        return;
      }
      if (this.variationType === 'Color' && !value.color) {
        this.error = 'Tất cả các màu phải được chọn.';
        this.cd.detectChanges();
        return;
      }
    }

    const payload = {
      name: this.variationName.trim(),
      type: this.variationType === 'Text' ? 'Text' : 'Color',
      isGlobal: this.isGlobal,
      variationValues: this.values.map((value) => ({
        label: value.label.trim(),
        value:
          this.variationType === 'Text'
            ? value.value || value.label.trim().toLowerCase()
            : value.color,
      })),
    };

    console.log('Sending payload:', payload);

    if (this.variationId) {
      this.api.put(`/variations/${this.variationId}`, payload).subscribe({
        next: () => {
          alert('Cập nhật biến thể thành công!');
          this.router.navigateByUrl('app-layout/variations');
        },
        error: (err) => {
          console.error('API error:', err);
          alert('Cập nhật biến thể thất bại. Vui lòng thử lại.');
        },
      });
    } else {
      this.api.post('/variations', payload).subscribe({
        next: () => {
          alert('Tạo biến thể thành công!');
          this.router.navigateByUrl('app-layout/variations');
        },
        error: (err) => {
          console.error('API error:', err);
          alert('Tạo biến thể thất bại. Vui lòng thử lại.');
        },
      });
    }
  }

  resetForm() {
    this.variationName = '';
    this.variationType = '';
    this.isGlobal = true;
    this.values = [];
    this.resetValues();
    this.cd.detectChanges();
  }
}
