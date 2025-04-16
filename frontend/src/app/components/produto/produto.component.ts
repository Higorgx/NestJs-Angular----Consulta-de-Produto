import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from './produto.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  colunaOrdenacao = {
    campo: 'id' as 'id' | 'descricao' | 'custo',
    direcao: 'asc' as 'asc' | 'desc'
  };

  custoFiltro: number | null = null;
  vendaFiltro: number | null = null;

  avisoMensagem: string | null = null;
  produtoParaExcluir: any | null = null;
  confirmacaoExclusaoVisivel = false;

  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  navegarParaHome(): void {
    this.router.navigate(['/']).catch(err => console.error('Erro na navegação:', err));
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

    this.filtros.ordenarPor = this.colunaOrdenacao.campo;
    this.filtros.direcaoOrdenacao = this.colunaOrdenacao.direcao;

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

  ordenarPor(campo: 'id' | 'descricao' | 'custo'): void {
    console.log(campo)
    if (this.colunaOrdenacao.campo === campo) {
      this.colunaOrdenacao.direcao = this.colunaOrdenacao.direcao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao.campo = campo;
      this.colunaOrdenacao.direcao = 'asc';
    }
    this.carregarProdutos();
  }

  obterIconeOrdenacao(campo: string): string {
    if (this.colunaOrdenacao.campo !== campo) {
      return 'bi-arrow-down-up';
    }
    return this.colunaOrdenacao.direcao === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
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
    this.colunaOrdenacao = {
      campo: 'id',
      direcao: 'asc'
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

  excluirProduto(produto: any): void {
    this.produtoParaExcluir = produto;
    this.confirmacaoExclusaoVisivel = true;
  }

  confirmarExclusao(): void {
    if (this.produtoParaExcluir) {
      this.produtoService.excluirProduto(this.produtoParaExcluir.id).subscribe({
        next: () => {
          this.avisoMensagem = `Produto ${this.produtoParaExcluir.descricao} excluído com sucesso!`;
          this.carregarProdutos();
          this.confirmacaoExclusaoVisivel = false;
        },
        error: (erro) => {
          console.error('Erro ao excluir o produto:', erro);
          this.avisoMensagem = `Erro ao excluir o produto ${this.produtoParaExcluir.descricao}.`;
          this.confirmacaoExclusaoVisivel = false;
        }
      });
    }
  }

  cancelarExclusao(): void {
    this.confirmacaoExclusaoVisivel = false;
  }

  gerarArrayPaginas(): number[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;
  
    const maxPaginas = 4;
    let inicio = Math.max(1, atual - Math.floor(maxPaginas / 2));
    let fim = inicio + maxPaginas - 1;
  
    if (fim > total) {
      fim = total;
      inicio = Math.max(1, fim - maxPaginas + 1);
    }
  
    const paginas: number[] = [];
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
  
    return paginas;
  }

  adicionarProduto(): void {
    this.router.navigate(['/cadastro'])
      .catch(err => console.error('Erro na navegação:', err));
  }
  
  editarProduto(produto: any): void {
    this.router.navigate(['/cadastro', produto.id])
      .catch(err => console.error('Erro na navegação:', err));
  }
}