import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ColumnConfig {
  field: string;
  header: string;
  type?: string;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css'],
})
export class GenericTableComponent {
  @Input() title: string = '';
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() templates: { [key: string]: TemplateRef<any> } = {};
  @Input() loading: boolean = false;
  @Input() selectedIds: number[] = [];
  @Input() keyword: string = '';
  @Input() showDeleteButton: boolean = false;
  @Input() showCreateButton: boolean = true;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];

  pageSize: number = 10;

  private _pagination: {
    page: number;
    size: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  } | null = null;

  @Input()
  set pagination(value: typeof this._pagination) {
    this._pagination = value;
    if (value && typeof value.size === 'number') {
      this.pageSize = value.size;
    }
  }

  get pagination() {
    return this._pagination;
  }

  @Output() rowSelect = new EventEmitter<{ id: number; selected: boolean }>();
  @Output() selectAll = new EventEmitter<boolean>();
  @Output() keywordChange = new EventEmitter<string>();
  @Output() selectedIdsChange = new EventEmitter<number[]>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() create = new EventEmitter<void>();
  @Output() rowClick = new EventEmitter<any>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('📋 GenericTableComponent initialized:', {
      columns: this.columns,
      templates: Object.keys(this.templates),
      dataLength: this.data.length,
    });
  }

  onSearch() {
    console.log('🔍 Tìm kiếm:', this.keyword);
    this.keywordChange.emit(this.keyword);
    if (this.pagination) {
      this.pagination.onPageChange(0);
    }
  }

  onRowCheckboxChange(id: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const alreadySelected = this.selectedIds.includes(id);
    let newSelected: number[];

    if (checkbox.checked && !alreadySelected) {
      newSelected = [...this.selectedIds, id];
    } else if (!checkbox.checked && alreadySelected) {
      newSelected = this.selectedIds.filter((sid) => sid !== id);
    } else {
      return;
    }

    console.log('✅ Checkbox dòng thay đổi:', {
      id,
      checked: checkbox.checked,
      newSelected,
    });

    this.selectedIds = newSelected;
    this.selectedIdsChange.emit(newSelected);
    this.cd.detectChanges();
  }

  isRowSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }

  toggleSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const pageIds = this.data.map((item) => item.id as number);

    let newSelected: number[];

    if (checkbox.checked) {
      newSelected = Array.from(new Set([...this.selectedIds, ...pageIds]));
    } else {
      newSelected = this.selectedIds.filter((id) => !pageIds.includes(id));
    }

    console.log('📦 Chọn tất cả:', {
      checked: checkbox.checked,
      newSelected,
    });

    this.selectedIds = newSelected;
    this.selectedIdsChange.emit(newSelected);
    this.cd.detectChanges();
  }

  isAllSelected(): boolean {
    const allSelected = this.data.every((item) =>
      this.selectedIds.includes(item.id)
    );
    return allSelected;
  }

  onPageSizeChange(newSize: number) {
    if (this.pagination && !isNaN(newSize)) {
      console.log('📄 GenericTableComponent: Page size changed to:', newSize);
      this.pagination.size = newSize;
      this.pageSize = newSize;
      this.pageSizeChange.emit(newSize);
      this.pagination.onPageChange(0);
      this.cd.detectChanges();
    }
  }

  onRowClick(item: any) {
    console.log('Click row:', item);
    this.rowClick.emit(item);
  }
}
