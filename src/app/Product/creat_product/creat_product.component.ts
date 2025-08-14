import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { FindVariationPipe } from './find-variation.pipe';

interface Variation {
  id: number;
  name: string;
  type: string;
  isGlobal: boolean;
  variationValues: { id: number; label: string; value: string }[];
  updatedAt: string;
}

interface Variant {
  sku: string;
  price: number;
  specialPrice?: number;
  specialPriceType?: number; // 1 for fixed, 2 for percent
  specialPriceStart?: string;
  specialPriceEnd?: string;
  sellingPrice?: number;
  manageStock: boolean;
  qty: number;
  inStock: boolean;
  isActive: boolean;
  variationValues: { variationId: number; valueId: number }[];
}

interface Product {
  name: string;
  thumbnail: string;
  brandId: number;
  description: string;
  shortDescription: string;
  sku: string;
  manageStock: boolean;
  qty: number;
  inStock: boolean;
  isActive: boolean;
  newFrom?: string;
  newTo?: string;
  categoryIds: number[] | null;
  variationIds: number[];
  variants: Variant[];
  price?: number;
  specialPrice?: number;
  specialPriceType?: number;
  specialPriceStart?: string;
  specialPriceEnd?: string;
}

@Component({
  selector: 'creat_product',
  standalone: true,
  templateUrl: './creat_product.component.html',
  styleUrls: ['./creat_product.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    EditorModule,
    HttpClientModule,
    FindVariationPipe,
  ],
})
export class CreatProductComponent implements OnInit {
  status: boolean = true;
  imagePreview: string | ArrayBuffer | null = null;
  variations: Variation[] = [];
  selectedVariations: { id: number; values: number[] }[] = [];
  variants: Variant[] = [];
  errorMessage: string | null = null; // Hiển thị lỗi trong giao diện
  product: Product = {
    name: '',
    thumbnail: '',
    brandId: 0,
    description: '',
    shortDescription: '',
    sku: '',
    manageStock: true,
    qty: 0,
    inStock: true,
    isActive: true,
    newFrom: '',
    newTo: '',
    categoryIds: null,
    variationIds: [],
    variants: [],
    price: 0,
    specialPrice: undefined,
    specialPriceType: 1,
    specialPriceStart: '',
    specialPriceEnd: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Kiểm tra vai trò admin và accessToken
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      this.errorMessage = 'Bạn cần đăng nhập với vai trò ADMIN để truy cập.';
      this.router.navigate(['/login']);
      return;
    }

    // Tạo header với accessToken
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    // Gọi API lấy variations
    this.http
      .get<{ code: number; message: string; result: Variation[] }>(
        'http://localhost:8080/elec/api/v1/variations',
        { headers }
      )
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.variations = response.result || [];
          } else {
            this.errorMessage =
              response.message || 'Lỗi khi lấy danh sách variations.';
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy variations:', err);
          if (err.status === 401) {
            this.errorMessage =
              'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
            this.router.navigate(['/login']);
          } else {
            this.errorMessage =
              'Lỗi khi lấy variations: ' + (err.error?.message || err.message);
          }
        },
      });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.product.thumbnail = file.name; // Lưu tên file hoặc upload lên server
      };
      reader.readAsDataURL(file);
    }
  }

  onVariationChange(variationId: number, valueIds: number[]) {
    const existing = this.selectedVariations.find((v) => v.id === variationId);
    if (existing) {
      existing.values = valueIds;
    } else {
      this.selectedVariations.push({ id: variationId, values: valueIds });
    }
    this.generateVariants();
  }

  generateVariants() {
    this.variants = [];
    this.product.variationIds = this.selectedVariations
      .map((v) => v.id)
      .filter((id) => id !== 0);

    const validVariations = this.selectedVariations.filter((v) => v.id !== 0);
    const combinations = this.cartesianProduct(
      validVariations.map((v) => v.values)
    );

    combinations.forEach((combo) => {
      const variant: Variant = {
        sku: `${this.product.sku || 'PRODUCT'}-${combo
          .map((valueId, i) => {
            const variation = this.variations.find(
              (v) => v.id === validVariations[i].id
            );
            const value = variation?.variationValues.find(
              (val) => val.id === valueId
            );
            return value?.value.toUpperCase() || '';
          })
          .join('-')}`,
        price: this.product.price || 0,
        manageStock: true,
        qty: 0,
        inStock: true,
        isActive: true,
        variationValues: combo.map((valueId, i) => ({
          variationId: validVariations[i].id,
          valueId,
        })),
      };
      this.variants.push(variant);
    });

    this.product.variants = this.variants;
  }

  cartesianProduct(arr: number[][]): number[][] {
    return arr.reduce((a, b) => a.flatMap((x) => b.map((y) => [...x, y])), [
      [],
    ] as number[][]);
  }

  addVariation() {
    this.selectedVariations.push({ id: 0, values: [] });
  }

  removeVariation(index: number) {
    this.selectedVariations.splice(index, 1);
    this.generateVariants();
  }

  submitProduct() {
    // Kiểm tra vai trò admin và accessToken
    const adminRole = localStorage.getItem('app.admin.role');
    const accessToken = localStorage.getItem('accessToken');

    if (adminRole !== 'ADMIN' || !accessToken) {
      this.errorMessage =
        'Bạn cần đăng nhập với vai trò ADMIN để tạo sản phẩm.';
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    this.product.variants = this.variants.map((variant) => ({
      ...variant,
      sellingPrice:
        variant.specialPriceType === 2 && variant.specialPrice
          ? variant.price * (1 - variant.specialPrice / 100)
          : variant.specialPrice || variant.price,
    }));

    console.log('Gửi sản phẩm:', this.product);
    this.http
      .post('http://localhost:8080/elec/api/v1/products', this.product, {
        headers,
      })
      .subscribe({
        next: (response) => {
          console.log('Tạo sản phẩm thành công:', response);
          this.errorMessage = null;
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Lỗi khi tạo sản phẩm:', err);
          if (err.status === 401) {
            this.errorMessage =
              'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
            this.router.navigate(['/login']);
          } else {
            this.errorMessage =
              'Lỗi khi tạo sản phẩm: ' + (err.error?.message || err.message);
          }
        },
      });
  }
}
