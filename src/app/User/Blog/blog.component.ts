import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: Date;
  author: string;
}

interface Category {
  name: string;
  count: number;
}

interface RecentPost {
  title: string;
  image: string;
  date: Date;
}

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ]
})
export class BlogComponent implements OnInit {

  // Mobile menu state
  isMobileMenuOpen: boolean = false;
  isMobileSearchOpen: boolean = false;
  isMobile: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  // Blog posts data
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Stories of satisfaction and success',
      excerpt: 'Discover how our customers achieve amazing results with our products and services.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-05-15'),
      author: 'Admin'
    },
    {
      id: 2,
      title: 'Hear What Our Customers Have to Say',
      excerpt: 'Real testimonials from real customers who love our products and exceptional service.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ab8a7b7f2?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-05-10'),
      author: 'Admin'
    },
    {
      id: 3,
      title: 'Buy Directly from Satisfied Buyers',
      excerpt: 'Connect with previous customers and get authentic feedback before making your purchase.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-05-08'),
      author: 'Admin'
    },
    {
      id: 4,
      title: 'Key Trends Set to Dominate the E-commerce Landscape',
      excerpt: 'Stay ahead of the curve with insights into the latest e-commerce trends and innovations.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      category: 'Ecommerce Admin',
      date: new Date('2024-05-05'),
      author: 'Admin'
    },
    {
      id: 5,
      title: "What's Driving the Evolution of E-commerce?",
      excerpt: 'Explore the technological and market forces reshaping online retail and digital commerce.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-05-01'),
      author: 'Admin'
    },
    {
      id: 6,
      title: 'The Top E-commerce Trends Shaping the Future of Online Sales',
      excerpt: 'Discover emerging trends that will define the next generation of e-commerce platforms.',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-04-28'),
      author: 'Admin'
    },
    {
      id: 7,
      title: 'Shop the Best Deals of the Season with Our Promotional Offers',
      excerpt: 'Take advantage of exclusive seasonal promotions and limited-time offers on top products.',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-04-25'),
      author: 'Admin'
    },
    {
      id: 8,
      title: 'Hurry, Grab Your Favorite Products Before They\'re All Gone!',
      excerpt: 'Limited stock alert! Don\'t miss out on these popular items flying off our shelves.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=250&fit=crop',
      category: 'Ecommerce Admin',
      date: new Date('2024-04-20'),
      author: 'Admin'
    },
    {
      id: 9,
      title: 'The Best Promo Codes and Offers You Don\'t Want to Miss',
      excerpt: 'Unlock exclusive savings with our curated collection of the best promotional codes available.',
      image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-04-18'),
      author: 'Admin'
    },
    {
      id: 10,
      title: 'Unbeatable Discounts for a Limited Time Only!',
      excerpt: 'Act fast to secure incredible discounts on premium products before the offer expires.',
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=250&fit=crop',
      category: 'Business Admin',
      date: new Date('2024-04-15'),
      author: 'Admin'
    },
    {
      id: 11,
      title: 'Fashion Trends for the Modern Professional',
      excerpt: 'Elevate your professional wardrobe with the latest fashion trends and styling tips.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
      category: 'Fashion',
      date: new Date('2024-04-12'),
      author: 'Admin'
    },
    {
      id: 12,
      title: 'Top Electronics Brands to Watch in 2024',
      excerpt: 'Discover the electronics brands that are making waves with innovative products and technology.',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=250&fit=crop',
      category: 'Electronics',
      date: new Date('2024-04-10'),
      author: 'Admin'
    }
  ];

  // Categories data
  categories: Category[] = [
    { name: 'Fashion', count: 6 },
    { name: 'Brands', count: 4 },
    { name: 'Electronics', count: 8 },
    { name: 'Company Updates', count: 3 },
    { name: 'Clothes & Footwear', count: 7 },
    { name: 'Shopping Tips', count: 5 },
    { name: 'News', count: 9 },
    { name: 'Business Admin', count: 8 },
    { name: 'Ecommerce Admin', count: 2 }
  ];

  // Recent posts data
  recentPosts: RecentPost[] = [
    {
      title: 'Stories of satisfaction and success',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop',
      date: new Date('2024-05-15')
    },
    {
      title: 'Hear What Our Customers Have to Say',
      image: 'https://images.unsplash.com/photo-1560472354-b33ab8a7b7f2?w=80&h=80&fit=crop',
      date: new Date('2024-05-10')
    },
    {
      title: 'Buy Directly from Satisfied Buyers',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
      date: new Date('2024-05-08')
    },
    {
      title: 'Key Trends Set to Dominate the E-commerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=80&fit=crop',
      date: new Date('2024-05-05')
    },
    {
      title: 'What\'s Driving the Evolution of E-commerce?',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=80&fit=crop',
      date: new Date('2024-05-01')
    }
  ];

  // Popular tags
  popularTags: string[] = [
    'E-commerce',
    'Business',
    'Technology',
    'Fashion',
    'Electronics',
    'Shopping',
    'Trends',
    'Marketing',
    'Online Store',
    'Customer Service'
  ];

  // Component state variables
  displayedPosts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];

  // Search and filter variables
  productSearchQuery: string = '';
  blogSearchQuery: string = '';
  selectedCategory: string = '';
  selectedTag: string = '';

  // Pagination variables
  currentPage: number = 1;
  postsPerPage: number = 6;
  totalPages: number = 1;

  // Loading state
  isLoading: boolean = false;

  // Newsletter
  newsletterEmail: string = '';

  // Cart and wishlist
  cartCount: number = 0;

  ngOnInit(): void {
    this.initializeBlog();
    this.checkScreenSize();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
      this.isMobileSearchOpen = false;
    }
  }

  // Check if screen is mobile size
  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
      console.log('Is mobile:', this.isMobile);
    }
  }

  // Mobile menu toggle
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isMobileSearchOpen = false;
    }
  }

  // Mobile search toggle
  toggleMobileSearch(): void {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
    if (this.isMobileSearchOpen) {
      this.isMobileMenuOpen = false;
      // Focus on search input after animation
      setTimeout(() => {
        const searchInput = document.querySelector('.mobile-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    }
  }

  // Close mobile menu when clicking on a nav item
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Initialize blog data
  initializeBlog(): void {
    this.filteredPosts = [...this.blogPosts];
    this.calculatePagination();
    this.updateDisplayedPosts();
  }

  // Calculate pagination
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  // Update displayed posts based on current page
  updateDisplayedPosts(): void {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.displayedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  // Search functionality
  searchProducts(query: string): void {
    if (query.trim()) {
      console.log('Searching products for:', query);
      // Implement product search logic here
    }
  }

  searchBlog(query: string): void {
    this.isLoading = true;

    setTimeout(() => {
      if (query.trim()) {
        this.filteredPosts = this.blogPosts.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.category.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        this.filteredPosts = [...this.blogPosts];
      }

      this.currentPage = 1;
      this.calculatePagination();
      this.updateDisplayedPosts();
      this.isLoading = false;
    }, 500);
  }

  // Category filtering
  filterByCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }

  filterByBlogCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }

  // Tag filtering
  filterByTag(tag: string): void {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.blogSearchQuery = this.selectedTag;
    this.searchBlog(this.selectedTag);
  }

  // Apply all filters
  applyFilters(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.filteredPosts = this.blogPosts.filter(post => {
        const matchesCategory = !this.selectedCategory || post.category === this.selectedCategory;
        const matchesSearch = !this.blogSearchQuery ||
          post.title.toLowerCase().includes(this.blogSearchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(this.blogSearchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      });

      this.currentPage = 1;
      this.calculatePagination();
      this.updateDisplayedPosts();
      this.isLoading = false;
    }, 300);
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedPosts();

      // Scroll to top of blog section
      document.querySelector('.blog-header')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, this.currentPage - halfVisible);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  // Post actions
  readPost(postId: number): void {
    console.log('Reading post with ID:', postId);
    // Implement navigation to full post
  }

  readRecentPost(postTitle: string): void {
    console.log('Reading recent post:', postTitle);
    // Implement navigation to full post
  }

  // Header actions
  showAllCategories(): void {
    console.log('Showing all categories');
    // Implement categories dropdown/modal
  }

  toggleWishlist(): void {
    console.log('Toggling wishlist');
    // Implement wishlist functionality
  }

  openCart(): void {
    console.log('Opening cart');
    // Implement cart functionality
  }

  openProfile(): void {
    console.log('Opening profile');
    // Implement profile functionality
  }

  // Newsletter subscription
  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      console.log('Subscribing email:', this.newsletterEmail);
      // Implement newsletter subscription

      // Show success message (you can implement a toast/snackbar here)
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    }
  }

  // Helper methods
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // TrackBy functions for performance optimization
  trackByPostId(index: number, post: BlogPost): number {
    return post.id;
  }

  trackByRecentPostTitle(index: number, post: RecentPost): string {
    return post.title;
  }

  trackByCategoryName(index: number, category: Category): string {
    return category.name;
  }

  trackByTagName(index: number, tag: string): string {
    return tag;
  }
}
