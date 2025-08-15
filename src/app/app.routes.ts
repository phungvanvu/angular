import { Routes } from '@angular/router';
import { LayoutComponent } from './admin/components/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { CreatProductComponent } from './Product/creat_product/creat_product.component';
import { ProductComponent } from './Product/product.component';
import { BrandsComponent } from './Brand/brands.component';
import { CreatBrandsComponent } from './Brand/creat_brand/creat_brand.component';
import { CreateImageComponent } from './admin/components/upload/create_image.component';
import { VariationsComponent } from './Variation/variation.component';
import { CreateVariationComponent } from './Variation/create_variation/create_variation.component';
import { LoginComponent } from './Login/login.component';
import { HomeComponent } from './User/Home/home.component';
import { BlogComponent } from './User/Blog/blog.component';
import { ProductDetailComponent } from './User/Detailproduct/detailproduct.component';
import { FashionComponent } from './User/Menfashion/fashion.component';
import { ShopComponent } from './User/Shop/shop.component';
import { CheckoutComponent } from './User/Order/CheckOut/checkout.component';
import { OrderCompleteComponent } from './User/Order/OrderComplete/order-complete.component';
import { CategoryComponent } from './Category/category.component';

export const routes: Routes = [
  //User
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'blog', component: BlogComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'fashion-shop', component: FashionComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders/:id', component: OrderCompleteComponent },

  //Login
  { path: 'login', component: LoginComponent },
  //Admin
  {
    path: 'app-layout',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // Products
      { path: 'admin-products-create', component: CreatProductComponent },
      { path: 'edit-product/:id', component: CreatProductComponent },
      { path: 'app-products', component: ProductComponent },

      // Brands
      { path: 'app-brands', component: BrandsComponent },
      { path: 'app-create-brands', component: CreatBrandsComponent },

      // Upload
      { path: 'create_image', component: CreateImageComponent },

      // Variations
      { path: 'variations', component: VariationsComponent },
      { path: 'create_variation', component: CreateVariationComponent },
      // Category
      { path: 'category', component: CategoryComponent },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
