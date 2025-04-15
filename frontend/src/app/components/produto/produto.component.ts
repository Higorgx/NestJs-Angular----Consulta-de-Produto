import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from './produto.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProdutoService]
})
export class ProdutoComponent implements OnInit {
  produtos: any[] = [];
  carregando = false;

  paginaAtual = 1;
  totalItens = 0;
  itensPorPagina = 10;
  totalPaginas = 1;

  filtros = {
    id: null as number | null,
    descricao: '',
    custoMinimo: null as number | null,
    custoMaximo: null as number | null,
    vendaMinimo: null as number | null,
    vendaMaximo: null as number | null,
    limite: 5,
    pagina: 1,
    ordenarPor: 'id' as 'id' | 'descricao' | 'custo',
    direcaoOrdenacao: 'asc' as 'asc' | 'desc'
  };

  custoFiltro: number | null = null;
  vendaFiltro: number | null = null;

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;

    if (this.custoFiltro !== null) {
      this.filtros.custoMinimo = this.custoFiltro;
      this.filtros.custoMaximo = this.custoFiltro;
    } else {
      this.filtros.custoMinimo = null;
      this.filtros.custoMaximo = null;
    }

    if (this.vendaFiltro !== null) {
      this.filtros.vendaMinimo = this.vendaFiltro;
      this.filtros.vendaMaximo = this.vendaFiltro;
    } else {
      this.filtros.vendaMinimo = null;
      this.filtros.vendaMaximo = null;
    }

    const params = {
      ...this.filtros,
      id: this.filtros.id || undefined,
      descricao: this.filtros.descricao || undefined,
      custoMinimo: this.filtros.custoMinimo || undefined,
      custoMaximo: this.filtros.custoMaximo || undefined,
      vendaMinimo: this.filtros.vendaMinimo || undefined,
      vendaMaximo: this.filtros.vendaMaximo || undefined,
      page: this.filtros.pagina || undefined,
    };

    this.produtoService.listarProdutos(params)
      .subscribe({
        next: (resposta) => {
          this.produtos = resposta.data;
          this.totalItens = resposta.total;
          this.paginaAtual = resposta.page;
          this.totalPaginas = resposta.lastPage;
          this.carregando = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar produtos:', erro);
          this.carregando = false;
        }
      });
  }

  aplicarFiltros(): void {
    this.filtros.pagina = 1;
    this.carregarProdutos();
  }

  limparFiltros(): void {
    this.filtros = {
      id: null,
      descricao: '',
      custoMinimo: null,
      custoMaximo: null,
      vendaMinimo: null,
      vendaMaximo: null,
      limite: 5,
      pagina: 1,
      ordenarPor: 'id',
      direcaoOrdenacao: 'asc'
    };
    this.custoFiltro = null;
    this.vendaFiltro = null;
    this.carregarProdutos();
  }

  mudarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPaginas) {
      this.filtros.pagina = page;
      this.carregarProdutos();
    }
  }

  gerarArrayPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  adicionarProduto(): void {
    console.log('Adicionar novo produto');
  }

  editarProduto(produto: any): void {
    console.log('Editar produto:', produto);
  }

  excluirProduto(produto: any): void {
    if (confirm(`Tem certeza que deseja excluir o produto ${produto.descricao}?`)) {
      this.produtoService.excluirProduto(produto.id).subscribe({
        next: () => {
          alert('Produto excluído com sucesso!');
          this.carregarProdutos();
        },
        error: (erro) => {
          console.error('Erro ao excluir o produto:', erro);
          alert('Erro ao excluir o produto.');
        }
      });
    }
  }
}
