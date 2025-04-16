import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  excluirPreco(idProdutoLoja: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produtoloja/${idProdutoLoja}`);
  }

  obterLojasDisponiveis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lojas?orderBy=descricao&orderDirection=asc`);
  }
  salvarPreco(precoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/produtoloja`, precoData);
  }
}
