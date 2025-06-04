document.addEventListener('DOMContentLoaded', () => {
    // --- Rolagem Suave para Links de Navegação ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o comportamento padrão do link

            const targetId = this.getAttribute('href');
            if (targetId === '#') { // Se o href for apenas '#', não faz nada ou rola para o topo
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Rola suavemente para o elemento
                });
            }
        });
    });

    // --- Funcionalidade de Filtro de Produtos ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões de filtro
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');

            // Atualiza o atributo aria-pressed
            filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
            button.setAttribute('aria-pressed', 'true');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                const productCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || productCategory === filterValue) {
                    card.style.display = 'flex'; // Exibe o card (flex para manter o layout CSS)
                    card.setAttribute('aria-hidden', 'false'); // Torna visível para leitores de tela
                } else {
                    card.style.display = 'none'; // Esconde o card
                    card.setAttribute('aria-hidden', 'true'); // Esconde para leitores de tela
                }
            });
        });
    });

    // --- Funcionalidade do Carrinho de Compras (Básico) ---
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = cartIcon.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Carrega itens do localStorage

    const updateCartCount = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        // Atualiza o aria-label do ícone do carrinho
        cartIcon.setAttribute('aria-label', `Ver itens no carrinho de compras (${totalItems} itens)`);
    };

    const addProductToCart = (productId) => {
        // Encontra o produto no HTML para pegar os detalhes
        const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (!productCard) return; // Se o card não for encontrado, sai

        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('R$', '').replace(',', '.').trim());
        const productImage = productCard.querySelector('.product-img').src;

        const existingItemIndex = cartItems.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Salva no localStorage
        updateCartCount();
        alert(`${productName} adicionado ao carrinho!`); // Notificação simples
    };

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');
            addProductToCart(productId);
        });
    });

    // Inicializa a contagem do carrinho ao carregar a página
    updateCartCount();

    // Comportamento do ícone de carrinho (para navegação, por exemplo)
    cartIcon.addEventListener('click', () => {
        // Aqui você pode redirecionar para uma página de carrinho,
        // ou abrir um modal/sidebar com os itens do carrinho.
        // Por enquanto, vamos apenas logar os itens.
        console.log('Itens no carrinho:', cartItems);
        // window.location.href = '/carrinho'; // Exemplo de redirecionamento
    });


    // --- Funcionalidade do Ícone de Pesquisa (Exemplo: Alerta Simples) ---
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', () => {
        alert('A funcionalidade de pesquisa será implementada em breve!');
        // Em um cenário real, você exibiria um campo de busca ou modal aqui.
    });

});