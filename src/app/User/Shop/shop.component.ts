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
  createdAt: string;
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  expanded?: boolean;
}

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class ShopComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'Latest';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  priceRange: [number, number] = [2, 7499];
  cartItems: number = 5;

  sortOptions = [
    'Latest',
    'Price: Low to High',
    'Price: High to Low',
    'Most Popular',
    'Best Rating',
  ];
  itemsPerPageOptions = [5, 10, 20, 30];

  categories: Category[] = [
    { id: 'electronics', name: 'Electronics', icon: '', expanded: true },
    { id: 'mens-fashion', name: "Men's Fashion", icon: '', expanded: false },
    {
      id: 'consumer-electronics',
      name: 'Consumer Electronics',
      icon: '',
      expanded: false,
    },
    { id: 'watches', name: 'Watches', icon: '', expanded: false },
    {
      id: 'home-appliances',
      name: 'Home Appliances',
      icon: '',
      expanded: false,
    },
    { id: 'backpacks', name: 'Backpacks', icon: '', expanded: false },
    {
      id: 'womens-fashion',
      name: "Women's Fashion",
      icon: '',
      expanded: false,
    },
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'Apple AirPods Pro',
      price: 299.0,
      image: '../../../assets/products/3115_acer_aspire_a514_56p_gray_a8.jpg',
      rating: 4,
      reviews: 15,
      createdAt: '2024-07-01T10:00:00Z',
      categories: ['electronics', 'consumer-electronics'],
    },
    {
      id: 2,
      name: 'Samsung Galaxy Watch 5',
      price: 249.0,
      image:
        '../../../assets/products/90448_laptop_hp_14_ep0220tu_b73vwpa_0004_layer_2.jpgs',
      rating: 4,
      reviews: 12,
      badge: '-10%',
      badgeColor: 'success',
      createdAt: '2024-06-25T12:00:00Z',
      categories: ['electronics', 'watches'],
    },
    {
      id: 3,
      name: 'Dell Inspiron 15',
      price: 599.0,
      image:
        '../../../assets/products/dell-pro-laptops-category-image-800x620.jpg',
      rating: 3,
      reviews: 7,
      createdAt: '2024-06-20T15:00:00Z',
      categories: ['electronics'],
    },
    {
      id: 4,
      name: 'Sony WH-1000XM4',
      price: 349.0,
      image: '../../../assets/products/images (1).jpg',
      rating: 5,
      reviews: 20,
      createdAt: '2024-07-05T09:00:00Z',
      categories: ['electronics'],
    },
    {
      id: 5,
      name: 'Fossil Gen 6 Smartwatch',
      price: 299.0,
      image: '../../../assets/products/images.jpg',
      rating: 4,
      reviews: 9,
      createdAt: '2024-06-10T10:00:00Z',
      categories: ['watches'],
    },
    {
      id: 6,
      name: '.ddddddpg',
      price: 1199.0,
      image: '../../../assets/products/tải xuống (1).jpg',
      rating: 5,
      reviews: 18,
      createdAt: '2024-07-01T10:30:00Z',
      categories: ['electronics'],
    },
    {
      id: 7,
      name: 'fgggggggggggggg',
      price: 99.0,
      image: '../../../assets/products/tải xuống (2).jpg',
      rating: 4,
      reviews: 10,
      createdAt: '2024-07-03T11:00:00Z',
      categories: ['electronics'],
    },
    {
      id: 8,
      name: 'Anker PowerCore 10000',
      price: 49.0,
      image: '../../../assets/products/tải xuống (3).jpg',
      rating: 3,
      reviews: 4,
      createdAt: '2024-06-18T13:00:00Z',
      categories: ['electronics'],
    },
    {
      id: 9,
      name: 'Men’s Leather Backpack',
      price: 89.0,
      image: '../../../assets/products/tải xuống.jpg',
      rating: 4,
      reviews: 6,
      createdAt: '2024-07-02T14:00:00Z',
      categories: ['backpacks', 'mens-fashion'],
    },
    {
      id: 10,
      name: 'Women’s Fashion Tote',
      price: 79.0,
      image: '../../../assets/products/images (1).jpg',
      rating: 5,
      reviews: 10,
      createdAt: '2024-06-30T08:30:00Z',
      categories: ['backpacks', 'womens-fashion'],
    },
    {
      id: 11,
      name: 'Xiaomi Smart Vacuum',
      price: 249.0,
      image: '../../../assets/products/images (2).jpg',
      rating: 4,
      reviews: 8,
      createdAt: '2024-07-04T09:30:00Z',
      categories: ['home-appliances'],
    },
    {
      id: 12,
      name: 'Dyson Supersonic Hair Dryer',
      price: 399.0,
      image: '../../../assets/products/images (3).jpg',
      rating: 5,
      reviews: 22,
      createdAt: '2024-07-06T10:45:00Z',
      categories: ['home-appliances'],
    },
    {
      id: 13,
      name: 'Casio Digital Watch',
      price: 59.0,
      image: '../../../assets/products/images (4).jpg',
      rating: 3,
      reviews: 5,
      createdAt: '2024-06-26T11:20:00Z',
      categories: ['watches'],
    },
    {
      id: 14,
      name: 'Samsung Smart Fridge',
      price: 1799.0,
      image: '../../../assets/products/tải xuống.jpg',
      rating: 5,
      reviews: 12,
      createdAt: '2024-06-21T10:00:00Z',
      categories: ['home-appliances'],
    },
    {
      id: 15,
      name: 'Men’s Business Shoes',
      price: 129.0,
      image:
        '../../../assets/products/dell-pro-laptops-category-image-800x620.jpg',
      rating: 4,
      reviews: 11,
      createdAt: '2024-06-28T09:15:00Z',
      categories: ['mens-fashion'],
    },
    {
      id: 16,
      name: 'Women’s Heels',
      price: 139.0,
      image: '../../../assets/products/3115_acer_aspire_a514_56p_gray_a8.jpg',
      rating: 4,
      reviews: 14,
      createdAt: '2024-07-01T08:40:00Z',
      categories: ['womens-fashion'],
    },
    {
      id: 17,
      name: 'Smart LED TV 55"',
      price: 699.0,
      image: '../../../assets/products/images.jpg',
      rating: 5,
      reviews: 17,
      createdAt: '2024-07-03T12:00:00Z',
      categories: ['electronics', 'consumer-electronics'],
    },
    {
      id: 18,
      name: 'Canon EOS M50 Camera',
      price: 649.0,
      image:
        '../../../assets/products/dell-pro-laptops-category-image-800x620.jpg',
      rating: 5,
      reviews: 13,
      createdAt: '2024-06-29T14:10:00Z',
      categories: ['electronics'],
    },
    {
      id: 19,
      name: 'TCL Air Conditioner',
      price: 499.0,
      image: '../../../assets/products/images (4).jpg',
      rating: 4,
      reviews: 7,
      createdAt: '2024-06-15T15:00:00Z',
      categories: ['home-appliances'],
    },
    {
      id: 20,
      name: 'JBL Bluetooth Speaker',
      price: 129.0,
      image: '../../../assets/products/3115_acer_aspire_a514_56p_gray_a8.jpg',
      rating: 5,
      reviews: 18,
      createdAt: '2024-07-05T16:00:00Z',
      categories: ['electronics'],
    },
  ];

  filteredProductsAll: Product[] = []; // Danh sách đã lọc và sắp xếp
  filteredProducts: Product[] = []; // Danh sách hiển thị sau phân trang
  latestProducts: Product[] = []; // Danh sách sản phẩm mới nhất
  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
    this.getLatestProducts();
  }

  toggleCategory(categoryId: string): void {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) category.expanded = !category.expanded;
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value || this.sortBy;
    this.sortFilteredProducts();
    this.paginateProducts();
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.paginateProducts();
  }

  onPriceRangeChange(event: any): void {
    const value = parseInt(event.target.value);
    this.priceRange = [this.priceRange[0], value];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProductsAll = this.products.filter(
      (p) => p.price >= this.priceRange[0] && p.price <= this.priceRange[1]
    );
    this.sortFilteredProducts();
    this.paginateProducts();
  }

  sortFilteredProducts(): void {
    switch (this.sortBy) {
      case 'Price: Low to High':
        this.filteredProductsAll.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        this.filteredProductsAll.sort((a, b) => b.price - a.price);
        break;
      case 'Best Rating':
        this.filteredProductsAll.sort((a, b) => b.rating - a.rating);
        break;
      case 'Most Popular':
        this.filteredProductsAll.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'Latest':
      default:
        this.filteredProductsAll.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  paginateProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredProducts = this.filteredProductsAll.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateProducts();
  }

  nextPage(): void {
    if (
      this.currentPage * this.itemsPerPage <
      this.filteredProductsAll.length
    ) {
      this.currentPage++;
      this.paginateProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProducts();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProductsAll.length / this.itemsPerPage);
  }

  getLatestProducts(): void {
    this.latestProducts = [...this.products]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }

  addToCart(product: Product): void {
    this.cartItems++;
    console.log('Added to cart:', product.name);
  }

  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
  }

  generateStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }

  filterByCategory(categoryId: string): void {
    this.filteredProductsAll = this.products
      .filter((p) => p.categories.includes(categoryId))
      .filter(
        (p) => p.price >= this.priceRange[0] && p.price <= this.priceRange[1]
      );
    this.sortFilteredProducts();
    this.paginateProducts();
  }
}
