import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'
interface ColumnConfig {
  field: string; // tên trường dữ liệu
  header: string; // tiêu đề hiển thị
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent {
  @Input() title: string = '';
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() templates: { [key: string]: TemplateRef<any> } = {};
}
