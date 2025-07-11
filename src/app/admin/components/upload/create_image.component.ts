import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'create_image',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './create_image.component.html',
  styleUrls: ['./create_image.component.css'],  

})
export class CreateImageComponent {
  files = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    thumbnail: 'https://via.placeholder.com/40',
    name: `File_${i + 1}.jpg`,
    created: '1 month ago',
  }));
}

