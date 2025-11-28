export class ProductsService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getAllProducts() {
        const retorno = fetch(`${this.baseUrl}/produtos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar produtos');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erro ao buscar produtos:', error);
                throw error;
            });

        return retorno;
    }

    getCategories() {
        const retorno = fetch(`${this.baseUrl}/produtos/categories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar categorias');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erro ao buscar categorias:', error);
                throw error;
            });
        return retorno;
    }

    getProductsByCategory(category) {
        const retorno = fetch(`${this.baseUrl}/products/category/${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar produtos da categoria');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erro ao buscar produtos por categoria:', error);
                throw error;
            });
        return retorno;
    }
}
