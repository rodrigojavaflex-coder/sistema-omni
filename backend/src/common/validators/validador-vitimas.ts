import {
  validate,
  ValidationError,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export interface ObjetoComVitimas {
  houveVitimas: string | boolean;
  nomeDaVitima?: string;
  documentoDaVitima?: string;
  dataNascimentoDaVitima?: string;
  sexoDaVitima?: string;
  nomeDaMaeDaVitima?: string;
}

/**
 * Validador customizado para validar campos de vítima condicionalmente
 * Se houveVitimas = 'SIM', os campos de vítima tornam-se obrigatórios
 */
@ValidatorConstraint({ name: 'validarCamposVitimas', async: false })
export class ValidadorCamposVitimas implements ValidatorConstraintInterface {
  private mensagensErro: { [key: string]: string } = {
    nomeDaVitima: 'Informe o nome da vítima',
    documentoDaVitima: 'Informe o documento da vítima',
    dataNascimentoDaVitima: 'Informe a data de nascimento da vítima',
    sexoDaVitima: 'Informe o gênero da vítima',
    nomeDaMaeDaVitima: 'Informe o nome da mãe da vítima'
  };

  validate(objeto: any): boolean {
    if (!objeto || typeof objeto !== 'object') {
      return true;
    }

    const houveVitimas = objeto.houveVitimas;
    console.log('validate() - houveVitimas:', JSON.stringify(houveVitimas), 'tipo:', typeof houveVitimas);

    // Se houveVitimas não for 'Sim' (case-insensitive), a validação passa
    // O enum SimNao usa 'Sim' e 'Não'
    const houveVitimasUpperCase = typeof houveVitimas === 'string' 
      ? houveVitimas.toUpperCase() 
      : houveVitimas;
    
    console.log('UPPERCASE:', houveVitimasUpperCase);
    
    if (houveVitimasUpperCase !== 'SIM' && houveVitimasUpperCase !== true) {
      console.log('✅ NÃO É SIM - PASSA SEM VALIDAR VÍTIMAS');
      return true;
    }

    console.log('🔴 É SIM - VALIDANDO VÍTIMAS');

    // Se houveVitimas é 'SIM', todos esses campos devem estar preenchidos
    const camposObrigatorios = [
      'nomeDaVitima',
      'documentoDaVitima',
      'dataNascimentoDaVitima',
      'sexoDaVitima',
      'nomeDaMaeDaVitima',
    ];

    for (const campo of camposObrigatorios) {
      const valor = objeto[campo];
      
      // Considerar TUDO como vazio: null, undefined, '', '  ', etc
      const estaVazio = 
        valor === null || 
        valor === undefined || 
        valor === '' || 
        (typeof valor === 'string' && valor.trim() === '');

      if (estaVazio) {
        this.ultimoErro = this.mensagensErro[campo] || `Campo obrigatório: ${campo}`;
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return this.ultimoErro || 'Quando há vítimas, todos os campos de vítima devem ser preenchidos';
  }

  private ultimoErro: string;
}

/**
 * Função auxiliar para validar um DTO de ocorrência
 * Retorna um array de mensagens de erro ou vazio se válido
 */
export async function validarCamposVitimas(objeto: any): Promise<string[]> {
  console.log('\n=== VALIDADOR VITIMAS ===');
  console.log('houveVitimas RECEBIDO:', JSON.stringify(objeto?.houveVitimas));
  console.log('TIPO:', typeof objeto?.houveVitimas);
  
  const validador = new ValidadorCamposVitimas();
  const ehValido = validador.validate(objeto);

  if (!ehValido) {
    console.log('❌ FALHOU:', validador.defaultMessage());
    return [validador.defaultMessage()];
  }

  console.log('✅ PASSOU\n');
  return [];
}
