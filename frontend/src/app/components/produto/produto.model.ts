export interface Produto {
    id: number | null;
    descricao: number | null;
    custo: string;
  }
  
  export interface RespostaProduto {
    lastPage: number;
    sucesso: boolean;
    data: Produto[];
    total: number;
    page: number ;
  }
  
  export interface FiltrosProduto {
    limite?: number;
    page?: number;
    ordenarPor?: string | null; 
    direcaoOrdenacao?: string | null; 
    id?: number | null;
    descricao?: string;
    custoMinimo?: number | null;
    custoMaximo?: number | null;
    vendaMinimo?: number | null;
    vendaMaximo?: number | null;
  }

    export interface FiltrosProduto {
    limite?: number;
    page?: number;
    ordenarPor?: string | null; 
    direcaoOrdenacao?: string | null; 
    id?: number | null;
    descricao?: string;
    custoMinimo?: number | null;
    custoMaximo?: number | null;
    vendaMinimo?: number | null;
    vendaMaximo?: number | null;
  }