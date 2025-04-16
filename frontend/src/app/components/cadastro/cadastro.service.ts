import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  obterLojasDisponiveis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lojas`);
  }

  salvarPreco(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/produtoloja`, data);
  }

  atualizarPreco(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/produtoloja/${id}`, data);
  }

  excluirPreco(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produtoloja/${id}`);
  }
}