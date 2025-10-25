import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatar placas de veículos no padrão brasileiro
 * AAA-1234 (antiga) ou AAA-1A34 (Mercosul)
 */
@Pipe({
  name: 'placa',
  standalone: true
})
export class PlacaPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Remove caracteres não alfanuméricos e converte para maiúsculas
    const placa = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Se já tiver o formato correto, retorna
    if (placa.length !== 7) return value;
    
    // Formata: AAA-1234 ou AAA-1A34
    return `${placa.substring(0, 3)}-${placa.substring(3)}`;
  }
}
