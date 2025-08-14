import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateImageComponent } from '../../admin/components/upload/create_image.component';
import { ApiService } from '../../core/api/api.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-brands',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CreateImageComponent],
  templateUrl: './creat_brand.component.html',
  styleUrls: ['./creat-brand.component.css'],
})
export class CreatBrandsComponent {
  activeTab: string = 'general';
  brandForm: FormGroup;
  showFileManager: boolean = false;
  selectedZone: 'logo' | 'banner' | null = null;
  brandId: number | null = null;
  logoPreview: string | null = null;
  bannerPreview: string | null = null;
  logoFileId: number | null = null;
  bannerFileId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      status: [false],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.brandId = +params['id'];
        this.loadBrandDetail(this.brandId);
      }
    });
  }

  loadBrandDetail(id: number) {
    this.api.get(`/brands/${id}`).subscribe({
      next: (res: any) => {
        this.brandForm.patchValue({
          name: res.result.name,
          status: res.result.isActive,
        });
        if (res.result.fileLogo) {
          this.logoPreview = `http://localhost:8080/elec/${res.result.fileLogo.replace(
            /\\/g,
            '/'
          )}`;
        }
        if (res.result.fileBanner) {
          this.bannerPreview = `http://localhost:8080/elec/${res.result.fileBanner.replace(
            /\\/g,
            '/'
          )}`;
        }
      },
      error: (err) => {
        console.error('Load brand failed:', err);
      },
    });
  }

  openFileManager(zone: 'logo' | 'banner') {
    this.selectedZone = zone;
    this.showFileManager = true;
  }

  onFileInserted(event: { fileId: number; zone: string; thumbnail: string }) {
    if (event.zone === 'logo') {
      this.logoFileId = event.fileId;
      this.logoPreview = event.thumbnail;
    } else if (event.zone === 'banner') {
      this.bannerFileId = event.fileId;
      this.bannerPreview = event.thumbnail;
    }
    this.showFileManager = false;
  }

  onSubmit() {
    if (this.brandForm.valid) {
      const payload = {
        name: this.brandForm.value.name,
        isActive: this.brandForm.value.status,
      };

      const save$ = this.brandId
        ? this.api.put(`/brands/${this.brandId}`, payload) // update
        : this.api.post('/brands', payload); // create

      save$.subscribe({
        next: (res: any) => {
          if (!this.brandId) {
            this.brandId = res.result.id;
          }

          const attaches = [];
          if (this.logoFileId) {
            attaches.push(
              this.api.post('/entity-files', {
                fileId: this.logoFileId,
                entityId: this.brandId,
                entityType: 'brand',
                zone: 'logo',
              })
            );
          }
          if (this.bannerFileId) {
            attaches.push(
              this.api.post('/entity-files', {
                fileId: this.bannerFileId,
                entityId: this.brandId,
                entityType: 'brand',
                zone: 'banner',
              })
            );
          }

          if (attaches.length > 0) {
            forkJoin(attaches).subscribe({
              next: () => {
                alert(this.brandId ? 'Cập nhật thành công' : 'Tạo thành công');
                this.router.navigateByUrl('/app-layout/app-brands');
              },
              error: (err) => {
                console.error('Attach images failed:', err);
                alert(
                  (this.brandId ? 'Cập nhật' : 'Tạo') +
                    ' thành công nhưng gắn ảnh thất bại.'
                );
                this.router.navigateByUrl('/app-layout/app-brands');
              },
            });
          } else {
            alert(this.brandId ? 'Cập nhật thành công' : 'Tạo thành công');
            this.router.navigateByUrl('/app-layout/app-brands');
          }
        },
        error: (err) => {
          console.error('Save brand failed:', err);
          alert(this.brandId ? 'Cập nhật thất bại' : 'Tạo thất bại');
        },
      });
    }
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    console.log('Tab hiện tại:', this.activeTab);
    this.cd.detectChanges();
  }
}
