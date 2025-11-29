export class CarrinhoToProductDto {
  /**
   * @typedef {Object} ItemCarrinho
   * @typedef {import('../models/product.js').Product} produtos
   * @prop {string} ItemCarrinho.id
   * @prop {string} ItemCarrinho.quantidade
   *
   * @param {ItemCarrinho[]} carrinho
   * @param {import('../models/product.js').Product} produtos 
   */
  static parse(carrinho, produtos) {

    /**
     * @type {prod}
     */
    const produtosCarrinho = carrinho.reduce([], {});
  }
}
