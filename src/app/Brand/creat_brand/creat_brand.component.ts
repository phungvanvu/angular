import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-brands',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creat_brand.component.html',
  styleUrls: ['./creat-brand.component.css'],
})
export class CreatBrandsComponent {
  activeTab: string = 'general';
  brandForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      status: [false],
    });
  }
  handleBrowse() {
    this.router.navigate(['/create_image']);
  }
  onSubmit() {
    if (this.brandForm.valid) {
      console.log(this.brandForm.value);
    }
  }
}
