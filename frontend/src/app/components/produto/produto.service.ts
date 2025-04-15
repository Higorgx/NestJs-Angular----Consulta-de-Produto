import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespostaProduto, FiltrosProduto, Produto, ProdutoResponse } from './produto.model';

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

  obterProdutoPorId(id: number): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.apiUrl}/${id}`);
  }

  criarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizarProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para gerenciamento de preços por loja
  adicionarPrecoLoja(produtoId: number, lojaId: number, preco: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${produtoId}/lojas`, {
      lojaId,
      preco
    });
  }

  atualizarPrecoLoja(produtoId: number, lojaId: number, preco: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${produtoId}/lojas/${lojaId}`, { preco });
  }

  removerPrecoLoja(produtoId: number, lojaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${produtoId}/lojas/${lojaId}`);
  }
}