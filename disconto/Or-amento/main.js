// Array para armazenar os itens do orçamento
let itensOrcamento = [];

// Elementos do DOM
const form = document.getElementById('item-form');
const tableBody = document.getElementById('table-body');
const inputDescricao = document.getElementById('descricao');
const inputQuantidade = document.getElementById('quantidade');
const inputValor = document.getElementById('valor');
const inputDesconto = document.getElementById('desconto');

const spanSubtotalGeral = document.getElementById('subtotal-geral');
const spanValorDesconto = document.getElementById('valor-desconto');
const spanTotalGeral = document.getElementById('total-geral');

// Evento de envio do formulário (Adicionar Item)
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const descricao = inputDescricao.value;
    const quantidade = parseInt(inputQuantidade.value);
    const valorUnitario = parseFloat(inputValor.value);
    const subtotal = quantidade * valorUnitario;

    // Cria o objeto do item
    const novoItem = {
        id: Date.now(), // ID único baseado no timestamp
        descricao,
        quantidade,
        valorUnitario,
        subtotal
    };

    // Adiciona ao array
    itensOrcamento.push(novoItem);

    // Atualiza a interface e limpa o formulário
    atualizarTabela();
    form.reset();
    inputQuantidade.value = "1"; // Reseta quantidade padrão para 1
});

// Função para remover um item pelo ID
function removerItem(id) {
    itensOrcamento = itensOrcamento.filter(item => item.id !== id);
    atualizarTabela();
}

// Evento para atualizar os cálculos sempre que o desconto for alterado
inputDesconto.addEventListener('input', function() {
    calcularTotais();
});

// Função para atualizar a renderização da tabela na tela
function atualizarTabela() {
    tableBody.innerHTML = ''; // Limpa a tabela atual

    if (itensOrcamento.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8;">Nenhum item adicionado.</td></tr>`;
    }

    itensOrcamento.forEach(item => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${item.descricao}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.valorUnitario.toFixed(2)}</td>
            <td>R$ ${item.subtotal.toFixed(2)}</td>
            <td><button class="btn-delete" onclick="removerItem(${item.id})">Excluir</button></td>
        `;

        tableBody.appendChild(linha);
    });

    calcularTotais();
}

// Função para calcular subtotal, valor do desconto e total final
function calcularTotais() {
    // Soma todos os subtotais dos itens
    const subtotalGeral = itensOrcamento.reduce((acc, item) => acc + item.subtotal, 0);

    // Pega a porcentagem de desconto (garante que seja entre 0 e 100)
    let percentualDesconto = parseFloat(inputDesconto.value) || 0;
    if (percentualDesconto < 0) percentualDesconto = 0;
    if (percentualDesconto > 100) percentualDesconto = 100;

    // Calcula o valor do desconto em reais
    const valorDesconto = (subtotalGeral * percentualDesconto) / 100;

    // Calcula o total final
    const totalGeral = subtotalGeral - valorDesconto;

    // Atualiza os elementos na tela formatados para moeda brasileira
    spanSubtotalGeral.textContent = `R$ ${subtotalGeral.toFixed(2)}`;
    spanValorDesconto.textContent = `R$ ${valorDesconto.toFixed(2)}`;
    spanTotalGeral.textContent = `R$ ${totalGeral.toFixed(2)}`;
}

// Inicializa a tabela vazia ao carregar a página
atualizarTabela();