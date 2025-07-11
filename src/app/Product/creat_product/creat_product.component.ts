import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'creat_product',
  standalone: true,
  templateUrl: './creat_product.component.html',
  styleUrls: ['./creat_product.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    EditorModule
  ]
})
export class CreatProductComponent {
  status: boolean = true;
  htmlContent: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
