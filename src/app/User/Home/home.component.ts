import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

//
// ==========================
// INTERFACE ĐỊNH NGHĨA DỮ LIỆU - CODE CŨ
// ==========================
//

/**
 * Interface cho tùy chọn ngôn ngữ
 */
interface Language {
  code: string;
  name: string;
  url?: string;
}

/**
 * Interface cho tùy chọn tiền tệ
 */
interface Currency {
  code: string;
  name: string;
  url?: string;
}

/**
 * Interface cho thông tin sản phẩm
 */
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  reviewCount?: number; // Thêm thuộc tính này cho phần showcase
  status?: string;
  isNew?: boolean;
  isOutOfStock?: boolean; // Thêm thuộc tính này cho phần showcase
  badge?: string;
}

/**
 * Interface cho danh mục sản phẩm
 */
interface Category {
  id: number;
  name: string;
  icon: string;
  hasSubcategories?: boolean;
  image?: string;
  backgroundColor?: string;
  isSelected?: boolean;
  selected?: boolean;
  isActive?: boolean; // Thêm thuộc tính này cho phần showcase
}

/**
 * Interface cho tính năng dịch vụ
 */
interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

/**
 * Interface cho liên kết
 */
interface LinkItem {
  name: string;
  url: string;
}

/**
 * Interface cho thẻ tag
 */
interface Tag {
  name: string;
  icon: string;
}

/**
 * Interface cho liên kết mạng xã hội
 */
interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

/**
 * Interface cho thông tin liên hệ
 */
interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

//
// ==========================
// COMPONENT CHÍNH - HOME (ĐÃ ĐƯỢC GỘP)
// ==========================
//

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  //
  // ==========================
  // BIẾN TRẠNG THÁI CHO DROPDOWN - CODE CŨ
  // ==========================
  //

  // Trạng thái mở/đóng dropdown ngôn ngữ
  isLanguageOpen = false;
  // Trạng thái mở/đóng dropdown tiền tệ
  isCurrencyOpen = false;
  // Ngôn ngữ được chọn hiện tại
  selectedLanguage = 'English';
  // Tiền tệ được chọn hiện tại
  selectedCurrency = 'USD';

  //
  // ==========================
  // DỮ LIỆU DROPDOWN - CODE CŨ
  // ==========================
  //

  // Danh sách các ngôn ngữ có sẵn
  languages: Language[] = [
    { code: 'en', name: 'English', url: '/en' },
    { code: 'ar', name: 'Arabic', url: '/ar' }
  ];

  // Danh sách các loại tiền tệ có sẵn
  currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', url: '/current-currency/USD' },
    { code: 'BDT', name: 'Bangladeshi Taka', url: '/current-currency/BDT' },
    { code: 'INR', name: 'Indian Rupee', url: '/current-currency/INR' },
    { code: 'NGN', name: 'Nigerian Naira', url: '/current-currency/NGN' },
    { code: 'SAR', name: 'Saudi Riyal', url: '/current-currency/SAR' },
    { code: 'UYU', name: 'Uruguayan Peso', url: '/current-currency/UYU' }
  ];

  //
  // ==========================
  // DỮ LIỆU TRANG CHÍNH - CODE CŨ
  // ==========================
  //

  // Danh sách categories chính cho sidebar
  categories: Category[] = [
    { id: 1, name: 'Consumer Electronics', icon: 'devices', hasSubcategories: true, backgroundColor: '#f8f9fa', isSelected: true },
    { id: 2, name: 'Televisions', icon: 'tv', backgroundColor: '#ffffff' },
    { id: 3, name: 'Watches', icon: 'watch', backgroundColor: '#ffffff' },
    { id: 4, name: 'Fashion', icon: 'checkroom', hasSubcategories: true, backgroundColor: '#ffffff' },
    { id: 5, name: 'Backpacks', icon: 'backpack', backgroundColor: '#ffffff' },
    { id: 6, name: 'Tablets', icon: 'tablet', backgroundColor: '#ffffff' },
    { id: 7, name: 'Headphones', icon: 'headphones', backgroundColor: '#ffffff' },
    { id: 8, name: 'Hot Sale', icon: 'local_fire_department', backgroundColor: '#ffffff' },
    { id: 9, name: 'Shoes', icon: 'footwear', backgroundColor: '#ffffff' },
    { id: 10, name: 'All Categories', icon: 'category', backgroundColor: '#ffffff' }
  ];

  // Danh sách sản phẩm nổi bật cho slider
  featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Uniq Leather Bags',
      description: 'Premium quality leather bags',
      price: 79,
      originalPrice: 150,
      discount: 'Starting: $79',
      image: '/api/placeholder/300/200',
      category: 'Fashion'
    },
    {
      id: 2,
      name: 'iPhone 6+ 32GB',
      description: 'Apple iPhone with 32GB storage',
      price: 599,
      originalPrice: 799,
      discount: 'Up to 50% Off',
      image: '/api/placeholder/300/200',
      category: 'Electronics'
    }
  ];

  // Sản phẩm chính hiển thị lớn
  mainProduct: Product = {
    id: 1,
    name: 'DJI MAVIC PRO',
    description: 'The creative\'s shop for flying cameras and flight controllers',
    price: 1299,
    image: '/api/placeholder/600/400',
    category: 'Drones'
  };

  // Danh sách tính năng dịch vụ
  serviceFeatures: ServiceFeature[] = [
    { icon: 'headset_mic', title: '24/7 SUPPORT', description: 'Support every time', color: '#3498db' },
    { icon: 'credit_card', title: 'ACCEPT PAYMENT', description: 'Visa, Paypal, Master', color: '#3498db' },
    { icon: 'security', title: 'SECURED PAYMENT', description: '100% secured', color: '#3498db' },
    { icon: 'local_shipping', title: 'FREE SHIPPING', description: 'Order over $100', color: '#3498db' },
    { icon: 'assignment_return', title: '30 DAYS RETURN', description: '30 days guarantee', color: '#3498db' }
  ];

  //
  // ==========================
  // DỮ LIỆU CHO PRODUCT SHOWCASE - CODE MỚI ĐƯỢC GỘP
  // ==========================
  //

  // Danh sách categories cho showcase (khác với categories chính)
  showcaseCategories: Category[] = [
    { id: 1, name: 'Laptops', icon: 'laptop_mac', selected: true, isActive: true },
    { id: 2, name: 'Mobiles', icon: 'phone_android', selected: false, isActive: false },
    { id: 3, name: 'Tablets', icon: 'tablet_mac', selected: false, isActive: false },
    { id: 4, name: 'Watches', icon: 'watch', selected: false, isActive: false },
    { id: 5, name: "Men's Fashion", icon: 'accessibility', selected: false, isActive: false },
    { id: 6, name: 'Televisions', icon: 'tv', selected: false, isActive: false }
  ];

  // Danh sách sản phẩm showcase với đầy đủ thông tin
  showcaseProducts: Product[] = [
    {
      id: 101,
      name: 'Apple 2023 iMac (24-inch)',
      description: 'M1 chip with 8-core CPU and 7-core GPU',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
      price: 1349.00,
      rating: 0,
      reviewCount: 0,
      status: '',
      category: 'Laptops'
    },
    {
      id: 102,
      name: 'Apple 2023 MacBook Pro (14-inch)',
      description: 'M2 Pro chip with 10-core CPU',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop',
      price: 1499.00,
      rating: 0,
      reviewCount: 0,
      status: '',
      category: 'Laptops'
    },
    {
      id: 103,
      name: 'MSI Gaming Core i7 8Th Gen 15.6-inch Gaming Laptop',
      description: 'High performance gaming laptop',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=200&fit=crop',
      price: 760.00,
      rating: 0,
      reviewCount: 0,
      status: 'Out of Stock',
      isOutOfStock: true,
      category: 'Laptops'
    },
    {
      id: 104,
      name: 'New Apple Mac Mini (3.6GHz Quad-core 8th-generation)',
      description: 'Compact desktop computer',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop',
      price: 759.00,
      rating: 0,
      reviewCount: 0,
      status: '',
      category: 'Laptops'
    },
    {
      id: 105,
      name: 'LG gram Laptop - 13.3" Full HD Display, Intel 8th Gen',
      description: 'Ultra-lightweight laptop',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
      price: 2135.54,
      originalPrice: 2425.75,
      discount: '-12%',
      rating: 0,
      reviewCount: 0,
      status: '',
      isNew: true,
      category: 'Laptops'
    },
    {
      id: 106,
      name: 'Razer Blade Stealth 13.3" QHD+ Intel Quad-Core',
      description: 'Premium ultrabook',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=200&fit=crop',
      price: 1199.77,
      rating: 0,
      reviewCount: 0,
      status: '',
      isNew: true,
      category: 'Laptops'
    },
    {
      id: 107,
      name: 'Razer Blade - Worlds Smallest 15.6in Gaming Laptop',
      description: 'Compact gaming powerhouse',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop',
      price: 1500.00,
      originalPrice: 1800.00,
      discount: '-12%',
      rating: 0,
      reviewCount: 0,
      status: '',
      category: 'Laptops'
    }
  ];

  //
  // ==========================
  // DỮ LIỆU FOOTER - CODE CŨ
  // ==========================
  //

  // Email để đăng ký newsletter
  email: string = '';

  // Danh sách liên kết mạng xã hội
  socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'Twitter', icon: 'close', url: '#' },
    { name: 'Instagram', icon: 'camera_alt', url: '#' },
    { name: 'YouTube', icon: 'play_circle_outline', url: '#' }
  ];

  // Thông tin liên hệ
  contactInfo: ContactInfo = {
    phone: '+99012345678',
    email: 'admin@email.com',
    address: 'Dhaka, Mohammadpur'
  };

  // Các liên kết tài khoản
  accountLinks: LinkItem[] = [
    { name: 'Dashboard', url: '#' },
    { name: 'My Orders', url: '#' },
    { name: 'My Reviews', url: '#' },
    { name: 'My Profile', url: '#' }
  ];

  // Các liên kết dịch vụ
  serviceLinks: LinkItem[] = [
    { name: 'Return Policy', url: '#' },
    { name: 'FAQ', url: '#' },
    { name: 'Privacy & Policy', url: '#' },
    { name: 'Terms Of Use', url: '#' }
  ];

  // Các liên kết thông tin
  informationLinks: LinkItem[] = [
    { name: 'New Arrivals', url: '#' },
    { name: 'Specials', url: '#' },
    { name: 'Hot Deals', url: '#' },
    { name: 'Backpacks', url: '#' },
    { name: 'Men\'s Fashion', url: '#' }
  ];

  // Danh sách thẻ tag
  tags: Tag[] = [
    { name: 'Accessories', icon: 'shopping_bag' },
    { name: 'Electronics', icon: 'devices' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Fashion', icon: 'checkroom' },
    { name: 'Gadgets', icon: 'phone_android' },
    { name: 'Hot deals', icon: 'local_fire_department' },
    { name: 'Lifestyle', icon: 'favorite' },
    { name: 'Smartphone', icon: 'smartphone' }
  ];

  // Danh sách phương thức thanh toán
  paymentMethods: string[] = [
    'Visa', 'MasterCard', 'PayPal', 'American Express', 'Maestro', 'Discover'
  ];

  //
  // ==========================
  // BIẾN TRẠNG THÁI KHÁC - CODE CŨ
  // ==========================
  //

  // Trạng thái menu mobile
  isMobileMenuOpen = false;
  // Slide hiện tại của carousel
  currentSlide = 0;

  //
  // ==========================
  // HÀM XỬ LÝ DROPDOWN - CODE CŨ
  // ==========================
  //

  // Bật/tắt dropdown ngôn ngữ
  toggleLanguageDropdown(): void {
    this.isLanguageOpen = !this.isLanguageOpen;
    if (this.isLanguageOpen) this.isCurrencyOpen = false;
  }

  // Bật/tắt dropdown tiền tệ
  toggleCurrencyDropdown(): void {
    this.isCurrencyOpen = !this.isCurrencyOpen;
    if (this.isCurrencyOpen) this.isLanguageOpen = false;
  }

  // Chọn ngôn ngữ từ dropdown
  selectLanguage(language: Language): void {
    this.selectedLanguage = language.name;
    this.isLanguageOpen = false;
    console.log(`Language changed to: ${language.name} (${language.code})`);
  }

  // Chọn tiền tệ từ dropdown
  selectCurrency(currency: Currency): void {
    this.selectedCurrency = currency.code;
    this.isCurrencyOpen = false;
    console.log(`Currency changed to: ${currency.code}`);
  }

  // Lắng nghe sự kiện click bên ngoài để đóng dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) this.closeAllDropdowns();
  }


  // Đóng tất cả dropdown
  private closeAllDropdowns(): void {
    this.isLanguageOpen = false;
    this.isCurrencyOpen = false;
  }

  // Đóng dropdown ngôn ngữ
  closeLanguageDropdown(): void {
    this.isLanguageOpen = false;
  }

  // Đóng dropdown tiền tệ
  closeCurrencyDropdown(): void {
    this.isCurrencyOpen = false;
  }

  //
  // ==========================
  // HÀM XỬ LÝ CHUNG - CODE CŨ
  // ==========================
  //

  // Bật/tắt menu mobile
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Xử lý tìm kiếm
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log('Searching for:', searchTerm);
  }

  // Xử lý click vào category chính
  onCategoryClick(category: Category): void {
    this.categories.forEach(cat => cat.isSelected = false);
    category.isSelected = true;
    console.log('Category clicked:', category.name);
  }

  // Xử lý hover vào category
  onCategoryHover(category: Category): void {
    console.log('Category hovered:', category.name);
  }

  // Xử lý click vào sản phẩm
  onProductClick(product: Product): void {
    console.log('Product clicked:', product.name);
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product): void {
    console.log('Added to cart:', product.name);
  }

  // Thêm sản phẩm vào danh sách yêu thích
  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
  }

  // Chuyển đến slide tiếp theo
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredProducts.length;
  }

  // Chuyển đến slide trước đó
  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.featuredProducts.length - 1 : this.currentSlide - 1;
  }

  // Chuyển đến slide cụ thể
  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Thay đổi ngôn ngữ
  changeLanguage(language: string): void {
    console.log('Language changed to:', language);
  }

  // Thay đổi tiền tệ
  changeCurrency(currency: string): void {
    console.log('Currency changed to:', currency);
  }

  // Xử lý hành động xác thực
  onAuthAction(action: string): void {
    console.log('Auth action:', action);
  }

  // Đăng ký newsletter
  onSubscribe(): void {
    if (this.email && this.validateEmail(this.email)) {
      console.log('Subscribing email:', this.email);
      alert('Thank you for subscribing!');
      this.email = '';
    } else {
      alert('Please enter a valid email address');
    }
  }

  // Kiểm tra tính hợp lệ của email
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Xử lý click vào liên kết mạng xã hội
  onSocialClick(name: string, url: string): void {
    console.log(`Navigating to ${name}:`, url);
  }

  // Xử lý click vào liên kết
  onLinkClick(name: string, url: string): void {
    console.log(`Navigating to ${name}:`, url);
  }

  // Xử lý click vào tag
  onTagClick(name: string): void {
    console.log(`Filtering by tag:`, name);
  }

  // Cuộn lên đầu trang
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //
  // ==========================
  // HÀM XỬ LÝ CHO PRODUCT SHOWCASE - CODE MỚI ĐƯỢC GỘP
  // ==========================
  //

  // Xử lý khi click vào showcase category
  onShowcaseCategoryClick(selectedCategory: Category): void {
    // Reset tất cả showcase categories
    this.showcaseCategories.forEach(category => {
      category.selected = category.id === selectedCategory.id;
      category.isActive = category.id === selectedCategory.id;
    });
    console.log('Showcase category selected:', selectedCategory.name);

    // Có thể thêm logic filter sản phẩm theo category
    this.filterProductsByCategory(selectedCategory.name);
  }

  // Xử lý khi click vào nút add to cart trong showcase
  onShowcaseAddToCart(product: Product): void {
    if (product.status === 'Out of Stock' || product.isOutOfStock) {
      console.log('Cannot add out of stock product:', product.name);
      alert('This product is out of stock!');
      return;
    }
    console.log('Added showcase product to cart:', product.name);
    // Gọi lại hàm addToCart chung
    this.addToCart(product);
  }

  // Xử lý khi click vào nút view details trong showcase
  onShowcaseViewDetails(product: Product): void {
    console.log('View showcase product details:', product.name);
    // Logic xem chi tiết sản phẩm
    this.onProductClick(product);
  }

  // Hàm tương thích với code cũ - xử lý click category showcase
  onCategoryClick_Showcase(category: Category): void {
    this.onShowcaseCategoryClick(category);
  }

  // Hàm tương thích với code cũ - xử lý add to cart showcase
  onAddToCart_Showcase(product: Product): void {
    this.onShowcaseAddToCart(product);
  }

  // Hàm tương thích với code cũ - xử lý view details showcase
  onViewDetails_Showcase(product: Product): void {
    this.onShowcaseViewDetails(product);
  }

  // Tạo array stars để hiển thị rating
  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  // Format giá tiền với currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.selectedCurrency || 'USD'
    }).format(price);
  }

  // Filter sản phẩm theo category
  private filterProductsByCategory(categoryName: string): void {
    console.log('Filtering products by category:', categoryName);
    // Logic filter sản phẩm nếu cần
    // Ví dụ: this.showcaseProducts = this.showcaseProducts.filter(p => p.category === categoryName);
  }

  //
  // ==========================
  // TRACKBY FUNCTIONS - TỐI ƯU *ngFor
  // ==========================
  //

  // TrackBy cho service features
  trackByServiceFeature(index: number, feature: ServiceFeature): string {
    return feature.title;
  }

  // TrackBy cho categories chính
  trackByCategory(index: number, category: Category): number {
    return category.id;
  }

  // TrackBy cho showcase categories
  trackByShowcaseCategory(index: number, category: Category): number {
    return category.id;
  }

  // TrackBy cho showcase products
  trackByShowcaseProduct(index: number, product: Product): number {
    return product.id;
  }

  // TrackBy cho featured products
  trackByFeaturedProduct(index: number, product: Product): number {
    return product.id;
  }

  // TrackBy cho social links
  trackBySocialLink(index: number, link: SocialLink): string {
    return link.name;
  }

  // TrackBy cho tags
  trackByTag(index: number, tag: Tag): string {
    return tag.name;
  }

  // TrackBy cho links
  trackByLink(index: number, link: LinkItem): string {
    return link.name;
  }
}