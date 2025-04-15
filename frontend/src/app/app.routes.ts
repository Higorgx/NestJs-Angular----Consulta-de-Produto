import { Routes } from '@angular/router';
import { ProdutoComponent } from './components/produto/produto.component';
import { CadastroComponent } from './components/cadastro/cadastro.component'; 

export const routes: Routes = [
  {
    path: '',
    component: ProdutoComponent
  },
  {
    path: 'cadastro', 
    component: CadastroComponent 
  },
  { 
    path: 'cadastro/:id', 
    component: CadastroComponent 
  },
];