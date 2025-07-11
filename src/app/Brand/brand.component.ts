import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],   
  templateUrl: './brand.component.html',
})
export class BrandsComponent {
  brandColumns = [
    { field: 'id', header: 'ID' },
    { field: 'logo', header: 'Logo' }, 
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status' },
    { field: 'created', header: 'Created' },
  ];

  brands = [
    { id: 1, logo: 'Product A', name: '$100', status: 'Active', created: '2 days ago' },
  ];
}
