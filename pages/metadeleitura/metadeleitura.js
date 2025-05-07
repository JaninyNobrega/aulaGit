const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const booksContainer = document.getElementById('booksContainer')

searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    fetchBooks(query)

})

function fetchBooks(query) {
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(dados => {
        const livrosFiltrados = dados.docs.filter(item =>
            item.language && item.language.includes('por') && // Garante que o idioma seja português
            item.title.toLowerCase().includes(query) // Verifica se o título contém a consulta
        ).slice(0, 10);

        if (livrosFiltrados.length === 0) {
            booksContainer.innerHTML = '<h1>Nenhum livro encontrado</h1>';
            return;
        }
    
        booksContainer.innerHTML = livrosFiltrados.map(item => {
            const urlImagem = item.cover_i 
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                : 'https://via.placeholder.com/150'; // Imagem padrão caso não tenha capa
            return `
                <div class="div-card">
                    <div class="div-img">
                        <img src='${urlImagem}' alt="capa do livro">
                        <p class="tag-p">frete grátis</p>
                    </div>
                    <div class="div-texto">
                        <div class="div-titulo">
                            <h1>${item.title}</h1>
                            <button>+</button>
                        </div>
                        <h2>${item.author_name ? item.author_name.join(', ') : 'Autor desconhecido'}</h2>
                    </div>
                </div>             
            `;
        }).join('');
    })
    .catch(erro => {
        console.log('Erro ao buscar livros:', erro);
        booksContainer.innerHTML = '<h1>Erro ao buscar livros</h1>';
    });
}
