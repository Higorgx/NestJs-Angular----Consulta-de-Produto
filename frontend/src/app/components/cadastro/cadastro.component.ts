import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoResponse } from '../produto/produto.model';
import { ProdutoService } from '../produto/produto.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CadastroComponent implements OnInit {
  produto: Produto = {
    id: null,
    descricao: null,
    custo: '',
    produtoLoja: []
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

    // Chama o serviço e espera um ProdutoResponse
    this.produtoService.obterProdutoPorId(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.produto = res.data;
          this.isEdicao = true;
          this.carregando = false;
        } else {
          this.mensagemErro = 'Produto não encontrado';
          this.carregando = false;
        }
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
}
