import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from '../produto/produto.model';
import { ProdutoService } from '../produto/produto.service';
import { CadastroService } from './cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CadastroComponent implements OnInit {
  produto: Produto = {
    id: null,
    descricao: null,
    custo: '',
    produtoLoja: [],
    imagem: null,
    data: undefined
  };

  lojasDisponiveis: any[] = []; // Lojas que serão carregadas da API
  isEdicao: boolean = false;
  carregando: boolean = false;
  avisoMensagem: string | null = null;

  confirmacaoExclusaoVisivel = false;
  mensagemConfirmacao = '';
  novoPreco={
    idproduto: null,
    idloja: null,
    precovenda: 0,
  };
  itemParaExcluir: any = null;
  tipoExclusao: 'produto' | 'preco' | null = null;

  constructor(
    private produtoService: ProdutoService,
    private cadastroService: CadastroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.carregarProduto(+id);
    }
    this.carregarLojasDisponiveis(); // Carrega as lojas ao iniciar
  }

  carregarProduto(id: number): void {
    this.carregando = true;
    this.avisoMensagem = null;

    this.produtoService.obterProdutoPorId(id).subscribe({
      next: (res) => {
        if (res.success) {
          
          this.produto = res.data;
          this.isEdicao = true;
        } else {
          this.avisoMensagem = 'Produto não encontrado';
        }
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
        this.avisoMensagem = 'Erro ao carregar os dados do produto';
        this.carregando = false;
      },
    });
  }

  carregarLojasDisponiveis(): void {
    this.cadastroService.obterLojasDisponiveis().subscribe({
      next: (res) => {
        if (res.success) {
          this.lojasDisponiveis = res.data;
        } else {
          this.avisoMensagem = 'Erro ao carregar lojas';
        }
      },
      error: (err) => {
        console.error('Erro ao carregar lojas', err);
        this.avisoMensagem = 'Erro ao carregar lojas';
      },
    });
  }

  salvar(): void {

    console.log(this.produto)
    if (!this.produto.descricao) {
      this.avisoMensagem = 'Descrição é obrigatória';
      return;
    }
    this.carregando = true;
    this.avisoMensagem = null;
  
    if(this.produto.imagem == 'data:image/jpeg;base64,null' || this.produto.imagem == null) {
      
      this.produto.imagem= ''
      console.log(this.produto)
    }
    

    if(this.isEdicao) {
      
        if (this.produto.imagem && !this.produto.imagem.includes('data:image/jpeg;base64,') && this.produto.imagem!= '') {  
          this.produto.imagem = 'data:image/jpeg;base64,' + this.produto.imagem
        }
        const payload = {
          id: this.produto.id,
          descricao: this.produto.descricao,
          custo: this.produto.custo,
          imagem: this.produto.imagem,
        }
        this.produtoService.atualizarProdutoParcial(this.produto.id!, payload).subscribe({
          next: () => {
            this.carregarProduto(this.route.snapshot.params['id']);
            this.avisoMensagem = 'Produto atualizado com sucesso!';
            this.carregando = false;
          },
          error: (err) => {
            console.error('Erro ao salvar produto', err);
            this.avisoMensagem = 'Erro ao salvar o produto';
            this.carregando = false;
          },
        });
      }else {
        if (this.produto.imagem && !this.produto.imagem.includes('data:image/jpeg;base64,')) {  
          this.produto.imagem = 'data:image/jpeg;base64,' + this.produto.imagem
        }
        this.produtoService.criarProduto(this.produto).subscribe({
          next: (res) => {
            this.avisoMensagem = 'Produto criado com sucesso!';
            this.carregando = false;
            this.router.navigate([`/cadastro/${res?.data?.id}`]);
          },
          error: (err) => {
            this.avisoMensagem = 'Erro ao criado o produto';
            this.carregando = false;
          },
        });
      }


  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.avisoMensagem = 'Somente arquivos JPG ou PNG são permitidos.';
        return;
      }

      this.avisoMensagem = null;

      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        this.produto.imagem = base64.split(',')[1];
      };

      reader.readAsDataURL(file);
    }
  }

  removerImagem(): void {
    this.produto.imagem = null;
  }

  excluirProduto(): void {
    if (this.produto.produtoLoja && this.produto.produtoLoja.length > 0) {
      this.avisoMensagem = 'Remova todos os preços antes de excluir o produto.';
      return;
    }
    this.produtoService.excluirProduto(this.route.snapshot.params['id']).subscribe(() => {
      this.avisoMensagem = `Produto "${this.produto.descricao}" excluído com sucesso!`;
      this.router.navigate(['/']);
    });
  }

  removerPreco(idProdutoLoja: number): void {
    const item = this.produto.produtoLoja.find(p => p.id === idProdutoLoja);
    if (!item) return;

    this.cadastroService.excluirPreco(item.id).subscribe(() => {
      this.produto.produtoLoja = this.produto.produtoLoja.filter(
        (p) => p.id !== item.id
      );
      this.avisoMensagem = 'Preço excluído com sucesso!';
    });
  }

  abrirConfirmacaoExclusao(item: any, tipo: 'produto' | 'preco'): void {
    this.itemParaExcluir = item;
    this.tipoExclusao = tipo;

    if (tipo === 'produto') {
      this.mensagemConfirmacao = `Você tem certeza que deseja excluir o produto "${this.produto.descricao}"?`;
    } else {
      this.mensagemConfirmacao = `Você tem certeza que deseja excluir o preço da loja "${item.idloja?.descricao}"?`;
    }

    this.confirmacaoExclusaoVisivel = true;
  }

  cancelarExclusao(): void {
    this.confirmacaoExclusaoVisivel = false;
    this.itemParaExcluir = null;
    this.tipoExclusao = null;
  }

  confirmarExclusao(): void {
    if (this.tipoExclusao === 'produto') {
      this.excluirProduto();
    } else if (this.tipoExclusao === 'preco') {
      this.removerPreco(this.itemParaExcluir.id);
    }

    this.cancelarExclusao();
  }

  salvarPreco(): void {
    if (!this.novoPreco.idloja) {
      this.avisoMensagem = 'Selecione uma loja.';
      return;
    }
  
    if (this.novoPreco.precovenda <= 0) {
      this.avisoMensagem = 'O preço de venda deve ser maior que 0.';
      return;
    }
  
    this.carregando = true;
    this.avisoMensagem = null;
  
    // Envia a alteração do preço para o backend
    const precoData = {
      idproduto: this.produto.id,
      idloja: this.novoPreco.idloja, 
      precovenda: this.novoPreco.precovenda,
    };
    
    if(!this.produto.id) return
    this.cadastroService.salvarPreco(precoData).subscribe({
      next: () => {
        this.carregarProduto(this.produto.id!);
        this.avisoMensagem = 'Preço salvo com sucesso!';
        this.carregando = false;
        this.novoPreco.idloja = null;
        this.novoPreco.precovenda = 0;
      },
      error: (err) => {
        console.error('Erro ao salvar preço', err);
        this.avisoMensagem = 'Erro ao salvar o preço';
        this.carregando = false;
      },
      
    });
  }
}
