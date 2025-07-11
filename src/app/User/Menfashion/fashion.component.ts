import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  isWishlisted?: boolean; // <--- thêm dòng này
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  expanded?: boolean;
}

@Component({
  selector: 'fashion-shop',
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ]
})
export class FashionComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'Latest';
  itemsPerPage: number = 20;
  priceRange: [number, number] = [2, 7499];
  cartItems: number = 5;
  wishlistCount: number = 0;
  sortOptions = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'Best Rating'];
  itemsPerPageOptions = [10, 20, 50, 100];

  categories: Category[] = [
    { id: 'electronics', name: 'Electronics', icon: '', expanded: true },
    { id: 'mens-fashion', name: "Men's Fashion", icon: '', expanded: false },
    { id: 'consumer-electronics', name: 'Consumer Electronics', icon: '', expanded: false },
    { id: 'watches', name: 'Watches', icon: '', expanded: false },
    { id: 'home-appliances', name: 'Home Appliances', icon: '', expanded: false },
    { id: 'backpacks', name: 'Backpacks', icon: '', expanded: false },
    { id: 'womens-fashion', name: "Women's Fashion", icon: '', expanded: false }
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'Sennheiser Consumer Audio Momentum 4 Wireless',
      price: 255.00,
      originalPrice: 399.00,
      image: 'assets/images/ao1.jpeg',
      rating: 0,
      reviews: 0,
      badge: '-36%',
      badgeColor: 'success'
    },
    {
      id: 2,
      name: 'Bose QuietComfort Bluetooth Headphones',
      price: 349.00,
      image: 'assets/images/ao2.webp',
      rating: 0,
      reviews: 0,
      badge: 'Out of Stock',
      badgeColor: 'danger'
    },
    {
      id: 3,
      name: 'Beats Studio Buds +',
      price: 170.00,
      image: 'assets/images/aokhoac2.webp',
      rating: 5,
      reviews: 1
    },
    {
      id: 4,
      name: 'Beats Fit Pro - True Wireless Noise Cancelling Earbuds',
      price: 155.00,
      image: 'assets/images/aokhoacnam.jpeg',
      rating: 0,
      reviews: 0
    },
    {
      id: 5,
      name: 'Apple AirPods Pro',
      price: 299.00,
      image: 'assets/images/giay2.jpeg',
      rating: 0,
      reviews: 0
    },
    {
      id: 6,
      name: 'OnePlus 11 5G',
      price: 759.99,
      image: 'assets/images/giay3.webp',
      rating: 0,
      reviews: 0
    },
    {
      id: 7,
      name: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
      price: 1299.99,
      image: 'assets/images/kinh1.jpeg',
      rating: 0,
      reviews: 0
    },
    {
      id: 8,
      name: 'Apple 2023 iMac (24-inch)',
      price: 1499.00,
      image: 'assets/images/kinh2.webp',
      rating: 0,
      reviews: 0
    }
  ];

  latestProducts: Product[] = [
    {
      id: 9,
      name: 'Sennheiser Consumer Audio Momentum 4 Wireless',
      price: 255.00,
      originalPrice: 399.00,
      image: 'assets/images/sennheiser-small.jpg',
      rating: 0,
      reviews: 0
    },
    {
      id: 10,
      name: 'Sennheiser Consumer Audio Momentum 4 Wireless',
      price: 255.00,
      originalPrice: 399.00,
      image: 'assets/images/sennheiser-small.jpg',
      rating: 0,
      reviews: 0
    },
    {
      id: 11,
      name: 'Sennheiser Consumer Audio Momentum 4 Wireless',
      price: 255.00,
      originalPrice: 399.00,
      image: 'assets/images/sennheiser-small.jpg',
      rating: 0,
      reviews: 0
    }
  ];

  filteredProducts: Product[] = [];

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }

  toggleCategory(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.expanded = !category.expanded;
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value || this.sortBy;
    this.sortFilteredProducts();
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value);
    // Logic phân trang nếu cần
  }

  onPriceRangeChange(event: any): void {
    const value = parseInt(event.target.value);
    this.priceRange = [this.priceRange[0], value];
    this.applyFilters();
  }

  applyFilters(): void {
    // Lọc theo khoảng giá
    this.filteredProducts = this.products.filter(p =>
      p.price >= this.priceRange[0] && p.price <= this.priceRange[1]
    );
    this.sortFilteredProducts();
  }

  sortFilteredProducts(): void {
    switch (this.sortBy) {
      case 'Price: Low to High':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'Best Rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'Most Popular':
        this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'Latest':
      default:
        this.filteredProducts.sort((a, b) => a.id - b.id);
        break;
    }
  }

  addToCart(product: Product): void {
    this.cartItems++;
    console.log('Added to cart:', product.name);
  }

  addToWishlist(product: Product): void {
  product.isWishlisted = !product.isWishlisted;

  if (product.isWishlisted) {
    this.wishlistCount++;
    console.log('Added to wishlist:', product.name);
    } else {
      this.wishlistCount--;
      console.log('Removed from wishlist:', product.name);
    }
  }

  generateStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
