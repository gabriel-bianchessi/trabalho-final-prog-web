import { ProductsService } from '../services/products-service.js';
import { CategoriesService } from '../services/categories-service.js';

(() => {
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
     * @type {import('../models/product.js').Product[]}
     */
    let produtos = [];
    /**
     * @type {string[]}
     */
    let categorias = [];
    let produtosFiltrados = [];
    let categoriaAtiva = null;
    let busca = '';

    loadAllData();
    loadCategories();
    configureEventListeners();

    function loadAllData() {
        productsService.getAllProducts()
            .then(data => {
                produtos = data;
                produtosFiltrados = [...produtos];
                renderizarProdutos();
                escondeStatus();
            })
            .catch(error => {
                mostrarMensagemErro('Erro ao carregar produtos. Tente novamente mais tarde.', 'danger');
                console.error('Erro ao carregar produtos:', error);
            });
    }

    function loadCategories() {
        categoriesService.getAllCategories()
            .then(data => {
                categorias = [...data];
                renderizarCategorias();
                escondeStatus();
            })
            .catch(error => {
                mostrarMensagemErro('Erro ao carregar categorias. Tente novamente mais tarde.', 'danger');
                console.error('Erro ao carregar categorias:', error);
            });
    }

    function aplicaFiltro() {
        let result = [...produtos];

        if (categoriaAtiva) {
            result = result.filter(product =>
                product.category === categoriaAtiva
            );
        }

        if (busca) {
            const termo = busca.toLowerCase();
            result = result.filter(product => {
                const titleMatch = product.title.toLowerCase().includes(termo);
                const descriptionMatch = product.description.toLowerCase().includes(termo);
                return titleMatch || descriptionMatch;
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
            elementoBotao.textContent = item;
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
            column.getElementById('product-imagem').src = produto.image;
            column.getElementById('product-titulo').textContent = produto.title;
            column.getElementById('product-descricao').textContent = produto.description;
            column.getElementById('product-categoria').textContent = produto.category;
            column.getElementById('product-preco').textContent = `R$ ${produto.price.toFixed(2)}`;
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
