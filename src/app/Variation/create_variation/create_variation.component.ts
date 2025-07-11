import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OptionValue {
  label: string;
  color?: string;
}

@Component({
  selector: 'app-create-variation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create_variation.component.html',
  styleUrls: ['./create_variation.component.css']
})
export class CreateVariationComponent {
  variationName = '';
  variationType = '';
  values: OptionValue[] = [];

  // 👉 Thêm ViewChildren để lấy danh sách input color ẩn
  @ViewChildren('hiddenColorInput') hiddenColorInputs!: QueryList<ElementRef>;

  constructor() {
    this.resetValues();
  }

  onTypeChange() {
    this.resetValues();
  }

  resetValues() {
    if (this.variationType === 'Text') {
      this.values = [{ label: '' }];
    } else if (this.variationType === 'Color') {
      this.values = [{ label: '', color: '' }];
    } else {
      this.values = [];
    }
  }

  addRow() {
    if (this.variationType === 'Text') {
      this.values.push({ label: '' });
    } else if (this.variationType === 'Color') {
      this.values.push({ label: '', color: '' });
    }
  }

  removeRow(index: number) {
    this.values.splice(index, 1);
  }

  // 👉 Hàm mở color picker ẩn
  openColorPicker(index: number) {
    const input = this.hiddenColorInputs.toArray()[index];
    if (input) {
      input.nativeElement.click();
    }
  }

  save() {
    console.log({
      name: this.variationName,
      type: this.variationType,
      values: this.values
    });
  }
}
