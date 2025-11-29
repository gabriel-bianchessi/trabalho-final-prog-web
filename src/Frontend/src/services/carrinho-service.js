/**
 * @typedef {Object} ItemCarrinho
 * @prop {string} ItemCarrinho.id
 * @prop {string} ItemCarrinho.quantidade
 */
class CarrinhoService {
  KEY_LOCAL_STORAGE = "@fake-store-carrinho"
  
  /** @type {ItemCarrinho[] | null} */
  _itensCarrinho = null

  constructor() {
    this.recuperarItensLocalSotrage()
  }

  /**
   * @returns {ItemCarrinho[]}
   */
  get itensCarrinho() {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalSotrage()
    }
    
    return this._itensCarrinho
  }

  recuperarItensLocalSotrage() {
    try {
      const items = localStorage.getItem(this.KEY_LOCAL_STORAGE)

      /** @type {ItemCarrinho[]} */
      const parsedItems = JSON.parse(items)

      if (parsedItems === null || parsedItems === undefined) {
        this._itensCarrinho = []
      }

      
    } catch (err) {
      this._itensCarrinho = []
    }
  }

  /**
   * @param {ItemCarrinho} item 
   */
  adicionarItem({
    id,
    quantidade = 1
  }) {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalSotrage()
    }

    let carrinho = this._itensCarrinho

    if (carrinho.length === 0) {
      carrinho = [{ id, quantidade }]
    } else {
      const indexItemJaExistente = carrinho.findIndex(item => item.id === id)
      
      if (indexItemJaExistente >= 0) {
        carrinho[indexItemJaExistente].quantidade += quantidade
      } else {
        carrinho.push({id, quantidade})
      }
    }

    localStorage.setItem(this.KEY_LOCAL_STORAGE, carrinho)
    this._itensCarrinho = carrinho
  }
}

export { CarrinhoService }