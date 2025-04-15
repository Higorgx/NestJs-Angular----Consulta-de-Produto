import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../produto/produto.model';
import { ProdutoService } from '../produto/produto.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  produto: Produto = {
    id: null,
    descricao: null,
    custo: ''
  };
  isEdicao: boolean = false;
  carregando: boolean = false;
  mensagemErro: string | null = null;

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.carregarProduto(+id);
    }
  }

  carregarProduto(id: number): void {
    this.carregando = true;
    this.mensagemErro = null;
    
    this.produtoService.obterProdutoPorId(id).subscribe({
      next: (produto) => {
        this.produto = produto;
        this.isEdicao = true;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
        this.mensagemErro = 'Erro ao carregar os dados do produto';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    if (!this.produto.descricao) {
      this.mensagemErro = 'Descrição é obrigatória';
      return;
    }

    this.carregando = true;
    this.mensagemErro = null;

    const operacao = this.isEdicao
      ? this.produtoService.atualizarProduto(this.produto.id!, this.produto)
      : this.produtoService.criarProduto(this.produto);

    operacao.subscribe({
      next: () => {
        this.router.navigate(['/produtos']);
      },
      error: (err) => {
        console.error('Erro ao salvar produto', err);
        this.mensagemErro = 'Erro ao salvar o produto';
        this.carregando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }

  // Métodos para manipulação de preços por loja
  adicionarPrecoLoja(): void {
    // Implementar lógica para abrir modal de adição de preço
  }

  editarPrecoLoja(loja: any): void {
    // Implementar lógica para abrir modal de edição de preço
  }

  removerPrecoLoja(lojaId: number): void {
    if (this.produto.id && confirm('Deseja realmente remover este preço?')) {
      this.produtoService.removerPrecoLoja(this.produto.id, lojaId).subscribe({
        next: () => {
         // this.produto.lojas = this.produto.lojas?.filter(l => l.id !== lojaId) || [];
        },
        error: (err) => {
          console.error('Erro ao remover preço', err);
          this.mensagemErro = 'Erro ao remover preço da loja';
        }
      });
    }
  }
}