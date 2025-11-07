import { Ocorrencia } from '../../models/ocorrencia.model';

/**
 * Classe responsável por transformar e processar dados de Ocorrência para exportação
 * Contém métodos estáticos para cálculos e formatações de campos
 */
export class ExportDataTransformer {
  // Dias da semana em português
  private static readonly DIAS_SEMANA = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ];

  /**
   * Calcula a idade do motorista com base na data de nascimento
   * @param dataNascimento Data de nascimento do motorista
   * @returns Idade em anos como número
   */
  static calculateIdadeMotorista(dataNascimento: Date | string | null | undefined): number {
    if (!dataNascimento) return 0;
    
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataNasc.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    
    return Math.max(0, idade);
  }

  /**
   * Retorna o dia da semana em português
   * @param data Data da ocorrência
   * @returns Nome do dia da semana
   */
  static calculateDiaSemana(data: Date | string): string {
    const d = new Date(data);
    return this.DIAS_SEMANA[d.getDay()];
  }

  /**
   * Formata a data no formato DD/MM/YYYY
   * @param data Data a ser formatada
   * @returns Data formatada
   */
  static formatData(data: Date | string | null | undefined): string {
    if (!data) return '';
    
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
  }

  /**
   * Formata a hora no formato HH:MM
   * @param data Data/hora a ser formatada
   * @returns Hora formatada (HH:MM)
   */
  static formatHora(data: Date | string | null | undefined): string {
    if (!data) return '';
    
    const d = new Date(data);
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    
    return `${horas}:${minutos}`;
  }

  /**
   * Formata coordenadas de localização
   * @param localizacao Objeto com coordenadas [longitude, latitude]
   * @returns String formatada com coordenadas
   */
  static formatLocalizacao(localizacao: any): string {
    if (!localizacao || !localizacao.coordinates) return '';
    
    const [longitude, latitude] = localizacao.coordinates;
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  /**
   * Converte SimNao enum para texto legível
   * @param valor Valor do enum (SIM, NAO, NAO_INFORMADO)
   * @returns Valor formatado
   */
  static formatSimNao(valor: string | null | undefined): string {
    if (!valor) return '';
    
    const mapeamento: { [key: string]: string } = {
      'SIM': 'Sim',
      'NAO': 'Não',
      'NAO_INFORMADO': 'Não informado'
    };
    
    return mapeamento[valor] || valor;
  }

  /**
   * Converte Terceirizado enum para texto legível
   * @param valor Valor do enum (SIM, NAO, NAO_INFORMADO)
   * @returns Valor formatado
   */
  static formatTerceirizado(valor: string | null | undefined): string {
    if (!valor) return '';
    return this.formatSimNao(valor);
  }

  /**
   * Obtém o número de vítimas com lesões de forma segura
   * @param num Número de vítimas
   * @returns Número formatado ou string vazia
   */
  static formatNumVitimas(num: number | null | undefined): string {
    if (num === null || num === undefined || num === 0) return '-';
    return num.toString();
  }

  /**
   * Obtém o valor de um campo de forma segura
   * @param valor Valor do campo
   * @returns Valor formatado ou string vazia
   */
  static formatCampo(valor: any): string {
    if (valor === null || valor === undefined) return '';
    if (valor === '') return '';
    return valor.toString().trim();
  }

  /**
   * Extrai dados formatados de uma ocorrência para exportação em Excel
   * @param item Ocorrência a ser processada
   * @returns Array com dados formatados na sequência correta
   */
  static transformOcorrenciaToExcelRow(item: Ocorrencia): any[] {
    return [
      // Data e Hora
      this.formatData(item.dataHora),                                          // Data da Ocorrência
      this.formatHora(item.dataHora),                                          // Hora da Ocorrência

      // Veículo e Tipo
      this.formatCampo(item.veiculo?.descricao),                               // Veículo
      this.formatCampo(item.tipo),                                             // Tipo de Ocorrência
      this.formatCampo(item.descricao),                                        // Descrição da ocorrência
      this.formatCampo(item.observacoesTecnicas),                              // Observações Técnicas
      this.formatCampo(item.aberturaPAP),                                      // Abertura de PAP

      // Motorista
      this.formatCampo(item.motorista?.nome),                                  // Motorista
      this.calculateIdadeMotorista(item.motorista?.dataNascimento),            // Idade do motorista
      this.formatTerceirizado(item.motorista?.terceirizado),                   // Motorista terceirizado
      this.formatCampo(item.motorista?.matricula),                             // Matrícula do Motorista

      // Localização
      this.formatCampo(item.localDetalhado),                                   // Local Detalhado
      this.formatCampo(item.linha),                                            // Linha
      this.formatCampo(item.arco),                                             // Extensão
      this.formatCampo(item.sentidoVia),                                       // Sentido da Via
      this.formatCampo(item.tipoLocal),                                        // Tipo de Local
      this.formatLocalizacao(item.localizacao),                                // Localização (coordenadas)

      // Culpabilidade
      this.formatCampo(item.culpabilidade),                                    // Culpabilidade

      // Vítimas
      this.formatSimNao(item.houveVitimas),                                    // Houve Vítimas?
      this.formatNumVitimas(item.numVitimasComLesoes),                         // Vítimas com Lesões
      this.formatNumVitimas(item.numVitimasFatais),                            // Vítimas Fatais
      this.formatCampo(item.nomeDaVitima),                                     // Nome da Vítima
      this.formatCampo(item.documentoDaVitima),                                // Documento da Vítima
      this.formatData(item.dataNascimentoDaVitima),                            // Data de Nascimento da Vítima
      this.formatCampo(item.sexoDaVitima),                                     // Gênero da Vítima
      this.formatCampo(item.nomeDaMaeDaVitima),                                // Nome da Mãe da Vítima
      this.formatCampo(item.informacoesVitimas),                               // Outras Informações da Vítima
      this.formatCampo(item.enderecoVitimas),                                  // Endereço das Vítimas
      this.formatCampo(item.informacoesTestemunhas),                           // Informações sobre Testemunhas

      // Terceiros e Boletim
      this.formatCampo(item.informacoesTerceiros),                             // Informações de Terceiros
      this.formatCampo(item.boletimOcorrencia)                                 // Boletim de Ocorrência
    ];
  }

  /**
   * Retorna os headers para exportação em Excel
   * @returns Array com nomes dos headers na sequência correta
   */
  static getExcelHeaders(): string[] {
    return [
      'Data da Ocorrência',
      'Hora da Ocorrência',
      'Veículo',
      'Tipo de Ocorrência',
      'Descrição da Ocorrência',
      'Observações Técnicas',
      'Abertura de PAP',
      'Motorista',
      'Idade do Motorista',
      'Motorista Terceirizado',
      'Matrícula do Motorista',
      'Local Detalhado',
      'Linha',
      'Extensão',
      'Sentido da Via',
      'Tipo de Local',
      'Localização',
      'Culpabilidade',
      'Houve Vítimas?',
      'Vítimas com Lesões',
      'Vítimas Fatais',
      'Nome da Vítima',
      'Documento da Vítima',
      'Data de Nascimento da Vítima',
      'Gênero da Vítima',
      'Nome da Mãe da Vítima',
      'Outras Informações da Vítima',
      'Endereço das Vítimas',
      'Informações sobre Testemunhas',
      'Informações de Terceiros',
      'Boletim de Ocorrência'
    ];
  }
}
