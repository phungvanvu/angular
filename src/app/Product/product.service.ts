// product.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError } from 'rxjs/operators';

export interface OptionValue {
  label: string;
  color?: string;
  value?: string;
  id?: number;
}

export interface Variation {
  id?: number;
  name: string;
  type: 'Text' | 'Color' | '';
  values: OptionValue[];
  isGlobal?: boolean;
  updatedAt?: string;
}

export interface Variant {
  name: string;
  sku: string;
  price: number;
  specialPrice?: number;
  specialPriceType?: number;
  specialPriceStart?: string | null;
  specialPriceEnd?: string | null;
  inventoryManagement: "Don't Track Inventory" | 'Track Inventory';
  stockAvailability: 'In Stock' | 'Out of Stock';
  qty: number;
  isDefault: boolean;
  variationValues?: OptionValue[];
  sellingPrice?: number;
  manageStock?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  imagePreview?: string | null;
  imageFileId?: number | null;
}

export interface ApiProductResponse {
  code: number;
  message: string;
  result: Product[];
}

export interface VariationTemplate {
  id: number;
  name: string;
  type: 'Text' | 'Color';
  values: OptionValue[];
}

export interface Product {
  id?: string;
  name: string;
  thumbnail?: string | null;
  brandId?: number | null;
  description?: string | null;
  shortDescription?: string | null;
  sku?: string | null;
  manageStock?: boolean | null;
  qty?: number | null;
  inStock?: boolean | null;
  isActive?: boolean | null;
  newFrom?: string | null;
  newTo?: string | null;
  categoryId?: number | null;
  categoryIds?: number[] | null;
  variationIds?: number[] | null;
  variations?: Variation[] | null;
  variants?: Variant[] | null;
  brandName?: string | null;
  categoryName?: string | null;
  status?: string | null;
  maxPrice?: number | null;
  updatedAt?: string | null;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductInput {
  newTo: string | null;
  newFrom: string | null;
  name: string;
  description: string;
  brandId: number | null;
  categoryId: number | null;
  sku?: string | null;
  variationIds?: number[] | null;
  variants?: Variant[];
  thumbnail?: string | null;
}

export interface ServiceData {
  brands: Brand[];
  categories: Category[];
  variationTemplates: VariationTemplate[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl =
    'https://electacme-production-app-0b1dc16f2bb0.herokuapp.com/elec/api/v1';
  private dataSubject = new BehaviorSubject<ServiceData>({
    brands: [],
    categories: [],
    variationTemplates: [],
  });
  data$ = this.dataSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.loadInitialData().subscribe();
  }

  public loadInitialData(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return forkJoin([
        this.getBrands(),
        this.getCategories(),
        this.getVariationTemplates(),
      ]).pipe(
        map(([brands, categories, variationTemplates]) => {
          this.dataSubject.next({ brands, categories, variationTemplates });
          return { brands, categories, variationTemplates };
        }),
        catchError((error) => {
          console.error('Error loading initial data:', error);
          return throwError(() => error);
        })
      );
    }
    return new Observable();
  }

  getServiceData(): ServiceData {
    return this.dataSubject.getValue();
  }

  getProducts(): Observable<Product[]> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for getProducts:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }

    return this.http.get<any>(`${this.baseUrl}/products`, { headers }).pipe(
      map((response) => {
        console.log('Raw API response:', response);
        let products: Product[] = [];
        if (Array.isArray(response)) {
          products = response;
        } else if (response && Array.isArray(response.result)) {
          products = response.result;
        } else {
          console.error('Invalid API response format:', response);
          return [];
        }

        const serviceData = this.getServiceData();
        const brands = serviceData.brands || [];
        const categories = serviceData.categories || [];

        return products.map((item: any) => ({
          id: item.id || '',
          name: item.name || '',
          isActive: item.isActive !== undefined ? item.isActive : true,
          thumbnail: item.thumbnail || null,
          brandId:
            item.brandId ??
            (typeof item.brand === 'string'
              ? brands.find((b) => b.name === item.brand)?.id ?? null
              : null),
          description: item.description || null,
          shortDescription: item.shortDescription || null,
          sku: item.sku || null,
          manageStock: item.manageStock !== undefined ? item.manageStock : true,
          qty: item.qty || 0,
          inStock: item.inStock !== undefined ? item.inStock : true,
          newFrom: item.newFrom || null,
          newTo: item.newTo || null,
          categoryId:
            item.categoryId ??
            (Array.isArray(item.categories) && item.categories.length > 0
              ? categories.find((c) => c.name === item.categories[0])?.id ??
                null
              : null),
          categoryIds: Array.isArray(item.categoryIds) ? item.categoryIds : [],
          variationIds: Array.isArray(item.variationIds)
            ? item.variationIds
            : [],
          variations: Array.isArray(item.variations)
            ? item.variations.map((v: any) => ({
                id: v.id || undefined,
                name: v.name || '',
                type: v.type || '',
                values: Array.isArray(v.variationValues)
                  ? v.variationValues.map((val: any) => ({
                      id: val.id || undefined,
                      label: val.label || '',
                      value: val.value || val.label,
                      color:
                        v.type === 'Color' ? val.color || undefined : undefined,
                    }))
                  : [],
                isGlobal: v.isGlobal ?? undefined,
                updatedAt: v.updatedAt || undefined,
              }))
            : [],
          variants: Array.isArray(item.variants)
            ? item.variants.map((v: any) => ({
                name: v.name || '',
                sku: v.sku || '',
                price: v.price || 0,
                specialPrice: v.specialPrice ?? undefined,
                specialPriceType: v.specialPriceType ?? 1,
                specialPriceStart: v.specialPriceStart || null,
                specialPriceEnd: v.specialPriceEnd || null,
                inventoryManagement:
                  v.inventoryManagement || "Don't Track Inventory",
                stockAvailability: v.stockAvailability || 'In Stock',
                qty: v.qty || 0,
                isDefault: v.isDefault ?? false,
                variationValues: Array.isArray(v.variationValues)
                  ? v.variationValues.map((val: any) => ({
                      id: val.id || undefined,
                      label: val.label || '',
                      value: val.value || val.label,
                      color:
                        v.type === 'Color' ? val.color || undefined : undefined,
                    }))
                  : [],
                sellingPrice:
                  v.sellingPrice ?? (v.specialPrice || v.price || 0),
                manageStock: v.manageStock ?? true,
                inStock: v.inStock ?? true,
                isActive: v.isActive ?? true,
                imagePreview: v.imagePreview ?? null,
              }))
            : [],
          status: item.isActive ? 'Active' : 'Inactive',
          maxPrice:
            Array.isArray(item.variants) && item.variants.length > 0
              ? Math.max(...item.variants.map((v: any) => v.price || 0))
              : item.maxPrice || 0,
          updatedAt: item.updatedAt || null,
        }));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for getProductById:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }

    return this.http
      .get<any>(`${this.baseUrl}/products/${id}`, { headers })
      .pipe(
        map((response) => {
          console.log(
            'Raw API response for product:',
            JSON.stringify(response, null, 2)
          );
          const item: any = Array.isArray(response)
            ? response[0]
            : response.result || response;
          const serviceData = this.getServiceData();
          const brands = serviceData.brands || [];
          const categories = serviceData.categories || [];

          return {
            id: item.id || '',
            name: item.name || '',
            isActive: item.isActive !== undefined ? item.isActive : true,
            thumbnail: item.thumbnail || null,
            brandId:
              item.brandId ??
              (typeof item.brand === 'string'
                ? brands.find((b) => b.name === item.brand)?.id ?? null
                : null),
            description: item.description || null,
            shortDescription: item.shortDescription || null,
            sku: item.sku || null,
            manageStock:
              item.manageStock !== undefined ? item.manageStock : true,
            qty: item.qty || 0,
            inStock: item.inStock !== undefined ? item.inStock : true,
            newFrom: item.newFrom || null,
            newTo: item.newTo || null,
            categoryId:
              item.categoryId ??
              (Array.isArray(item.categories) && item.categories.length > 0
                ? categories.find((c) => c.name === item.categories[0])?.id ??
                  null
                : null),
            categoryIds: Array.isArray(item.categoryIds)
              ? item.categoryIds
              : [],
            variationIds: Array.isArray(item.variationIds)
              ? item.variationIds
              : [],
            variations: Array.isArray(item.variations)
              ? item.variations.map((v: any) => ({
                  id: v.id || undefined,
                  name: v.name || '',
                  type: v.type || '',
                  values: Array.isArray(v.variationValues)
                    ? v.variationValues.map((val: any) => ({
                        id: val.id || undefined,
                        label: val.label || '',
                        value: val.value || val.label,
                        color:
                          v.type === 'Color'
                            ? val.color || undefined
                            : undefined,
                      }))
                    : [],
                  isGlobal: v.isGlobal ?? undefined,
                  updatedAt: v.updatedAt || undefined,
                }))
              : [],
            variants: Array.isArray(item.variants)
              ? item.variants.map((v: any) => ({
                  name: v.name || '',
                  sku: v.sku || '',
                  price: v.price || 0,
                  specialPrice: v.specialPrice ?? undefined,
                  specialPriceType: v.specialPriceType ?? 1,
                  specialPriceStart: v.specialPriceStart || null,
                  specialPriceEnd: v.specialPriceEnd || null,
                  inventoryManagement:
                    v.inventoryManagement || "Don't Track Inventory",
                  stockAvailability: v.stockAvailability || 'In Stock',
                  qty: v.qty || 0,
                  isDefault: v.isDefault ?? false,
                  variationValues: Array.isArray(v.variationValues)
                    ? v.variationValues.map((val: any) => ({
                        id: val.id || undefined,
                        label: val.label || '',
                        value: val.value || val.label,
                        color:
                          v.type === 'Color'
                            ? val.color || undefined
                            : undefined,
                      }))
                    : [],
                  sellingPrice:
                    v.sellingPrice ?? (v.specialPrice || v.price || 0),
                  manageStock: v.manageStock ?? true,
                  inStock: v.inStock ?? true,
                  isActive: v.isActive ?? true,
                  imagePreview: v.imagePreview ?? null,
                }))
              : [],
            status: item.isActive ? 'Active' : 'Inactive',
            maxPrice:
              Array.isArray(item.variants) && item.variants.length > 0
                ? Math.max(...item.variants.map((v: any) => v.price || 0))
                : item.maxPrice || 0,
            updatedAt: item.updatedAt || null,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching product by ID:', error);
          return throwError(() => error);
        })
      );
  }

  getEntityFiles(entityType: string, entityId: string): Observable<any[]> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for getEntityFiles:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }

    return this.http
      .get<any[]>(
        `${this.baseUrl}/entity-files?entityType=${entityType}&entityId=${entityId}`,
        { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching entity files:', error);
          return throwError(() => error);
        })
      );
  }

  postEntityFile(fileData: {
    fileId: number;
    entityId: number;
    entityType: string;
    zone: string;
  }): Observable<any> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for postEntityFile:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }
    headers = headers.set('Content-Type', 'application/json');

    return this.http
      .post(`${this.baseUrl}/entity-files`, fileData, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error posting entity file:', error);
          return throwError(() => error);
        })
      );
  }

  createProduct(input: ProductInput): Observable<Product> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for createProduct:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }
    headers = headers.set('Content-Type', 'application/json');

    console.log('Sending product data:', JSON.stringify(input, null, 2));
    const newProduct: any = {
      name: input.name,
      description: input.description,
      thumbnail: input.thumbnail || 'aothun.png',
      brandId: input.brandId || null,
      shortDescription: this.generateShortDescription(input.description),
      sku: input.sku || null,
      manageStock: input.variants?.some((v) => v.manageStock) || true,
      qty: input.variants?.reduce((sum, v) => sum + (v.qty || 0), 0) || 100,
      inStock: input.variants?.some((v) => v.inStock) || true,
      isActive: input.variants?.every((v) => v.isActive) ?? true,
      newFrom: input.newFrom || '2025-07-20T00:00:00',
      newTo: input.newTo || '2025-08-20T00:00:00',
      categoryIds: input.categoryId ? [input.categoryId] : null,
      variationIds: input.variationIds || [],
      variants: Array.isArray(input.variants)
        ? input.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            specialPrice: v.specialPrice,
            specialPriceType: v.specialPriceType,
            specialPriceStart: v.specialPriceStart
              ? `${v.specialPriceStart}+07:00`
              : null,
            specialPriceEnd: v.specialPriceEnd
              ? `${v.specialPriceEnd}+07:00`
              : null,
            sellingPrice: v.sellingPrice,
            manageStock: v.manageStock,
            qty: v.qty,
            inStock: v.inStock,
            isActive: v.isActive,
            isDefault: v.isDefault,
            variationValues: Array.isArray(v.variationValues)
              ? v.variationValues.map((val) => ({
                  label: val.label,
                  value: val.value || val.label,
                  color: val.color,
                }))
              : [],
          }))
        : [],
    };

    console.log(
      'Sending API payload for createProduct:',
      JSON.stringify(newProduct, null, 2)
    );
    return this.http
      .post<Product>(`${this.baseUrl}/products`, newProduct, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error creating product:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          return throwError(() => error);
        })
      );
  }

  updateProduct(id: string, input: ProductInput): Observable<Product> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for updateProduct:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }
    headers = headers.set('Content-Type', 'application/json');

    console.log('Updating product data:', JSON.stringify(input, null, 2));
    const updatedProduct: any = {
      id,
      name: input.name,
      description: input.description,
      thumbnail: input.thumbnail || 'aothun.png',
      brandId: input.brandId || null,
      shortDescription: this.generateShortDescription(input.description),
      sku: input.sku || null,
      manageStock: input.variants?.some((v) => v.manageStock) || true,
      qty: input.variants?.reduce((sum, v) => sum + (v.qty || 0), 0) || 100,
      inStock: input.variants?.some((v) => v.inStock) || true,
      isActive: input.variants?.every((v) => v.isActive) ?? true,
      newFrom: input.newFrom || '2025-07-20T00:00:00',
      newTo: input.newTo || '2025-08-20T00:00:00',
      categoryIds: input.categoryId ? [input.categoryId] : null,
      variationIds: input.variationIds || [],
      variants: Array.isArray(input.variants)
        ? input.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            specialPrice: v.specialPrice,
            specialPriceType: v.specialPriceType,
            specialPriceStart: v.specialPriceStart
              ? `${v.specialPriceStart}+07:00`
              : null,
            specialPriceEnd: v.specialPriceEnd
              ? `${v.specialPriceEnd}+07:00`
              : null,
            sellingPrice: v.sellingPrice,
            manageStock: v.manageStock,
            qty: v.qty,
            inStock: v.inStock,
            isActive: v.isActive,
            isDefault: v.isDefault,
            variationValues: Array.isArray(v.variationValues)
              ? v.variationValues.map((val) => ({
                  label: val.label,
                  value: val.value || val.label,
                  color: val.color,
                }))
              : [],
          }))
        : [],
    };

    console.log(
      'Sending API payload for updateProduct:',
      JSON.stringify(updatedProduct, null, 2)
    );
    return this.http
      .put<Product>(`${this.baseUrl}/products/${id}`, updatedProduct, {
        headers,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating product:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          return throwError(() => error);
        })
      );
  }

  getBrands(): Observable<Brand[]> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for getBrands:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }

    return this.http.get<any>(`${this.baseUrl}/brands`, { headers }).pipe(
      map((response) => {
        console.log('Raw API response for brands:', response);
        if (response && Array.isArray(response.result)) {
          return response.result.map((item: { id: any; name: any }) => ({
            id: item.id || 0,
            name: item.name || '',
          }));
        }
        return [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching brands:', error);
        return throwError(() => error);
      })
    );
  }

  getCategories(): Observable<Category[]> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for getCategories:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }

    return this.http.get<any>(`${this.baseUrl}/categories`, { headers }).pipe(
      map((response) => {
        console.log('Raw API response for categories:', response);
        if (response && Array.isArray(response.result)) {
          return response.result.map((item: { id: any; name: any }) => ({
            id: item.id || 0,
            name: item.name || '',
          }));
        }
        return [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }

  getVariationTemplates(): Observable<VariationTemplate[]> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token for getVariationTemplates:', token);
    }

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No access token found, request may fail with 401');
    }

    return this.http.get<any>(`${this.baseUrl}/variations`, { headers }).pipe(
      map((response) => {
        console.log('Raw API response for variation templates:', response);
        if (response && Array.isArray(response.result)) {
          return response.result.map(
            (item: {
              id: any;
              name: any;
              type: any;
              variationValues: any;
            }) => ({
              id: item.id || 0,
              name: item.name || '',
              type: item.type || '',
              values: Array.isArray(item.variationValues)
                ? item.variationValues.map((val: any) => ({
                    id: val.id || undefined,
                    label: val.label || '',
                    value: val.value || val.label,
                    color:
                      item.type === 'Color'
                        ? val.color || undefined
                        : undefined,
                  }))
                : [],
            })
          );
        }
        return [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching variation templates:', error);
        return throwError(() => error);
      })
    );
  }

  private generateShortDescription(description: string): string {
    const plainText = description.replace(/<[^>]+>/g, '');
    return plainText.length > 50
      ? plainText.substring(0, 50) + '...'
      : plainText;
  }
}
