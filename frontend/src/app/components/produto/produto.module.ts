import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProdutoListComponent } from '../produto/produto.component';

@NgModule({
  declarations: [
    ProdutoListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    ProdutoListComponent
  ]
})
export class ProdutoModule { }