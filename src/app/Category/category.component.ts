import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from './category.service';

@Component({
  selector: 'category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  categories: Category[] = [];

  formData = {
    id: null as number | null,
    name: '',
    searchable: false,
    status: false,
    imageUrl: ''
  };

  activeTab: 'general' | 'image' = 'general';
  isExistingCategory = false;
  currentCategory: Category | null = null;
  parentIdForNewCategory: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any[]) => {
        const normalized = this.normalizeData(data);
        this.categories = this.buildTree(normalized);
      },
      error: (err) => console.error('Lỗi khi tải danh mục:', err)
    });
  }

  private normalizeData(raw: any[]): Category[] {
    const nameToId = new Map<string, number>();

    raw.forEach(item => {
      if (!nameToId.has(item.name)) {
        nameToId.set(item.name, item.id);
      }
    });

    return raw.map(item => {
      const parentId = item.parent ? nameToId.get(item.parent) ?? null : null;
      return {
        id: item.id,
        name: item.name,
        parentId,
        isOpen: false,
        children: [],
        isActive: item.isActive,
        searchable: item.searchable ?? false,
        imageUrl: item.imageUrl ?? ''
      };
    });
  }

  private buildTree(flatList: Category[]): Category[] {
    const idMap = new Map<number, Category>();
    const tree: Category[] = [];

    for (const item of flatList) {
      item.children = [];
      idMap.set(item.id, item);
    }

    for (const item of flatList) {
      if (item.parentId && idMap.has(item.parentId)) {
        idMap.get(item.parentId)!.children!.push(item);
      } else {
        tree.push(item);
      }
    }

    return tree;
  }

  toggleCategory(category: Category): void {
    category.isOpen = !category.isOpen;
  }

  selectCategory(category: Category): void {
    this.isExistingCategory = true;
    this.currentCategory = category;
    this.formData.id = category.id;
    this.formData.name = category.name;
    this.formData.status = category.isActive ?? false;
    this.formData.searchable = category.searchable ?? false;
    this.parentIdForNewCategory = null;
  }

  collapseAll(event: Event): void {
    event.preventDefault();
    this.traverseCategories(this.categories, c => c.isOpen = false);
  }

  expandAll(event: Event): void {
    event.preventDefault();
    this.traverseCategories(this.categories, c => c.isOpen = true);
  }

  private traverseCategories(categories: Category[], callback: (c: Category) => void): void {
    for (const category of categories) {
      callback(category);
      if (category.children?.length) {
        this.traverseCategories(category.children, callback);
      }
    }
  }

  addRootCategory(): void {
    this.isExistingCategory = false;
    this.currentCategory = null;
    this.parentIdForNewCategory = null;
    this.formData = { id: null, name: '', searchable: false, status: false, imageUrl: '' };
  }

  addSubcategory(): void {
    if (!this.currentCategory) {
      alert('Hãy chọn một danh mục trước khi thêm danh mục con.');
      return;
    }
    this.isExistingCategory = false;
    this.formData = { id: null, name: '', searchable: false, status: false, imageUrl: '' };
    this.parentIdForNewCategory = this.currentCategory.id;
  }

  saveCategory(): void {
    if (this.isExistingCategory && this.formData.id) {
      // Update category
      this.categoryService.updateCategory(this.formData.id, {
        ...this.formData,
        parentId: null
      }).subscribe({
        next: () => {
          // Cập nhật ngay trên UI
          if (this.currentCategory) {
            this.currentCategory.name = this.formData.name;
            this.currentCategory.isActive = this.formData.status;
            this.currentCategory.searchable = this.formData.searchable;
            this.currentCategory.imageUrl = this.formData.imageUrl;
          }
          alert('Cập nhật thành công!');
        },
        error: (err) => console.error('Lỗi update:', err)
      });
    } else {
      // Create category
      this.categoryService.createCategory({
        ...this.formData,
        parentId: this.parentIdForNewCategory
      }).subscribe({
        next: (newCategory: Category) => {
          // Thêm ngay vào UI
          newCategory.children = [];
          if (this.parentIdForNewCategory) {
            const parent = this.findCategoryById(this.parentIdForNewCategory);
            parent?.children?.push(newCategory);
          } else {
            this.categories.push(newCategory);
          }
          alert('Thêm mới thành công!');
        },
        error: (err) => console.error('Lỗi create:', err)
      });
    }
  }

  deleteCategory(): void {
    if (this.formData.id && confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(this.formData.id).subscribe({
        next: () => {
          // Xóa ngay khỏi UI
          this.removeCategoryById(this.formData.id!);
          this.isExistingCategory = false;
          alert('Xóa thành công!');
        },
        error: (err) => console.error('Lỗi delete:', err)
      });
    }
  }

  private findCategoryById(id: number, list: Category[] = this.categories): Category | null {
    for (const c of list) {
      if (c.id === id) return c;
      const found = this.findCategoryById(id, c.children || []);
      if (found) return found;
    }
    return null;
  }

  private removeCategoryById(id: number, list: Category[] = this.categories): boolean {
    const index = list.findIndex(c => c.id === id);
    if (index > -1) {
      list.splice(index, 1);
      return true;
    }
    for (const c of list) {
      if (this.removeCategoryById(id, c.children || [])) return true;
    }
    return false;
  }

  setActiveTab(tab: 'general' | 'image'): void {
    this.activeTab = tab;
  }
}
