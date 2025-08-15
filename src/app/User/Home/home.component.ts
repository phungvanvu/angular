import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewCount: number;
  isOutOfStock?: boolean;
  isNew?: boolean;
  category?: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface BannerItem {
  id: string;
  title: string;
  highlightText?: string;
  description: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  titleColor: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatBadgeModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'dji-mavic';
  accessToken: string | null = null;

  // Danh sách các danh mục sản phẩm hiển thị trong sidebar
  categories: Category[] = [
    { id: '1', name: 'Consumer Electronics', icon: 'devices' },
    { id: '2', name: 'Television', icon: 'tv' },
    { id: '3', name: 'Watches', icon: 'watch' },
    { id: '4', name: 'Fashion', icon: 'checkroom' },
    { id: '5', name: 'Backpacks', icon: 'backpack' },
    { id: '6', name: 'Tablets', icon: 'tablet' },
    { id: '7', name: 'Headphones', icon: 'headphones' },
    { id: '8', name: 'Hot Sale', icon: 'local_fire_department' },
    { id: '9', name: 'Shoe', icon: 'directions_run' },
    { id: '10', name: 'All Categories', icon: 'category' },
  ];

  // Danh sách các tính năng/dịch vụ của cửa hàng
  features: Feature[] = [
    {
      icon: 'support_agent',
      title: '24/7 SUPPORT',
      description: 'Support every time',
    },
    {
      icon: 'payment',
      title: 'ACCEPT PAYMENT',
      description: 'Visa, Paypal, Master',
    },
    {
      icon: 'security',
      title: 'SECURED PAYMENT',
      description: '100% secured',
    },
    {
      icon: 'local_shipping',
      title: 'FREE SHIPPING',
      description: 'Order over $100',
    },
    {
      icon: 'keyboard_return',
      title: '30 DAYS RETURN',
      description: '30 days guarantee',
    },
  ];

  // Danh mục đang được chọn trong product showcase section
  activeCategory = 'laptops';

  // Danh sách các danh mục hiển thị trong product showcase với hình ảnh
  showcaseCategories: Category[] = [
    {
      id: 'laptops',
      name: 'Laptops',
      icon: 'https://asia.fleetcart.envaysoft.com/storage/media/2cZfkz85nXxlSTySz6R8m34u5UQLfiRQVyKjF8hm.png',
    },
    {
      id: 'mobiles',
      name: 'Mobiles',
      icon: 'https://asia.fleetcart.envaysoft.com/storage/media/UAP07Ygha9iXNfG1Rh6DYWrwVQ3HfkuqetLaLc6M.jpeg',
    },
    {
      id: 'tablets',
      name: 'Tablets',
      icon: 'https://asia.fleetcart.envaysoft.com/storage/media/dzeszBwEcUnjWoixHvGYJD7uD2j6BWsy7TBK7tcJ.jpeg',
    },
    {
      id: 'watches',
      name: 'Watches',
      icon: 'https://asia.fleetcart.envaysoft.com/storage/media/0Ae4WkaGunLTgTDf24i2ui0hhGB2kZPRVS5k7rn8.jpeg',
    },
    {
      id: 'fashion',
      name: "Men's Fashion",
      icon: 'https://asia.fleetcart.envaysoft.com/storage/media/4vy12UtugCqB76AoWvy0cAHlzKb1HZsklmkOQ6hK.jpeg',
    },
    {
      id: 'televisions',
      name: 'Televisions',
      icon: 'https://asia.fleetcart.envaysoft.com/storage/media/sjBHD1SNqe4BgkqmvqmWAB7U759HOZPVJRvV1Qbr.png',
    },
  ];

  allProducts: Product[] = [
    // ===== LAPTOPS SECTION =====
    {
      id: '1',
      name: 'MacBook Air M3 (13-inch, 256GB)',
      image:
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
      price: 1099.0,
      originalPrice: 1199.0,
      discount: '-8%',
      rating: 4.7,
      reviewCount: 1823,
      category: 'laptops',
      isNew: true,
    },
    {
      id: '2',
      name: 'MacBook Pro M3 Pro (14-inch, 512GB)',
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      price: 1999.0,
      rating: 4.8,
      reviewCount: 1456,
      category: 'laptops',
    },
    {
      id: '3',
      name: 'Dell XPS 13 Plus (Intel i7, 512GB SSD)',
      image:
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop',
      price: 1299.0,
      originalPrice: 1599.0,
      discount: '-19%',
      rating: 4.4,
      reviewCount: 892,
      category: 'laptops',
    },
    {
      id: '4',
      name: 'ASUS ROG Zephyrus G14 (AMD Ryzen 9, RTX 4060)',
      image:
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
      price: 1399.0,
      rating: 4.5,
      reviewCount: 734,
      category: 'laptops',
      isOutOfStock: true,
    },
    {
      id: '5',
      name: 'HP Spectre x360 (Intel i7, 1TB SSD)',
      image:
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
      price: 1199.0,
      originalPrice: 1499.0,
      discount: '-20%',
      rating: 4.3,
      reviewCount: 567,
      category: 'laptops',
    },
    {
      id: '6',
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      image:
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
      price: 1599.0,
      rating: 4.6,
      reviewCount: 445,
      category: 'laptops',
      isNew: true,
    },
    {
      id: '7',
      name: 'Microsoft Surface Laptop 5 (Intel i7, 256GB)',
      image:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      price: 999.0,
      originalPrice: 1299.0,
      discount: '-23%',
      rating: 4.2,
      reviewCount: 623,
      category: 'laptops',
    },
    // ===== MOBILE PHONES SECTION =====
    {
      id: '8',
      name: 'iPhone 15 Pro Max (256GB)',
      image:
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      price: 1199.0,
      originalPrice: 1299.0,
      discount: '-8%',
      rating: 4.8,
      reviewCount: 2340,
      category: 'mobiles',
      isNew: true,
    },
    {
      id: '9',
      name: 'Samsung Galaxy S24 Ultra (512GB)',
      image:
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
      price: 1099.99,
      rating: 4.7,
      reviewCount: 1890,
      category: 'mobiles',
    },
    {
      id: '10',
      name: 'Google Pixel 8 Pro (128GB)',
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      price: 699.0,
      originalPrice: 899.0,
      discount: '-22%',
      rating: 4.5,
      reviewCount: 1245,
      category: 'mobiles',
    },
    {
      id: '11',
      name: 'OnePlus 12 (256GB)',
      image:
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop',
      price: 799.0,
      rating: 4.4,
      reviewCount: 876,
      category: 'mobiles',
      isOutOfStock: true,
    },
    {
      id: '12',
      name: 'Xiaomi 14 Pro (512GB)',
      image:
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop',
      price: 649.99,
      originalPrice: 799.99,
      discount: '-19%',
      rating: 4.3,
      reviewCount: 654,
      category: 'mobiles',
    },
    {
      id: '13',
      name: 'iPhone 14 (128GB)',
      image:
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop',
      price: 599.0,
      originalPrice: 799.0,
      discount: '-25%',
      rating: 4.6,
      reviewCount: 3210,
      category: 'mobiles',
    },
    {
      id: '14',
      name: 'Samsung Galaxy Z Fold 5 (256GB)',
      image:
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&h=300&fit=crop',
      price: 1399.99,
      originalPrice: 1799.99,
      discount: '-22%',
      rating: 4.2,
      reviewCount: 567,
      category: 'mobiles',
      isNew: true,
    },
    // ===== HEADPHONES & AUDIO SECTION =====
    {
      id: '15',
      name: 'Apple AirPods Pro (2nd Generation)',
      image:
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop',
      price: 249.0,
      originalPrice: 279.0,
      discount: '-11%',
      rating: 4.5,
      reviewCount: 1250,
      category: 'headphones',
      isNew: true,
    },
    {
      id: '16',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      image:
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
      price: 349.99,
      rating: 4.8,
      reviewCount: 890,
      category: 'headphones',
    },
    {
      id: '17',
      name: 'Bose QuietComfort Earbuds',
      image:
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      price: 199.0,
      originalPrice: 279.0,
      discount: '-29%',
      rating: 4.3,
      reviewCount: 567,
      category: 'headphones',
    },
    {
      id: '18',
      name: 'Samsung Galaxy Buds2 Pro',
      image:
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
      price: 149.99,
      rating: 4.2,
      reviewCount: 423,
      category: 'headphones',
      isOutOfStock: true,
    },
    {
      id: '19',
      name: 'JBL Live 660NC Wireless Headphones',
      image:
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
      price: 89.95,
      originalPrice: 149.95,
      discount: '-40%',
      rating: 4.1,
      reviewCount: 312,
      category: 'headphones',
    },
    {
      id: '20',
      name: 'Audio-Technica ATH-M50xBT2',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      price: 179.0,
      rating: 4.6,
      reviewCount: 756,
      category: 'headphones',
    },
    {
      id: '21',
      name: 'Sennheiser Momentum 4 Wireless',
      image:
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop',
      price: 299.95,
      originalPrice: 379.95,
      discount: '-21%',
      rating: 4.7,
      reviewCount: 445,
      category: 'headphones',
    },
    // ===== WATCHES & WEARABLES SECTION =====
    {
      id: '22',
      name: "Fanmis Men's Luxury Analog Quartz Gold Wrist Watches",
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      price: 15.92,
      originalPrice: 17.99,
      rating: 4.0,
      reviewCount: 125,
      category: 'watches',
    },
    {
      id: '23',
      name: "Fossil Women's Gen 4 Venture HR Stainless Steel Touchscreen",
      image:
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=300&h=300&fit=crop',
      price: 299.0,
      rating: 4.2,
      reviewCount: 234,
      category: 'watches',
    },
    {
      id: '24',
      name: "Fossil Men's Sport Metal and Silicone Touchscreen",
      image:
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=300&h=300&fit=crop',
      price: 99.0,
      originalPrice: 275.0,
      rating: 4.1,
      reviewCount: 156,
      category: 'watches',
    },
    {
      id: '25',
      name: 'Michael Kors Access Gen 3 Sofie Touchscreen Smartwatch',
      image:
        'https://images.unsplash.com/photo-1617043983671-adaadcaa2460?w=300&h=300&fit=crop',
      price: 299.0,
      rating: 4.3,
      reviewCount: 189,
      category: 'watches',
    },
    {
      id: '26',
      name: 'Apple Watch Series 5 (GPS, 40mm) - Gold Aluminum',
      image:
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&h=300&fit=crop',
      price: 650.0,
      rating: 4.6,
      reviewCount: 1456,
      category: 'watches',
    },
    // ===== CLOTHING & FASHION SECTION =====
    {
      id: '27',
      name: 'Uniqlo Airism Cotton Crew Neck T-Shirt',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      price: 12.9,
      originalPrice: 14.9,
      discount: '-13%',
      rating: 4.3,
      reviewCount: 892,
      category: 'shirts',
    },
    {
      id: '28',
      name: 'Nike Dri-FIT Training T-Shirt',
      image:
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop',
      price: 25.0,
      rating: 4.5,
      reviewCount: 634,
      category: 'shirts',
      isNew: true,
    },
    {
      id: '29',
      name: 'Adidas 3-Stripes Essential T-Shirt',
      image:
        'https://images.unsplash.com/photo-1583743814966-8936f37f13fa?w=300&h=300&fit=crop',
      price: 18.99,
      originalPrice: 24.99,
      discount: '-24%',
      rating: 4.2,
      reviewCount: 456,
      category: 'shirts',
    },
    {
      id: '30',
      name: 'H&M Premium Cotton Polo Shirt',
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop',
      price: 19.99,
      rating: 4.0,
      reviewCount: 278,
      category: 'shirts',
      isOutOfStock: true,
    },
    {
      id: '31',
      name: 'Zara Oversized Cotton T-Shirt',
      image:
        'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&h=300&fit=crop',
      price: 15.95,
      originalPrice: 19.95,
      discount: '-20%',
      rating: 4.1,
      reviewCount: 345,
      category: 'shirts',
    },
    // ===== BACKPACKS & ACCESSORIES SECTION =====
    {
      id: '34',
      name: 'Backpack / School Bag For Teenagers',
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      price: 11.99,
      rating: 4.0,
      reviewCount: 89,
      category: 'backpacks',
    },
    {
      id: '35',
      name: 'Puimentiua Men Backpack Laptop Bag Brand',
      image:
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=300&h=300&fit=crop',
      price: 10.99,
      originalPrice: 14.79,
      rating: 4.2,
      reviewCount: 134,
      category: 'backpacks',
    },
    {
      id: '36',
      name: 'WENYUJH 2019 New Large-capacity Student Schoolbag',
      image:
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=300&fit=crop',
      price: 12.62,
      rating: 3.9,
      reviewCount: 67,
      category: 'backpacks',
    },
    {
      id: '37',
      name: 'Fashion Woman Bag Female Hand Tote Bag',
      image:
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
      price: 12.73,
      originalPrice: 14.98,
      rating: 4.1,
      reviewCount: 98,
      category: 'backpacks',
    },
    {
      id: '38',
      name: 'Women Oxford Backpack For Girls',
      image:
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop',
      price: 13.99,
      rating: 4.3,
      reviewCount: 156,
      category: 'backpacks',
    },
    // ===== TABLETS SECTION =====
    {
      id: '39',
      name: 'iPad Pro 12.9-inch (256GB)',
      image:
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
      price: 1099.0,
      originalPrice: 1199.0,
      discount: '-8%',
      rating: 4.7,
      reviewCount: 1234,
      category: 'tablets',
      isNew: true,
    },
    {
      id: '40',
      name: 'Samsung Galaxy Tab S9 (128GB)',
      image:
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop',
      price: 799.99,
      rating: 4.5,
      reviewCount: 567,
      category: 'tablets',
    },
  ];

  /**
   * MẢNG SHIRTS RIÊNG BIỆT
   * Được tạo để sử dụng riêng trong template, chứa các sản phẩm áo
   * Lưu ý: Đây là duplicate data từ allProducts, có thể tối ưu thêm
   */
  shirts = [
    {
      id: '27',
      name: 'Uniqlo Airism Cotton Crew Neck T-Shirt',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      price: 12.9,
      originalPrice: 14.9,
      discount: '-13%',
      rating: 4.3,
      reviewCount: 892,
      category: 'shirts',
    },
    {
      id: '28',
      name: 'Nike Dri-FIT Training T-Shirt',
      image:
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop',
      price: 25.0,
      rating: 4.5,
      reviewCount: 634,
      category: 'shirts',
      isNew: true,
    },
    {
      id: '29',
      name: 'Adidas 3-Stripes Essential T-Shirt',
      image:
        'https://images.unsplash.com/photo-1583743814966-8936f37f13fa?w=300&h=300&fit=crop',
      price: 18.99,
      originalPrice: 24.99,
      discount: '-24%',
      rating: 4.2,
      reviewCount: 456,
      category: 'shirts',
    },
    {
      id: '30',
      name: 'H&M Premium Cotton Polo Shirt',
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop',
      price: 19.99,
      rating: 4.0,
      reviewCount: 278,
      category: 'shirts',
      isOutOfStock: true,
    },
    {
      id: '31',
      name: 'Zara Oversized Cotton T-Shirt',
      image:
        'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&h=300&fit=crop',
      price: 15.95,
      originalPrice: 19.95,
      discount: '-20%',
      rating: 4.1,
      reviewCount: 345,
      category: 'shirts',
    },
    {
      id: '32',
      name: 'Champion Classic Logo T-Shirt',
      image:
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300&h=300&fit=crop',
      price: 22.0,
      rating: 4.4,
      reviewCount: 567,
      category: 'shirts',
    },
    {
      id: '33',
      name: 'Ralph Lauren Classic Fit Polo',
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop',
      price: 89.5,
      originalPrice: 125.0,
      discount: '-28%',
      rating: 4.6,
      reviewCount: 789,
      category: 'shirts',
      isNew: true,
    },
  ];

  // ===== COMPUTED PROPERTIES & UTILITY METHODS =====

  getProductsByCategory(category: string): Product[] {
    return this.allProducts.filter((product) => product.category === category);
  }

  get filteredProducts(): Product[] {
    return this.getProductsByCategory(this.activeCategory);
  }

  // ===== USER INTERACTION METHODS =====

  selectCategory(categoryId: string): void {
    this.activeCategory = categoryId;
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, index) => index + 1);
  }

  // ===== TRACKING FUNCTIONS FOR PERFORMANCE =====

  trackByCategory(index: number, category: Category): string {
    return category.id;
  }

  trackByProduct(index: number, product: Product): string {
    return product.id.toString();
  }

  trackByItem(index: number, item: BannerItem): string {
    return item.id;
  }

  // ===== BANNER & PROMOTIONAL DATA =====

  bannerItems: BannerItem[] = [
    {
      id: '1',
      title: 'Comfort',
      highlightText: 'Chair',
      description: 'Official Chair',
      image:
        'https://asia.fleetcart.envaysoft.com/storage/media/SnNz5B0YIEGCw1OdLhFJbqF7hfCNc80adaLCdqOE.png',
      backgroundColor: '#f8f9fa',
      textColor: '#6c757d',
      titleColor: '#2c3e50',
    },
    {
      id: '2',
      title: 'Adjust your bedroom with',
      highlightText: 'comfortable',
      description: 'products',
      image:
        'https://asia.fleetcart.envaysoft.com/storage/media/3YFgcINuEaLyLvy6QjxKwKVDMALI9qzmXEN7Vqx3.png',
      backgroundColor: '#ffffff',
      textColor: '#5a6c7d',
      titleColor: '#2c3e50',
    },
    {
      id: '3',
      title: 'Galaxy',
      highlightText: 'S9 | S9+',
      description: 'The reimagined',
      image:
        'https://asia.fleetcart.envaysoft.com/storage/media/pmQxhyWNznFCMZvc4KTv4HNk4RfG3eBlNqR0xsCt.png',
      backgroundColor: '#667eea',
      textColor: '#ffffff',
      titleColor: '#ffffff',
    },
  ];

  // ===== BLOG POSTS DATA =====

  posts: any[] = [
    {
      id: 1,
      title: 'Stories of Satisfaction and Success',
      author: 'Demo Admin',
      date: '09 Aug, 2025',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      excerpt:
        'Discover how our customers achieved their goals through innovative solutions and dedicated support.',
    },
    {
      id: 2,
      title: 'Hear What Our Customers Have to Say',
      author: 'Demo Admin',
      date: '09 Aug, 2025',
      image:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      excerpt:
        'Real testimonials from satisfied customers who have experienced exceptional service and results.',
    },
    {
      id: 3,
      title: 'Real-Life Testimonials from Satisfied Buyers',
      author: 'Demo Admin',
      date: '09 Aug, 2025',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
      excerpt:
        'Authentic stories from buyers who found exactly what they were looking for and more.',
    },
    {
      id: 4,
      title: 'Key Trends Set to Dominate the E-commerce Landscape',
      author: 'Demo Admin',
      date: '09 Aug, 2025',
      image:
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop',
      excerpt:
        'Explore the emerging trends that are reshaping the future of online commerce and digital business.',
    },
    {
      id: 5,
      title: "What's Driving the Evolution of E-commerce?",
      author: 'Demo Admin',
      date: '09 Aug, 2025',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      excerpt:
        'An in-depth analysis of the factors and technologies transforming the e-commerce industry.',
    },
  ];

  trackByPostId(index: number, post: any): number {
    return post.id;
  }

  // ===== NEWSLETTER SUBSCRIPTION PROPERTIES =====

  email: string = '';
  emailError: string = '';
  successMessage: string = '';
  isSubscribing: boolean = false;

  // ===== FOOTER TAGS DATA =====

  tags: string[] = [
    'Accessories',
    'Electronics',
    'Entertainment',
    'Fashion',
    'Gadgets',
    'Hot deals',
    'Lifestyle',
    'Smartphone',
  ];

  // ===== LIFECYCLE HOOKS =====

  constructor() {}

  ngOnInit(): void {
    this.accessToken = localStorage.getItem('accessToken');
  }

  // ===== NEWSLETTER SUBSCRIPTION METHODS =====

  onSubscribe(): void {
    // Reset messages
    this.emailError = '';
    this.successMessage = '';

    // Validation: Check if email is provided
    if (!this.email) {
      this.emailError = 'Email address is required';
      return;
    }

    // Validation: Check email format
    if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }

    // Set loading state
    this.isSubscribing = true;

    setTimeout(() => {
      this.isSubscribing = false;
      this.successMessage = 'Thank you for subscribing to our newsletter!';
      this.email = '';
    }, 1500);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ===== UTILITY METHODS =====

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.accessToken = null;
    window.location.reload();
  }
}
