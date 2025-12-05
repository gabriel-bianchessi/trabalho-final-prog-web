import { ProductsService } from '../services/products-service.js';
import { CarrinhoService } from '../services/carrinho-service.js';
import { CarrinhoToProductDto } from '../dto/carrinho-to-products.js';
import { toast } from './toast.js';

(async () => {
    "use strict";

    const productsService = new ProductsService();
    const carrinhoService = new CarrinhoService();
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const totalItems = document.getElementById('total-items');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const mensagem = document.getElementById('status-message');
    const cartCount = document.getElementById('cart-count');

    /**
     * @type { {id: number; titulo: string; preco: number; imagem_url: string; quantidade: number; categorias: string[]} }[]
    */
    let produtos = [];

    await loadProducts();
    renderizarCarrinho();
    atualizarBadgeCarrinho();
    configureEventListeners();

    async function loadProducts() {
        try {
            const data = await productsService.getAllProducts();
            produtos = data;
        } catch (error) {
            toast.error('Erro ao carregar produtos. Tente novamente mais tarde.');
            console.error('Erro ao carregar produtos:', error);
        }
    }

    function configureEventListeners() {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente limpar todo o carrinho?')) {
                carrinhoService.limparCarrinho();
                renderizarCarrinho();
                atualizarBadgeCarrinho();
                toast.info('Carrinho limpo com sucesso!');
            }
        });

        checkoutBtn.addEventListener('click', async () => {
            await finalizarCompra();
        });
    }

    function atualizarBadgeCarrinho() {
        const total = carrinhoService.totalItens;
        cartCount.textContent = total;
        cartCount.style.display = total > 0 ? 'inline' : 'none';
    }

    function renderizarCarrinho() {
        const itensCarrinho = carrinhoService.itensCarrinho;
        
        if (itensCarrinho.length === 0) {
            cartItemsContainer.classList.add('d-none');
            cartEmptyMessage.classList.remove('d-none');
            cartSubtotal.textContent = 'R$ 0,00';
            cartTotal.textContent = 'R$ 0,00';
            totalItems.textContent = '0';
            checkoutBtn.disabled = true;
            clearCartBtn.disabled = true;
            return;
        }

        cartItemsContainer.classList.remove('d-none');
        cartEmptyMessage.classList.add('d-none');
        checkoutBtn.disabled = false;
        clearCartBtn.disabled = false;
        
        let total = 0;
        let totalQtd = 0;
        cartItemsContainer.innerHTML = '';

        itensCarrinho.forEach(item => {
            const produto = produtos.find(p => p.id === parseInt(item.id));
            if (!produto) return;

            const preco = parseFloat(produto.preco);
            const subtotal = preco * item.quantidade;
            total += subtotal;
            totalQtd += item.quantidade;

            const itemCard = document.createElement('div');
            itemCard.className = 'card mb-3';
            itemCard.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            <img src="${produto.imagem_url}" class="img-fluid rounded" alt="${produto.titulo}" style="max-height: 100px; object-fit: contain;">
                        </div>
                        <div class="col-md-4">
                            <h5 class="card-title mb-1">${produto.titulo}</h5>
                            <p class="text-muted mb-1"><small>${produto.categorias[0] || 'Sem categoria'}</small></p>
                            <p class="text-muted mb-0"><small>Preço unitário: <strong>R$ ${preco.toFixed(2)}</strong></small></p>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label mb-1"><small>Quantidade:</small></label>
                            <div class="input-group">
                                <button class="btn btn-outline-secondary btn-sm" type="button" data-action="decrement" data-id="${item.id}">
                                    <strong>−</strong>
                                </button>
                                <input type="number" class="form-control form-control-sm text-center" value="${item.quantidade}" min="1" max="99" readonly>
                                <button class="btn btn-outline-secondary btn-sm" type="button" data-action="increment" data-id="${item.id}">
                                    <strong>+</strong>
                                </button>
                            </div>
                            <small class="text-muted">Estoque: ${produto.quantidade}</small>
                        </div>
                        <div class="col-md-2 text-center">
                            <p class="mb-0"><small class="text-muted">Subtotal:</small></p>
                            <h5 class="text-success mb-0">R$ ${subtotal.toFixed(2)}</h5>
                        </div>
                        <div class="col-md-1 text-center">
                            <button class="btn btn-danger btn-sm" data-action="remove" data-id="${item.id}" title="Remover do carrinho">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemCard);
        });

        // Adicionar event listeners aos botões
        document.querySelectorAll('[data-action="increment"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                incrementarQuantidade(id);
            });
        });

        document.querySelectorAll('[data-action="decrement"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                decrementarQuantidade(id);
            });
        });

        document.querySelectorAll('[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                removerDoCarrinho(id);
            });
        });

        cartSubtotal.textContent = `R$ ${total.toFixed(2)}`;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        totalItems.textContent = totalQtd;
    }

    function incrementarQuantidade(id) {
        const item = carrinhoService.itensCarrinho.find(i => i.id === id);
        const produto = produtos.find(p => p.id === parseInt(id));
        
        if (item && produto) {
            if (item.quantidade >= produto.quantidade) {
                toast.warning('Quantidade máxima disponível em estoque atingida!');
                return;
            }
            carrinhoService.atualizarQuantidade(id, item.quantidade + 1);
            renderizarCarrinho();
            atualizarBadgeCarrinho();
        }
    }

    function decrementarQuantidade(id) {
        const item = carrinhoService.itensCarrinho.find(i => i.id === id);
        if (item && item.quantidade > 1) {
            carrinhoService.atualizarQuantidade(id, item.quantidade - 1);
            renderizarCarrinho();
            atualizarBadgeCarrinho();
        } else if (item && item.quantidade === 1) {
            if (confirm('Deseja remover este item do carrinho?')) {
                removerDoCarrinho(id);
            }
        }
    }

    function removerDoCarrinho(id) {
        carrinhoService.removerItem(id);
        renderizarCarrinho();
        atualizarBadgeCarrinho();
        toast.info('Produto removido do carrinho!');
    }

    async function finalizarCompra() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            toast.warning('Você precisa estar logado para finalizar a compra!');
            setTimeout(() => {
                // Redirecionar para página de login se existir
                // window.location.href = 'login.html';
            }, 2000);
            return;
        }

        const itensCarrinho = carrinhoService.itensCarrinho;
        const produtosParaCompra = CarrinhoToProductDto.parse(itensCarrinho);

        try {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';

            const response = await fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ produtos: produtosParaCompra })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao finalizar compra');
            }

            const pedido = await response.json();
            
            carrinhoService.limparCarrinho();
            renderizarCarrinho();
            atualizarBadgeCarrinho();
            
            toast.success(`Pedido #${pedido.id} realizado com sucesso! Total: R$ ${pedido.valor_total.toFixed(2)}`, 5000);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
            
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            toast.error(`Erro ao finalizar compra: ${error.message}`);
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Finalizar Compra';
        }
    }

})();
