const cep = document.getElementById('cep')
const rua = document.getElementById('rua')
const bairro = document.getElementById('bairro')
const cidade = document.getElementById('cidade')
const uf = document.getElementById('uf')


function buscarCep () {
    if (cep.value.length == 8) {
    fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then(res => res.json())
    .then(res => {
        rua.value = res.logradouro;
        bairro.value = res.bairro;
        cidade.value = res.localidade;
        uf.value = res.estado;
    })
    }


}



//sintaxe fetch

// fetch(url)
// .then((resposta) => {resposta.json()})
// .then( dados => {/*objeto*/})