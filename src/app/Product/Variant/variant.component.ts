import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Variant } from '../product.service'; // Import Variant từ product.service.ts

@Component({
  selector: 'variant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.css'],
})
export class VariantComponent {
  @Input() variant!: Variant;
  @Input() variants: Variant[] = [];
  @Input() defaultVariantName: string = '';
  @Output() defaultVariantNameChange = new EventEmitter<string>();
  @Output() variantChange = new EventEmitter<Variant>();
  isCollapsed: boolean = false;

  setAsDefault() {
    this.defaultVariantNameChange.emit(this.variant.name);
    console.log('Emitting defaultVariantName:', this.variant.name);
    this.emitChange();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.emitChange();
  }

  // onVariantImageSelected(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.variant.imagePreview = reader.result as string | ArrayBuffer;
  //       this.emitChange();
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onSkuChange() {
    if (!this.variant.sku) {
      this.variant.sku = `SKU-${this.variant.name
        .toUpperCase()
        .replace(/\s+/g, '-')}`;
    }
    this.emitChange();
  }

  onFieldChange() {
    this.emitChange();
  }

  private emitChange() {
    this.variantChange.emit(this.variant);
  }
}
