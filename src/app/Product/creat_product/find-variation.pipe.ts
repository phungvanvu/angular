import { Pipe, PipeTransform } from '@angular/core';

interface Variation {
  id: number;
  name: string;
  type: string;
  isGlobal: boolean;
  variationValues: { id: number; label: string; value: string }[];
  updatedAt: string;
}

@Pipe({
  name: 'findVariation',
  standalone: true,
})
export class FindVariationPipe implements PipeTransform {
  transform(variations: Variation[], id: number): Variation | null {
    return variations.find((v) => v.id === id) || null;
  }
}
