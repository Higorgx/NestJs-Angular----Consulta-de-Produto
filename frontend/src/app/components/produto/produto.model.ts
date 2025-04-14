export interface Produto {
    id: number;
    descricao: string;
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
  }