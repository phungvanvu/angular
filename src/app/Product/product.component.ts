import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '../shared/components/generic-table/generic-table.component'; 

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],   
  templateUrl: './product.component.html',
})
export class ProductsComponent {
  productColumns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Product Name' }, 
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
    { field: 'updated', header: 'Updated' },
  ];

  products = [
    { id: 1, name: 'Product A', price: '$100', status: 'Active', updated: '2 days ago' },
    { id: 2, name: 'Product B', price: '$200', status: 'Inactive', updated: '5 days ago' },
    { id: 1, name: 'Product A', price: '$100', status: 'Active', updated: '2 days ago' },
    { id: 2, name: 'Product B', price: '$200', status: 'Inactive', updated: '5 days ago' },
    { id: 1, name: 'Product A', price: '$100', status: 'Active', updated: '2 days ago' },
    { id: 2, name: 'Product B', price: '$200', status: 'Inactive', updated: '5 days ago' },
    { id: 1, name: 'Product A', price: '$100', status: 'Active', updated: '2 days ago' },
    { id: 2, name: 'Product B', price: '$200', status: 'Inactive', updated: '5 days ago' },
  ];
}
