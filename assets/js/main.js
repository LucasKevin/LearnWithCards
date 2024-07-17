document.querySelector('#formulario').addEventListener('submit', evento);
document.querySelector('#verCards').addEventListener('click', displayStoredWords);


async function evento(event) {
    event.preventDefault();
    const form = document.querySelector('#formulario');
    const newWord = form.querySelector('#palavra').value.trim();

    if (!newWord) {
        alert('Por favor, insira uma palavra.');
        return;
    }

    try {
        // Chamar a API do Google Tradutor com a chave de API
        const translation = await fetchTranslation(newWord);
        const examples = await fetchExamples(newWord);

        // Exibir tradução e exemplos na div resultado
        const resultadoDiv = document.querySelector('#resultado');
        resultadoDiv.innerHTML = `
            <p><strong>Palavra:</strong> ${newWord}</p>
            <p><strong>Tradução:</strong> ${translation}</p>
            <p><strong>Exemplo:</strong> ${examples}</p>
        `;
        
        // Guardar a palavra, tradução e exemplos em localStorage
        storeWord(newWord, translation, examples);

        alert(`Palavra "${newWord}" guardada com sucesso!`);
    } catch (error) {
        console.error('Erro ao processar a tradução e os exemplos:', error);
        alert('Ocorreu um erro ao processar a tradução e os exemplos. Por favor, tente novamente.');
    }
}

async function fetchTranslation(word) {
    const apiKey = ''; // API do Google Tradutor
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            q: word,
            target: 'pt'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error.message);
    }
    return data.data.translations[0].translatedText;
}

async function fetchExamples(word) {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/examples`;
    const apiKey = ''; // chave de API da Words API
    const host = 'wordsapiv1.p.rapidapi.com';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': host
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }

    // Limita a quantidade de caracteres do exemplo
    const maxChars = 150; // Defina o número máximo de caracteres desejado
    let exampleText = data.examples.join(', '); // Concatenar exemplos em uma string

    // Truncar o texto se exceder o limite de caracteres
    if (exampleText.length > maxChars) {
        exampleText = exampleText.substring(0, maxChars) + '...';
    }

    return exampleText;
}

function storeWord(word, translation, examples) {
    // Obtém as palavras guardadas do localStorage ou inicializa um array vazio
    const words = JSON.parse(localStorage.getItem('words')) || [];

    // Verifica se a palavra já está na lista
    const existingWord = words.find(item => item.word === word);
    if (existingWord) {
        alert(`A palavra "${word}" já está guardada.`);
        return; // Sai da função se a palavra já existe
    }

    // Adiciona a nova palavra, tradução e exemplos ao array
    words.push({ word, translation, examples });

    // Armazena o array atualizado de palavras no localStorage
    localStorage.setItem('words', JSON.stringify(words));
}

function openSavedCards() {
    window.open('revisao.html', '_blank');
}

function displayStoredWords() {
    const words = JSON.parse(localStorage.getItem('words')) || [];
    const resultDiv = document.getElementById('resultado');

    // Limpa o conteúdo anterior
    resultDiv.innerHTML = '';

    // Adiciona os cards para cada palavra guardada
    words.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        const wordPara = document.createElement('p');
        wordPara.textContent = `Palavra: ${item.word}`;
        card.appendChild(wordPara);

        const translationPara = document.createElement('p');
        translationPara.textContent = `Tradução: ${item.translation}`;
        translationPara.classList.add('translation');
        card.appendChild(translationPara);

        const examplesPara = document.createElement('p');
        examplesPara.innerHTML = `Exemplo: ${item.examples.replace(/,/g, '<br>')}`;
        card.appendChild(examplesPara);

        resultDiv.appendChild(card);
    });
}
