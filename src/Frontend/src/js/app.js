import { CategoriesService } from '../services/categories-service.js';
import { ProductsService } from '../services/products-service.js';


(async () => {
    "use strict";

    const productsService = new ProductsService();
    const categoriesService = new CategoriesService();
    const produtosContainer = document.getElementById('products-container');
    const categoriasContainer = document.getElementById('categories-container');
    const buscaInput = document.getElementById('search-input');
    const mensagem = document.getElementById('status-message');
    const templateCategoria = document.getElementById('category-template');
    const templateProduto = document.getElementById('product-template');

    /**
     * @type { {id: number; titulo: string; preco: number; imagem_url: string; estoque_atual: number; categorias: string[]} }[]
    */
    let produtos = [];
    /**
     * @typedef {import('../../../generated/prisma/index.d.ts').Categoria} Categoria
     * @type Categoria[]
    */
    let categorias = [];
    /**
     * @typedef {import('../models/produto.d.ts').Produto} Produto
     * @type Produto[]
    */
    let produtosFiltrados = [];
    /**
     * @typedef {import('../models/produto.d.ts').Produto} Produto
     * @type Produto[]
    */
    let categoriaAtiva = null;
    let busca = '';

    await loadAllData();
    await loadCategories();
    configureEventListeners();

    async function loadAllData() {
        try {
            const data = await productsService.getAllProducts();

            produtos = data;
            produtosFiltrados = [...produtos];

            renderizarProdutos();
            escondeStatus();
        } catch (error) {
            mostrarMensagemErro('Erro ao carregar produtos. Tente novamente mais tarde.', 'danger');
            console.error('Erro ao carregar produtos:', error);
        }
    }


    async function loadCategories() {
        try {
            const response = await categoriesService.getAllCategories();
            categorias = response;
            renderizarCategorias();
        }
        catch {
            mostrarMensagemErro('Erro ao carregar categorias. Tente novamente mais tarde.', 'danger');
            console.error('Erro ao carregar categorias:', error);
        }
    }

    function aplicaFiltro() {
        /**
         * @typedef {import('../models/produto.d.ts').Produto} Produto
         * @type Produto[]
        */
        let result = [...produtos];

        if (categoriaAtiva) {
            result = result.filter(product =>
                product.categorias.includes(categoriaAtiva.titulo)
            );
        }

        if (busca) {
            const termo = busca.toLowerCase();
            result = result.filter(product => {
                const titleMatch = product.titulo.toLowerCase().includes(termo);
                const descriptionMatch = product.descricao.toLowerCase().includes(termo);
                return titleMatch;
            });
        }

        produtosFiltrados = result;
        renderizarProdutos();
    }

    function renderizarCategorias() {
        categoriasContainer.innerHTML = '';

        categorias.forEach(item => {
            const templateBotao = templateCategoria.content.cloneNode(true);
            const elementoBotao = templateBotao.getElementById('category-botao');
            elementoBotao.textContent = item.titulo;
            elementoBotao.addEventListener('click', () => {
                if (categoriaAtiva === item) {
                    categoriaAtiva = null;
                    elementoBotao.classList.remove('active');
                } else {
                    categoriaAtiva = item;
                    Array.from(categoriasContainer.children).forEach(botao => {
                        botao.classList.remove('active');
                    });
                    elementoBotao.classList.add('active');
                }
                aplicaFiltro();
            });
            categoriasContainer.appendChild(templateBotao);
        });
    }

    function renderizarProdutos() {
        produtosContainer.innerHTML = '';
        if (produtosFiltrados.length === 0) {
            mensagemSemProdutos();
            return;
        }

        produtosFiltrados.forEach(produto => {
            const column = templateProduto.content.cloneNode(true);
            column.getElementById('product-imagem').src = produto.imagem_url;
            column.getElementById('product-titulo').textContent = produto.titulo;
            column.getElementById('product-descricao').textContent = produto.descricao;
            column.getElementById('product-categoria').textContent = produto.categorias[0];
            column.getElementById('product-preco').textContent = `R$ ${produto.preco}`;
            column.getElementById('produto-carrinho').addEventListener('click', () => {
                const mensagem = `https://wa.me/2131232?text=Ol%C3%A1%2C%20gostaria%20de%20comprar%20o%20produto%3A%20 ${encodeURIComponent(produto.title)}`;
                window.location.href = mensagem;
            });
            produtosContainer.appendChild(column);
        });
    }

    function mensagemSemProdutos() {
        produtosContainer.innerHTML = `sem produtos`;
    }

    function configureEventListeners() {
        buscaInput.addEventListener('input', (e) => {
            busca = e.target.value.trim();
            aplicaFiltro();
        }
        );
    }

    function mostrarMensagemErro(message, type) {
        mensagem.textContent = message;
        mensagem.className = `alert alert-${type}`;
        mensagem.classList.remove('d-none');
    }

    function escondeStatus() {
        mensagem.classList.add('d-none');
    }
})();
