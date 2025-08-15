import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HttpClientModule } from '@angular/common/http';
import { VariantComponent } from '../Variant/variant.component';
import { CreateImageComponent } from '../../admin/components/upload/create_image.component';
import {
  ProductService,
  Product,
  ProductInput,
  Brand,
  Category,
  Variation,
  Variant,
  VariationTemplate,
  ServiceData,
  OptionValue,
} from '../product.service';
import { NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';

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
    VariantComponent,
    CreateImageComponent,
  ],
})
export class CreatProductComponent implements OnInit {
  name: string = '';
  htmlContent: string = '';
  brandId: number | null = null;
  categoryId: number | null = null;
  taxClass: string = '';
  tags: string[] = [];
  isActive: boolean = true;
  price: number = 0;
  specialPrice: number = 0;
  specialPriceType: number = 1;
  specialPriceStart: string | null = null;
  specialPriceEnd: string | null = null;
  sku: string = '';
  inventoryManagement: "Don't Track Inventory" | 'Track Inventory' =
    'Track Inventory';
  stockAvailability: 'In Stock' | 'Out of Stock' = 'In Stock';
  qty: number = 0;
  shortDescription: string = '';
  newFrom: string = '';
  newTo: string = '';
  thumbnail: string = '';
  thumbnailPreview: string | null = null;
  thumbnailFileId: number | null = null;
  galleryPreviews: { fileId: number; url: string }[] = [];
  showFileManager: boolean = false;
  selectedZone: 'thumbnail' | 'gallery' | null = null;
  variations: Variation[] = [];
  variants: Variant[] = [];
  defaultVariantName: string = '';
  selectedTemplateId: number | null = null;
  variationTemplates: VariationTemplate[] = [];
  selectedVariationIds: number[] = [];
  showVariantsSection: boolean = false;
  brands: Brand[] = [];
  categories: Category[] = [];
  taxClasses: string[] = ['Tax 1', 'Tax 2'];
  tagOptions: string[] = ['Tag1', 'Tag2'];
  isEditMode: boolean = false;
  editProductId: number | null = null;

  @ViewChild('productForm') productForm!: NgForm;

  get managed(): boolean {
    return this.variations.length > 0;
  }

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.productService.loadInitialData().subscribe({
        next: () => {
          this.productService.data$.subscribe((data: ServiceData) => {
            this.brands = Array.isArray(data.brands) ? [...data.brands] : [];
            this.categories = Array.isArray(data.categories)
              ? [...data.categories]
              : [];
            this.variationTemplates = Array.isArray(data.variationTemplates)
              ? [...data.variationTemplates]
              : [];
            console.log('Dữ liệu đã tải:', {
              brands: this.brands,
              categories: this.categories,
              variationTemplates: this.variationTemplates,
            });
            if (id && !isNaN(Number(id))) {
              this.isEditMode = true;
              this.editProductId = Number(id);
              this.loadProduct(id);
            } else {
              this.isEditMode = false;
              this.editProductId = null;
            }
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Lỗi khi tải dữ liệu ban đầu:', error);
        },
      });
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        console.log('Sản phẩm đã tải:', product);
        this.name = product.name || '';
        this.htmlContent = product.description || '';
        this.brandId = product.brandId ?? null;
        this.categoryId = product.categoryId ?? null;
        this.isActive = product.isActive ?? true;
        this.sku = product.sku || '';
        this.inventoryManagement = product.manageStock
          ? 'Track Inventory'
          : "Don't Track Inventory";
        this.stockAvailability = product.inStock ? 'In Stock' : 'Out of Stock';
        this.qty = product.qty || 0;
        this.shortDescription = product.shortDescription || '';
        this.newFrom = product.newFrom || '';
        this.newTo = product.newTo || '';
        this.thumbnail = product.thumbnail || '';
        this.thumbnailPreview = product.thumbnail
          ? `http://localhost:8080/elec/${product.thumbnail.replace(
              /\\/g,
              '/'
            )}`
          : null;

        // Tải hình ảnh từ entity-files
        this.productService.getEntityFiles('product', id).subscribe({
          next: (files) => {
            console.log('Tệp thực thể:', files);
            if (Array.isArray(files)) {
              files.forEach((file) => {
                const url = `http://localhost:8080/elec/${file.path.replace(
                  /\\/g,
                  '/'
                )}`;
                if (file.zone === 'thumbnail') {
                  this.thumbnailFileId = file.fileId;
                  this.thumbnailPreview = url;
                } else if (file.zone === 'gallery') {
                  this.galleryPreviews.push({ fileId: file.fileId, url });
                }
              });
            } else {
              console.warn('getEntityFiles không trả về mảng:', files);
              this.thumbnailFileId = null;
              this.thumbnailPreview = product.thumbnail
                ? `http://localhost:8080/elec/${product.thumbnail.replace(
                    /\\/g,
                    '/'
                  )}`
                : null;
              this.galleryPreviews = [];
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Lỗi khi tải hình ảnh sản phẩm:', err);
            this.thumbnailFileId = null;
            this.thumbnailPreview = product.thumbnail
              ? `http://localhost:8080/elec/${product.thumbnail.replace(
                  /\\/g,
                  '/'
                )}`
              : null;
            this.galleryPreviews = [];
            this.cdr.detectChanges();
          },
        });

        this.selectedVariationIds = Array.isArray(product.variationIds)
          ? [...product.variationIds]
          : [];
        this.variations =
          Array.isArray(product.variations) && product.variations.length > 0
            ? product.variations.map((variation) => ({
                name: variation.name || '',
                type: variation.type || 'Text',
                values: Array.isArray(variation.values)
                  ? variation.values.map((val) => ({
                      label: val.label || '',
                      value: val.value || val.label,
                      color:
                        variation.type === 'Color'
                          ? val.color || undefined
                          : undefined,
                    }))
                  : [],
              }))
            : this.generateVariationsFromIdsAndVariants(
                product.variationIds,
                this.variants
              );

        this.variants = Array.isArray(product.variants)
          ? product.variants.map((variant) => {
              const variantName = variant.name || '';
              let variationValues = Array.isArray(variant.variationValues)
                ? [...variant.variationValues]
                : [];
              if (
                variationValues.length === 0 &&
                (variantName || variant.sku)
              ) {
                const label =
                  variantName.split('-').pop() ||
                  variant.sku?.split('-').pop() ||
                  '';
                if (label) {
                  variationValues = [{ label, value: label, color: undefined }];
                }
              }

              return {
                ...variant,
                name: variantName || `Variant-${variant.sku || 'unknown'}`,
                sku:
                  variant.sku ||
                  `SKU-${
                    variantName.toUpperCase().replace(/\s+/g, '-') || 'UNKNOWN'
                  }`,
                price: variant.price ?? 0,
                specialPrice: variant.specialPrice ?? undefined,
                specialPriceType: variant.specialPriceType ?? 1,
                specialPriceStart: variant.specialPriceStart || null,
                specialPriceEnd: variant.specialPriceEnd || null,
                inventoryManagement:
                  variant.inventoryManagement || this.inventoryManagement,
                stockAvailability:
                  variant.stockAvailability || this.stockAvailability,
                qty: variant.qty || 0,
                isDefault: variant.isDefault ?? false,
                variationValues,
                sellingPrice:
                  variant.sellingPrice ??
                  (variant.specialPrice || variant.price || 0),
                manageStock:
                  variant.manageStock ??
                  this.inventoryManagement === 'Track Inventory',
                inStock:
                  variant.inStock ?? this.stockAvailability === 'In Stock',
                isActive: variant.isActive ?? true,
                imagePreview: variant.imagePreview ?? null,
              };
            })
          : [];

        this.variations =
          Array.isArray(product.variations) && product.variations.length > 0
            ? product.variations.map((variation) => ({
                name: variation.name || '',
                type: variation.type || 'Text',
                values: Array.isArray(variation.values)
                  ? variation.values.map((val) => ({
                      label: val.label || '',
                      value: val.value || val.label,
                      color:
                        variation.type === 'Color'
                          ? val.color || undefined
                          : undefined,
                    }))
                  : [],
              }))
            : this.generateVariationsFromIdsAndVariants(
                product.variationIds,
                this.variants
              );

        this.selectedVariationIds =
          Array.isArray(product.variationIds) && product.variationIds.length > 0
            ? product.variationIds.filter((id) =>
                this.variationTemplates.some((template) => template.id === id)
              )
            : this.variations
                .map((v) => {
                  const template = this.variationTemplates.find(
                    (t) => t.name === v.name && t.type === v.type
                  );
                  return template ? template.id : null;
                })
                .filter((id): id is number => id !== null);

        this.defaultVariantName =
          this.variants.find((v) => v.isDefault)?.name ||
          this.variants[0]?.name ||
          '';
        this.showVariantsSection = this.variants.length > 0;

        console.log('Trạng thái đã cập nhật:', {
          brandId: this.brandId,
          categoryId: this.categoryId,
          variationIds: this.selectedVariationIds,
          variations: this.variations,
          variants: this.variants,
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm:', error);
      },
    });
  }

  openFileManager(zone: 'thumbnail' | 'gallery') {
    this.selectedZone = zone;
    this.showFileManager = true;
    this.cdr.detectChanges();
  }

  onFileInserted(event: { fileId: number; zone: string; thumbnail: string }) {
    console.log('Sự kiện chèn tệp:', event);
    if (event.zone === 'thumbnail') {
      this.thumbnailFileId = event.fileId;
      this.thumbnailPreview = event.thumbnail;
      this.thumbnail = event.thumbnail.split('/').pop() || '';
    } else if (event.zone === 'gallery') {
      this.galleryPreviews.push({ fileId: event.fileId, url: event.thumbnail });
    }
    this.showFileManager = false;
    this.cdr.detectChanges();
  }

  removeGalleryImage(index: number) {
    if (index >= 0 && index < this.galleryPreviews.length) {
      this.galleryPreviews.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  private generateVariationsFromIdsAndVariants(
    variationIds: number[] | null | undefined,
    variants: Variant[]
  ): Variation[] {
    const variations: Variation[] = [];

    if (Array.isArray(variationIds) && variationIds.length > 0) {
      variationIds.forEach((id) => {
        const template = this.variationTemplates.find((t) => t.id === id);
        if (template) {
          const uniqueValues = new Set<string>();
          const values: OptionValue[] = [];
          variants.forEach((v) => {
            if (Array.isArray(v.variationValues)) {
              v.variationValues.forEach((val) => {
                if (val.label && !uniqueValues.has(val.label)) {
                  uniqueValues.add(val.label);
                  values.push({ ...val });
                }
              });
            } else {
              const label =
                v.name.split('-').pop() || v.sku?.split('-').pop() || '';
              if (label && !uniqueValues.has(label)) {
                uniqueValues.add(label);
                values.push({ label, value: label });
              }
            }
          });
          variations.push({
            name: template.name,
            type: template.type,
            values: values.length > 0 ? values : template.values,
          });
        }
      });
    }

    if (variations.length === 0 && variants.length > 0) {
      const variationsMap = new Map<string, Variation>();
      variants.forEach((variant) => {
        const variationName = 'Size';
        const variationType = 'Text';
        const label =
          variant.name.split('-').pop() || variant.sku?.split('-').pop() || '';
        if (label) {
          if (!variationsMap.has(variationName)) {
            variationsMap.set(variationName, {
              name: variationName,
              type: variationType,
              values: [],
            });
          }
          const variation = variationsMap.get(variationName)!;
          if (!variation.values.some((v) => v.label === label)) {
            variation.values.push({ label, value: label });
          }
        }
      });
      return Array.from(variationsMap.values());
    }

    return variations;
  }

  addVariation() {
    if (
      this.variations.some(
        (v) => !v?.name || !v?.type || v?.values.length === 0
      )
    ) {
      alert('Vui lòng hoàn thành variation hiện tại trước khi thêm mới.');
      return;
    }
    this.variations.push({ name: '', type: '', values: [] });
    this.cdr.detectChanges();
  }

  removeVariation(index: number) {
    if (index >= 0 && index < this.variations.length) {
      this.variations.splice(index, 1);
      if (index < this.selectedVariationIds.length) {
        this.selectedVariationIds.splice(index, 1);
      }
      this.updateVariants();
    }
  }

  insertVariation() {
    if (this.selectedTemplateId === null) return;

    const selectedTemplate = this.variationTemplates.find(
      (template) => template.id === this.selectedTemplateId
    );
    if (!selectedTemplate) return;

    const newVariation: Variation = {
      name: selectedTemplate.name,
      type: selectedTemplate.type,
      values: selectedTemplate.values.map((value) => ({ ...value })),
    };

    this.variations.push(newVariation);
    this.selectedVariationIds.push(selectedTemplate.id);
    console.log('Variations sau khi chèn:', this.variations);
    console.log('Selected variationIds:', this.selectedVariationIds);
    this.updateVariants();
    this.selectedTemplateId = null;
    this.showVariantsSection = true;
    this.cdr.detectChanges();
  }

  onTypeChange(index: number) {
    if (index >= 0 && index < this.variations.length) {
      const variation = this.variations[index];
      if (variation) {
        if (variation.type === 'Color') {
          variation.values = variation.values.length
            ? variation.values
            : [{ label: '', value: '', color: '#000000' }];
        } else if (variation.type === 'Text') {
          variation.values = variation.values.length
            ? variation.values
            : [{ label: '', value: '' }];
        } else {
          variation.values = [];
        }
        this.updateVariants();
      }
    }
  }

  addRow(variationIndex: number) {
    if (variationIndex >= 0 && variationIndex < this.variations.length) {
      const variation = this.variations[variationIndex];
      if (variation) {
        if (variation.type === 'Color') {
          variation.values.push({ label: '', value: '', color: '#000000' });
        } else {
          variation.values.push({ label: '', value: '' });
        }
        this.updateVariants();
      }
    }
  }

  removeRow(variationIndex: number, rowIndex: number) {
    if (variationIndex >= 0 && variationIndex < this.variations.length) {
      const variation = this.variations[variationIndex];
      if (variation && rowIndex >= 0 && rowIndex < variation.values.length) {
        variation.values.splice(rowIndex, 1);
        this.updateVariants();
      }
    }
  }

  private generateVariantCombinations(
    variations: Variation[]
  ): OptionValue[][] {
    if (variations.length === 0) return [[]];

    return variations.reduce<OptionValue[][]>(
      (acc, variation) => {
        return variation.values.flatMap((value) =>
          acc.map((comb) => [...comb, value])
        );
      },
      [[]]
    );
  }

  updateVariants() {
    const oldVariants = [...this.variants];
    const filteredVariations = this.variations.filter(
      (v) =>
        v &&
        v.name &&
        v.type &&
        v.values.length > 0 &&
        v.values.every((val) => val && val.label)
    );

    this.variants = [];

    if (filteredVariations.length === 0) {
      this.showVariantsSection = false;
      this.defaultVariantName = '';
      this.variations = filteredVariations;
      this.cdr.detectChanges();
      return;
    }

    const combinations = this.generateVariantCombinations(filteredVariations);

    this.variants = combinations.map((comb) => {
      const variantNameParts = comb.map(
        (value, i) => `${filteredVariations[i].name}-${value.label}`
      );
      const variantName = this.name
        ? `${this.name}-${variantNameParts.join('-')}`
        : `Variation-${variantNameParts.join('-')}`;

      const defaultSku = `SKU-${variantName
        .toUpperCase()
        .replace(/\s+/g, '-')}`;
      const existingVariant = oldVariants.find(
        (v) =>
          v.name === variantName ||
          v.name === comb[comb.length - 1].label ||
          (v.sku && v.sku.includes(comb[comb.length - 1].label))
      );

      const variant: Variant = {
        name: variantName,
        sku: existingVariant?.sku || defaultSku,
        price: existingVariant?.price ?? this.price ?? 0,
        specialPrice:
          existingVariant?.specialPrice ?? this.specialPrice ?? undefined,
        specialPriceType:
          existingVariant?.specialPriceType ?? this.specialPriceType,
        specialPriceStart:
          existingVariant?.specialPriceStart ?? this.specialPriceStart ?? null,
        specialPriceEnd:
          existingVariant?.specialPriceEnd ?? this.specialPriceEnd ?? null,
        inventoryManagement:
          existingVariant?.inventoryManagement ?? this.inventoryManagement,
        stockAvailability:
          existingVariant?.stockAvailability ?? this.stockAvailability,
        qty: existingVariant?.qty ?? this.qty ?? 0,
        isDefault: existingVariant?.isDefault ?? false,
        variationValues: comb,
        sellingPrice:
          existingVariant?.sellingPrice ??
          existingVariant?.specialPrice ??
          existingVariant?.price ??
          this.specialPrice ??
          this.price ??
          0,
        manageStock:
          existingVariant?.manageStock ??
          this.inventoryManagement === 'Track Inventory',
        inStock:
          existingVariant?.inStock ?? this.stockAvailability === 'In Stock',
        isActive: existingVariant?.isActive ?? this.isActive,
        imagePreview: existingVariant?.imagePreview ?? null,
      };

      return variant;
    });

    if (this.variants.length > 0) {
      const defaultVariant =
        this.variants.find((v) => v.isDefault) || this.variants[0];
      this.variants.forEach(
        (v) => (v.isDefault = v.name === defaultVariant.name)
      );
      this.defaultVariantName = defaultVariant.name;
      this.showVariantsSection = true;
    } else {
      this.showVariantsSection = false;
      this.defaultVariantName = '';
    }

    this.variations = filteredVariations;
    console.log('Variations sau khi cập nhật:', this.variations);
    console.log('Variants sau khi cập nhật:', this.variants);
    this.cdr.detectChanges();
  }

  setDefaultVariant() {
    this.variants.forEach((variant) => {
      variant.isDefault = variant.name === this.defaultVariantName;
    });
    console.log('Default variant được đặt:', this.defaultVariantName);
    this.cdr.detectChanges();
  }

  updateVariant(updatedVariant: Variant) {
    const index = this.variants.findIndex(
      (v) => v.name === updatedVariant.name
    );
    if (index !== -1) {
      this.variants[index] = { ...updatedVariant };
      this.cdr.detectChanges();
    }
  }

  onSave(): void {
    if (this.productForm.valid && this.categoryId !== null) {
      this.submitForm(false);
    } else {
      this.productForm.control.markAllAsTouched();
      let errorMessage = 'Vui lòng kiểm tra lại biểu mẫu:';
      if (!this.productForm.valid)
        errorMessage += '\n- Vui lòng điền đầy đủ các trường bắt buộc.';
      if (this.categoryId === null)
        errorMessage += '\n- Chọn danh mục sản phẩm.';
      alert(errorMessage);
      console.log(
        'Biểu mẫu không hợp lệ:',
        this.productForm.errors,
        'categoryId:',
        this.categoryId,
        'thumbnailFileId:',
        this.thumbnailFileId,
        'thumbnail:',
        this.thumbnail
      );
      this.cdr.detectChanges();
    }
  }

  onSaveAndExit(): void {
    if (this.productForm.valid && this.categoryId !== null) {
      this.submitForm(true);
    } else {
      this.productForm.control.markAllAsTouched();
      let errorMessage = 'Vui lòng kiểm tra lại biểu mẫu:';
      if (!this.productForm.valid)
        errorMessage += '\n- Vui lòng điền đầy đủ các trường bắt buộc.';
      if (this.categoryId === null)
        errorMessage += '\n- Chọn danh mục sản phẩm.';
      alert(errorMessage);
      console.log(
        'Biểu mẫu không hợp lệ:',
        this.productForm.errors,
        'categoryId:',
        this.categoryId,
        'thumbnailFileId:',
        this.thumbnailFileId,
        'thumbnail:',
        this.thumbnail
      );
      this.cdr.detectChanges();
    }
  }

  private submitForm(exit: boolean): void {
    if (!this.productForm.valid || this.categoryId === null) {
      this.productForm.control.markAllAsTouched();
      let errorMessage = 'Vui lòng kiểm tra lại biểu mẫu:';
      if (!this.productForm.valid)
        errorMessage += '\n- Vui lòng điền đầy đủ các trường bắt buộc.';
      if (this.categoryId === null)
        errorMessage += '\n- Chọn danh mục sản phẩm.';
      alert(errorMessage);
      console.log(
        'Biểu mẫu không hợp lệ:',
        this.productForm.errors,
        'categoryId:',
        this.categoryId,
        'thumbnailFileId:',
        this.thumbnailFileId,
        'thumbnail:',
        this.thumbnail
      );
      this.cdr.detectChanges();
      return;
    }

    // Đảm bảo không có SKU null và imagePreview không undefined
    this.variants.forEach((variant) => {
      if (!variant.sku) {
        variant.sku = `SKU-${variant.name.toUpperCase().replace(/\s+/g, '-')}`;
      }
      if (variant.imagePreview === undefined) {
        variant.imagePreview = null;
      }
    });

    // Xây dựng productInput
    const productInput: ProductInput = {
      name: this.name,
      description: this.htmlContent,
      brandId: this.brandId,
      categoryId: this.categoryId,
      sku: this.sku || null,
      variationIds:
        this.selectedVariationIds.length > 0 ? this.selectedVariationIds : null,
      variants: this.variants,
      newFrom: this.newFrom || null,
      newTo: this.newTo || null,
      thumbnail: this.thumbnail || null,
    };

    console.log('Gửi productInput:', productInput);

    // Gọi API để lưu sản phẩm
    const saveObservable =
      this.isEditMode && this.editProductId !== null
        ? this.productService.updateProduct(
            String(this.editProductId),
            productInput
          )
        : this.productService.createProduct(productInput);

    saveObservable.subscribe({
      next: (res: any) => {
        console.log('Phản hồi API:', res);
        const productId = this.isEditMode
          ? String(this.editProductId)
          : res.result.id;
        const attaches = [];

        // Gắn thumbnail nếu có
        if (this.thumbnailFileId) {
          attaches.push(
            this.productService.postEntityFile({
              fileId: this.thumbnailFileId,
              entityId: productId,
              entityType: 'product',
              zone: 'thumbnail',
            })
          );
        }

        // Gắn hình ảnh gallery
        this.galleryPreviews.forEach((image) => {
          attaches.push(
            this.productService.postEntityFile({
              fileId: image.fileId,
              entityId: productId,
              entityType: 'product',
              zone: 'gallery',
            })
          );
        });

        if (attaches.length > 0) {
          forkJoin(attaches).subscribe({
            next: () => {
              alert(
                this.isEditMode
                  ? 'Cập nhật sản phẩm thành công'
                  : 'Tạo sản phẩm thành công'
              );
              if (exit) {
                this.router.navigate(['app-layout/app-products']);
              }
              this.resetForm();
            },
            error: (err) => {
              console.error('Gắn hình ảnh thất bại:', err);
              alert(
                (this.isEditMode ? 'Cập nhật' : 'Tạo') +
                  ' sản phẩm thành công nhưng gắn ảnh thất bại.'
              );
              if (exit) {
                this.router.navigate(['app-layout/app-products']);
              }
              this.resetForm();
            },
          });
        } else {
          alert(
            this.isEditMode
              ? 'Cập nhật sản phẩm thành công'
              : 'Tạo sản phẩm thành công'
          );
          if (exit) {
            this.router.navigate(['app-layout/app-products']);
          }
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Lỗi khi lưu sản phẩm:', error);
        alert(
          this.isEditMode
            ? 'Cập nhật sản phẩm thất bại'
            : 'Tạo sản phẩm thất bại'
        );
      },
    });
  }

  private resetForm() {
    this.name = '';
    this.htmlContent = '';
    this.brandId = null;
    this.categoryId = null;
    this.variations = [];
    this.variants = [];
    this.defaultVariantName = '';
    this.showVariantsSection = false;
    this.price = 0;
    this.specialPrice = 0;
    this.specialPriceType = 1;
    this.specialPriceStart = null;
    this.specialPriceEnd = null;
    this.sku = '';
    this.inventoryManagement = 'Track Inventory';
    this.stockAvailability = 'In Stock';
    this.qty = 0;
    this.shortDescription = '';
    this.newFrom = '';
    this.newTo = '';
    this.thumbnail = '';
    this.thumbnailPreview = null;
    this.thumbnailFileId = null;
    this.galleryPreviews = [];
    this.selectedVariationIds = [];
    this.isEditMode = false;
    this.editProductId = null;
    this.productForm.resetForm();
    this.cdr.detectChanges();
  }

  private mapProductsWithNames(products: Product[]): Product[] {
    return products.map((product) => {
      if (product.brandId && this.brands.length > 0) {
        const brand = this.brands.find((b) => b.id === product.brandId);
        product.brandName = brand ? brand.name : 'Unknown Brand';
      } else {
        product.brandName = 'Unknown Brand';
      }
      if (product.categoryId && this.categories.length > 0) {
        const category = this.categories.find(
          (c) => c.id === product.categoryId
        );
        product.categoryName = category ? category.name : 'Unknown Category';
      } else {
        product.categoryName = 'Unknown Category';
      }
      return product;
    });
  }
}
