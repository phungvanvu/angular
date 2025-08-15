import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'create_image',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericTableComponent],
  templateUrl: './create_image.component.html',
  styleUrls: ['./create_image.component.css'],
})
export class CreateImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('action') actionTemplate!: TemplateRef<any>;

  @Input() entityId: number | null = null;
  @Input() zone:
    | 'logo'
    | 'banner'
    | 'thumbnail'
    | 'gallery'
    | 'variant'
    | null = null;

  @Output() fileInserted = new EventEmitter<{
    fileId: number;
    zone: string;
    thumbnail: string;
  }>();
  @Output() close = new EventEmitter<void>();

  fileColumns = [
    { field: 'select', header: '', type: 'checkbox' },
    { field: 'id', header: 'ID' },
    { field: 'thumbnail', header: 'Thumbnail', type: 'image' },
    { field: 'name', header: 'Filename' },
    { field: 'created', header: 'Created' },
  ];

  templates: { [key: string]: TemplateRef<any> } = {};

  files: any[] = [];
  private _selectedFileIds: number[] = [];
  isEntityLinkingMode: boolean = false;

  @Input()
  set selectedFileIds(value: number[]) {
    this._selectedFileIds = value;
    this.cd.detectChanges();
  }

  get selectedFileIds(): number[] {
    return this._selectedFileIds;
  }

  loading = true;
  error = '';
  page = 0;
  size = 20;
  totalItems = 0;
  keyword = '';
  isDragOver = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isEntityLinkingMode = !!this.zone;
    console.log('CreateImageComponent initialized:', {
      entityId: this.entityId,
      zone: this.zone,
      isEntityLinkingMode: this.isEntityLinkingMode,
      fileColumns: this.fileColumns,
      hasActionTemplate: !!this.actionTemplate,
    });

    // Always add action column if actionTemplate exists
    if (this.actionTemplate) {
      this.fileColumns.push({
        field: 'action',
        header: 'Action',
        type: 'template',
      });
      this.templates = { action: this.actionTemplate };
      console.log('📋 Templates set in ngOnInit:', this.templates);
    }

    const valid = this.auth.isAccessTokenValid();
    if (!valid) {
      this.error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      this.loading = false;
      this.cd.detectChanges();
      return;
    }
    this.searchFiles();
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    if (!this.templates['action'] && this.actionTemplate) {
      this.fileColumns = [
        ...this.fileColumns,
        { field: 'action', header: 'Action', type: 'template' },
      ];
      this.templates = { action: this.actionTemplate };
      this.cd.detectChanges();
    }
  }

  searchFiles() {
    this.loading = true;

    const params: any = {
      filename: this.keyword,
      page: this.page,
      size: this.size,
    };

    console.log('🔍 API request params:', params);

    this.api.get('/files/search', { params }).subscribe({
      next: (res: any) => {
        console.log('📥 API response:', res);
        const pageResult = res?.result;
        const rawFiles = pageResult?.content ?? [];

        this.files = rawFiles.map((f: any) => ({
          id: f.id,
          thumbnail: `http://localhost:8080/elec/${f.path.replace(/\\/g, '/')}`,
          name: f.filename,
          created: new Date(f.createdAt).toLocaleString('vi-VN'),
        }));

        console.log('📋 Mapped files:', this.files);

        this.totalItems = pageResult?.totalElements ?? 0;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Không thể tải dữ liệu file.';
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  onPageChange(newPage: number) {
    console.log('📄 Page changed to:', newPage);
    this.page = newPage;
    this.searchFiles();
  }

  onPageSizeChange(newSize: number) {
    console.log('📄 CreateImageComponent: Page size changed to:', newSize);
    this.size = newSize;
    this.page = 0;
    this.searchFiles();
  }

  onSearch() {
    console.log('🔍 Search triggered with keyword:', this.keyword);
    this.page = 0;
    this.searchFiles();
  }

  deleteSelectedFiles() {
    console.log(
      '🗑️ deleteSelectedFiles called with IDs:',
      this.selectedFileIds
    );
    const ids = [...this.selectedFileIds];

    if (ids.length === 0) {
      alert('Vui lòng chọn ít nhất một file để xóa.');
      return;
    }

    const confirmed = confirm(`Bạn có chắc chắn muốn xóa ${ids.length} file?`);
    if (!confirmed) return;

    this.api.post('/files/delete-many', ids).subscribe({
      next: () => {
        this.selectedFileIds = this.selectedFileIds.filter(
          (id) => !ids.includes(id)
        );
        this.searchFiles();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Xóa thất bại!');
      },
    });
  }

  linkOrSelectFile(file: any) {
    if (!this.zone) {
      alert('Zone not provided.');
      return;
    }
    this.fileInserted.emit({
      fileId: file.id,
      zone: this.zone,
      thumbnail: file.thumbnail,
    });
    this.closeModal();
    this.cd.detectChanges();
  }

  closeModal() {
    this.close.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(input.files);
    }
  }

  uploadFiles(files: FileList) {
    this.loading = true;
    this.error = '';

    Array.from(files).forEach((file, index) => {
      const formData = new FormData();

      const request = {
        filename: file.name,
        disk: 'local',
        extension: file.name.split('.').pop() || '',
        mime: file.type || 'application/octet-stream',
        size: file.size.toString(),
      };

      // Thêm request dưới dạng JSON blob
      formData.append(
        'request',
        new Blob([JSON.stringify(request)], { type: 'application/json' })
      );
      formData.append('file', file);

      this.api.post('/files', formData).subscribe({
        next: () => {
          console.log(`File ${file.name} được tải lên thành công`);
          if (index === files.length - 1) {
            this.searchFiles();
            this.loading = false;
          }
        },
        error: (err) => {
          console.error(`Tải lên thất bại cho ${file.name}:`, err);
          this.error = 'Không thể tải file lên.';
          this.loading = false;
          this.cd.detectChanges();
        },
      });
    });
  }
}
