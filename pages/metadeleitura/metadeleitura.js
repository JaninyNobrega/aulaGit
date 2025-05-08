const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const booksContainer = document.getElementById('booksContainer')
const metaLivros = document.getElementById('metaLivros')

searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    fetchBooks(query)

})

function fetchBooks(query) {
    booksContainer.innerHTML = `
        <img width="100px" src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif">`;
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
                : 'https://via.placeholder.com/150x200@2x?text=Sem+capa'; // Imagem padrão caso não tenha capa
            return `
                <div class="div-card w-[60px]">
                    <div class="div-img">
                        <img src='${urlImagem}' alt="capa do livro" class="w-[150px] h-auto"> 
                        <p class="tag-p">frete grátis</p>
                    </div>
                    <div class="div-texto">
                        <div class="div-titulo">
                            <h1 class="truncate text-xs font-bold w-full">${item.title}</h1>                            
                        </div>
                        <h2 class="my-2text-[12px]">${item.author_name ? item.author_name.join(', ') : 'Autor desconhecido'}</h2>
                        <button onclick="adicionarLivro('${urlImagem}')" class="w-full h-6 p-1 border border-blue-500 rounded-md flex justify-center cursor-pointer hover:bg-blue-100"><i class="text-blue-500 fa-solid fa-plus"></i></button>
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

function adicionarLivro(capa) {
    const livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];
    if (!livrosSalvos.includes(capa)) {
        livrosSalvos.push(capa);
        localStorage.setItem('metaLivros', JSON.stringify(livrosSalvos));

        // Atualiza o DOM com o novo livro
        metaLivros.innerHTML += `
            <div class="div-card w-[60px]" data-capa="${capa}">
                <div class="div-img">
                    <img src='${capa}' alt="capa do livro" class="w-[150px] h-auto">
                </div>
                <button onclick="removerLivro('${capa}')" class="w-full h-6 p-1 mt-2 border border-red-500 rounded-md flex justify-center cursor-pointer hover:bg-red-100">
                    <i class="text-red-500 fa-solid fa-trash"></i> Remover
                </button>
            </div>
        `;
    }
}

function removerLivro(capa) {
    let livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];

    // Remove o livro do array
    livrosSalvos = livrosSalvos.filter(item => item !== capa);
    localStorage.setItem('metaLivros', JSON.stringify(livrosSalvos));

    // Remove o livro do DOM
    const livroElement = document.querySelector(`[data-capa="${capa}"]`);
    if (livroElement) {
        livroElement.remove();
    }
}

document.addEventListener('DOMContentLoaded', carregarLivrosSalvos);

function carregarLivrosSalvos() {
    const livrosSalvos = JSON.parse(localStorage.getItem('metaLivros')) || [];

    // Limpa o conteúdo atual para evitar duplicação
    metaLivros.innerHTML = '';

    // Adiciona os livros salvos ao DOM
    livrosSalvos.forEach(capa => {
        metaLivros.innerHTML += `
            <div class="div-card w-[60px]" data-capa="${capa}">
                <div class="div-img">
                    <img src='${capa}' alt="capa do livro" class="w-[150px] h-auto">
                </div>
                <button onclick="removerLivro('${capa}')" class="w-full h-6 p-1 mt-2 border border-red-500 rounded-md flex justify-center cursor-pointer hover:bg-red-100">
                    <i class="text-red-500 fa-solid fa-trash"></i> Remover
                </button>
            </div>
        `;
    });
}

