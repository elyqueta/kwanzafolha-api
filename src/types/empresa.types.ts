export interface EmpresaBody {
  nome: string;
  nome_comercial?: string;
  nif?: string;
  tipo_empresa?: 'LDA' | 'SA' | 'ENI' | 'ONG' | 'EP' | 'OUTRO';
  data_constituicao?: string;
  telefone?: string;
  email?: string;
  website?: string;
  morada?: string;
  bairro?: string;
  cidade?: string;
  provincia_id?: number;
  municipio_id?: number;
}

export interface ConfigFiscalBody {
  taxa_inss_funcionario?: number;
  taxa_inss_entidade?: number;
  subsidio_alimentacao?: number;
  subsidio_transporte?: number;
  moeda_id?: number;
  regime_fiscal?: string;
}

export interface ContaBancariaBody {
  banco_id?: number;
  banco_nome?: string;
  numero_conta: string;
  iban?: string;
  moeda_id?: number;
  principal?: boolean;
}

