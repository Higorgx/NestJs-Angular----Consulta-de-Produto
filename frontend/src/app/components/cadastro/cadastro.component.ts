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
  // ========== Propriedades do Componente ==========
  produto: Produto = {
    id: null,
    descricao: null,
    custo: '',
    produtoLoja: [],
    imagem: null,
    data: undefined
  };

  lojasDisponiveis: any[] = [];
  isEdicao: boolean = false;
  carregando: boolean = false;
  avisoMensagem: string | null = null;
  modoEdicaoPreco: boolean = false;
  precoEditando: any = null;

  confirmacaoExclusaoVisivel = false;
  mensagemConfirmacao = '';
  itemParaExcluir: any = null;
  tipoExclusao: 'produto' | 'preco' | null = null;

  novoPreco = {
    idproduto: null as number | null,
    idloja: null as number | null,
    precovenda: null as number | null, 
  };

  constructor(
    private produtoService: ProdutoService,
    private cadastroService: CadastroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  // ========== Ciclo de Vida do Componente ==========
  navegarParaHome()
    {
      this.router.navigate(['/']);
    } 
  // ========== Ciclo de Vida do Componente ==========
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) this.carregarProduto(+id);
    this.carregarLojasDisponiveis();
    
  }

  // ========== Carregamento de Dados ==========
  carregarProduto(id: number): void {
    this.carregando = true;
    this.avisoMensagem = null;
  
    this.produtoService.obterProdutoPorId(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.produto = res.data;
          this.isEdicao = true;
  
          // Formatação específica para remover apenas o último zero decimal
          if (this.produto.produtoLoja) {
            this.produto.produtoLoja.forEach(item => {
              if (item.precovenda) {
                // Converte para string e processa
                let valorStr = item.precovenda.toString();
                
                // Se tiver ponto decimal e terminar com zero
                if (valorStr.includes('.') && valorStr.endsWith('0')) {
                  valorStr = valorStr.slice(0, -1); // Remove o último caractere (zero)
                }
                
                item.precovenda = valorStr;
              }
            });
          }
  
          console.log('Produto formatado:', this.produto);
        } else {
          this.avisoMensagem = 'Produto não encontrado';
        }
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
        this.avisoMensagem = 'Erro ao carregar os dados do produto';
        this.carregando = false;
      }
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

  // ========== Operações do Produto ==========
  salvar(): void {
    if (!this.produto.descricao) {
      this.avisoMensagem = 'Descrição é obrigatória';
      return;
    }

    this.carregando = true;
    this.avisoMensagem = null;

    if (this.produto.imagem === 'data:image/jpg;base64,null') {
      this.produto.imagem = '';
    }

    const precisaPrefixarImagem = this.produto.imagem && !this.produto.imagem.includes('data:image/jpg;base64');
    if (precisaPrefixarImagem) {
      this.produto.imagem = 'data:image/jpg;base64,' + this.produto.imagem;
    }

    if (this.isEdicao) {
      const payload = {
        id: this.produto.id,
        descricao: this.produto.descricao,
        custo: this.produto.custo,
        imagem: this.produto.imagem,
      };

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
    } else {
      this.produtoService.criarProduto(this.produto).subscribe({
        next: (res) => {
          this.avisoMensagem = 'Produto criado com sucesso!';
          this.carregando = false;
          this.router.navigate([`/cadastro/${res?.data?.id}`]);
        },
        error: (err) => {
          this.avisoMensagem = 'Erro ao criar o produto';
          this.carregando = false;
        },
      });
    }
  }

  excluirProduto(): void {
    if (this.produto.produtoLoja?.length > 0) {
      this.avisoMensagem = 'Remova todos os preços antes de excluir o produto.';
      return;
    }

    this.produtoService.excluirProduto(this.route.snapshot.params['id']).subscribe(() => {
      this.avisoMensagem = `Produto "${this.produto.descricao}" excluído com sucesso!`;
      this.router.navigate(['/']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }

  validateFloat(event: Event) {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart ?? 0;
    
    let value = input.value;
    const originalLength = value.length;
  
 
    value = value.replace(/[^0-9.]/g, '');
  
    const decimalParts = value.split('.');
    if (decimalParts.length > 2) {
      value = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }
  
    if (decimalParts.length > 1) {
      value = decimalParts[0] + '.' + decimalParts[1].slice(0, 2); 
    }
  
    const numStr = value.replace('.', '');
    if (numStr.length > 10) {
      value = value.substring(0, value.length - (numStr.length - 10));
    }
  
    if (input.value !== value) {
      input.value = value;
      this.novoPreco.precovenda = value === '' ? null : parseFloat(value);
      
      let newCursorPosition = cursorPosition;
      const lengthDiff = value.length - originalLength;
      
      newCursorPosition += lengthDiff;
      
      newCursorPosition = Math.max(0, Math.min(newCursorPosition, value.length));
      
      if (value.includes('.') && newCursorPosition > value.indexOf('.')) {
        newCursorPosition = Math.min(newCursorPosition, value.indexOf('.') + 2); 
      }
      
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }

  // ========== Manipulação de Imagem ==========
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files?.length) {
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

  // ========== Gestão de Preços ==========
  salvarPreco(): void {
    if (!this.novoPreco.idloja) {
      this.avisoMensagem = 'Selecione uma loja.';
      return;
    }

    if (this.novoPreco.precovenda && this.novoPreco.precovenda <= 0) {
      this.avisoMensagem = 'O preço de venda deve ser maior que 0.';
      return;
    }

    if (!this.produto.id) return;

    this.carregando = true;
    this.avisoMensagem = null;

    const precoData = {
      idproduto: this.produto.id,
      idloja: this.novoPreco.idloja,
      precovenda: this.novoPreco.precovenda,
    };

    const observable = this.modoEdicaoPreco 
      ? this.cadastroService.atualizarPreco(this.precoEditando.id, precoData)
      : this.cadastroService.salvarPreco(precoData);

    observable.subscribe({
      next: () => {
        this.carregarProduto(this.produto.id!);
        this.avisoMensagem = this.modoEdicaoPreco 
          ? 'Preço atualizado com sucesso!' 
          : 'Preço salvo com sucesso!';
        this.carregando = false;
        this.limparFormularioPreco();
      },
      error: (err) => {
        console.error('Erro ao salvar preço', err);
        this.avisoMensagem = this.modoEdicaoPreco 
          ? 'Erro ao atualizar o preço' 
          : 'Erro ao salvar o preço';
        this.carregando = false;
      },
    });
  }

  limparFormularioPreco(): void {
    this.novoPreco = {
      idproduto: null,
      idloja: null,
      precovenda: 0,
    };
    this.modoEdicaoPreco = false;
    this.precoEditando = null;
  }

  editarPreco(preco: any): void {
    this.modoEdicaoPreco = true;
    this.precoEditando = preco;
    this.novoPreco = {
      idproduto: preco.idproduto,
      idloja: preco.idloja?.id,
      precovenda: preco.precovenda,
    };
  }

  removerPreco(idProdutoLoja: number): void {
    const item = this.produto.produtoLoja.find(p => p.id === idProdutoLoja);
    if (!item) return;

    this.cadastroService.excluirPreco(item.id).subscribe(() => {
      this.produto.produtoLoja = this.produto.produtoLoja.filter(p => p.id !== item.id);
      this.avisoMensagem = 'Preço excluído com sucesso!';
    });
  }

  // ========== Confirmação de Exclusão ==========
  abrirConfirmacaoExclusao(item: any, tipo: 'produto' | 'preco'): void {
    if (this.modoEdicaoPreco && tipo === 'preco' && this.precoEditando?.id === item.id) {
      this.avisoMensagem = 'Termine a edição antes de excluir.';
      return;
    }
    
    this.itemParaExcluir = item;
    this.tipoExclusao = tipo;

    this.mensagemConfirmacao = tipo === 'produto'
      ? `Você tem certeza que deseja excluir o produto "${this.produto.descricao}"?`
      : `Você tem certeza que deseja excluir o preço da loja "${item.idloja?.descricao}"?`;

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
}