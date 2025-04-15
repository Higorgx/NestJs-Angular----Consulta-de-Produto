import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { concat, Observable } from 'rxjs';
import { RespostaProduto, FiltrosProduto, excluirProduto } from './produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) { }

  listarProdutos(filtros: FiltrosProduto): Observable<RespostaProduto> {
    let params = new HttpParams();

    if (filtros.limite) params = params.set('limit', filtros.limite.toString());
    if (filtros.page) params = params.set('page', filtros.page.toString());
    if (filtros.ordenarPor) params = params.set('orderBy', filtros.ordenarPor);
    if (filtros.direcaoOrdenacao) params = params.set('orderDirection', filtros.direcaoOrdenacao);
    if (filtros.id) params = params.set('id', filtros.id.toString());
    if (filtros.descricao) params = params.set('descricao', filtros.descricao);
    if (filtros.custoMinimo) params = params.set('custoMin', filtros.custoMinimo.toString());
    if (filtros.custoMaximo) params = params.set('custoMax', filtros.custoMaximo.toString());
    if (filtros.vendaMinimo) params = params.set('vendaMin', filtros.vendaMinimo.toString());
    if (filtros.vendaMaximo) params = params.set('vendaMax', filtros.vendaMaximo.toString());

    return this.http.get<RespostaProduto>(this.apiUrl, { params });
  }

  excluirProduto(id: number): Observable<RespostaProduto> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Requisição DELETE para:', url);
    this.http.delete<RespostaProduto>(url);
    return this.http.delete<RespostaProduto>(url);
  }
}

export type { FiltrosProduto };
