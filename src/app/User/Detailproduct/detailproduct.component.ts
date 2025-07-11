import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'product-detail',
  templateUrl: 'detailproduct.component.html',
  styleUrls: ['detailproduct.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ]
})
export class ProductDetailComponent {
  product = {
    id: 'VKGWT1MG',
    name: 'Men Embroidery Polo Giraffe Shirt',
    price: 8.66,
    rating: 5,
    reviews: 5,
    inStock: true,
    description: 'Brand Name: GuaGuanTa Sleeve Length (cm): Short Shirt Type: Slim Style. Casual Decoration: Embroidery',
    warranty: 'Warranty Compare',
    category: "Men's Fashion",
    tags: ['Fashion', 'New Arrivals', 'Casual', 'Outfit', 'Lifestyle'],
    images: [
      'assets/images/ao1.jpeg',
      'assets/images/ao2.webp',
      'assets/images/polo-white.jpg',
      'assets/images/polo-black.jpg',
      'assets/images/polo-navy.jpg',
      'assets/images/polo-green.jpg'
    ],
    features: [
      '24/7 SUPPORT - Support every time',
      'ACCEPT PAYMENT - Visa, Paypal, Master',
      'SECURED PAYMENT - 100% Secured',
      'FREE SHIPPING - Order over $100',
      '30 DAYS RETURN - 30 days guarantee'
    ]
  };

  selectedImage = 0;
  quantity = 1;
  activeTab = 'description';

  relatedProducts = [
    {
      name: 'DUDUALISS Men Long Sleeve Shirt Men...',
      price: 17.30,
      image: 'assets/images/related1.jpg',
      rating: 5
    },
    {
      name: 'S-5XL Plus Size Brand Clothing Cotton Mens...',
      price: 7.47,
      image: 'assets/images/related2.jpg',
      rating: 4
    },
    {
      name: '2019 brand casual spring luxury plaid lon...',
      price: 5.24,
      image: 'assets/images/related3.jpg',
      rating: 4
    },
    {
      name: 'Long-sleeved Camisa Masculina Chamise...',
      price: 9.69,
      image: 'assets/images/related4.jpg',
      rating: 5
    },
    {
      name: 'Europe size Summer Short Sleeve Solid Polo...',
      price: 8.35,
      image: 'assets/images/related5.jpg',
      rating: 4
    }
  ];

  sizeChart = [
    { size: 'S', shoulder: 44, chest: 100, length: 65, sleeve: 19 },
    { size: 'M', shoulder: 46, chest: 104, length: 67, sleeve: 20 },
    { size: 'L', shoulder: 48, chest: 108, length: 69, sleeve: 21 },
    { size: 'XL', shoulder: 50, chest: 112, length: 71, sleeve: 22 },
    { size: 'XXL', shoulder: 52, chest: 116, length: 73, sleeve: 23 }
  ];

  showSizeChart = false;

  selectImage(index: number) {
    this.selectedImage = index;
  }

  changeQuantity(change: number) {
    this.quantity = Math.max(1, this.quantity + change);
  }

  addToCart() {
    console.log('Added to cart:', {
      product: this.product,
      quantity: this.quantity
    });
    // Implement add to cart logic
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSizeChart() {
    this.showSizeChart = !this.showSizeChart;
  }

  shareProduct(platform: string) {
    console.log('Sharing on', platform);
    // Implement share functionality
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'star' : 'star_border');
  }
}
