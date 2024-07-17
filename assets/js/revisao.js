document.addEventListener('DOMContentLoaded', () => {
    displayStoredWords();
});

function displayStoredWords() {
    const words = JSON.parse(localStorage.getItem('words')) || [];
    const cardsDiv = document.getElementById('cards');

    cardsDiv.innerHTML = '';

    words.forEach((wordObj, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const wordPara = document.createElement('p');
        wordPara.textContent = `Palavra em inglês: ${wordObj.word}`;
        card.appendChild(wordPara);

        const translationPara = document.createElement('p');
        translationPara.textContent = `Tradução: ${wordObj.translation}`;
        translationPara.style.display = 'none';
        card.appendChild(translationPara);

        const examplesPara = document.createElement('p');
        examplesPara.innerHTML = `Exemplo: ${wordObj.examples.replace(/,/g, '<br>')}`;
        examplesPara.style.display = 'none';
        card.appendChild(examplesPara);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const toggleTranslationButton = document.createElement('button');
        toggleTranslationButton.textContent = 'Ver Tradução e Frase';
        toggleTranslationButton.addEventListener('click', () => {
            if (translationPara.style.display === 'none') {
                translationPara.style.display = 'block';
                examplesPara.style.display = 'block';
                toggleTranslationButton.textContent = 'Ocultar Tradução e Frase';
            } else {
                translationPara.style.display = 'none';
                examplesPara.style.display = 'none';
                toggleTranslationButton.textContent = 'Ver Tradução e Frase';
            }
        });
        buttonContainer.appendChild(toggleTranslationButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir Card';
        deleteButton.classList.add('delete-button'); // Adiciona a classe para estilização
        deleteButton.addEventListener('click', () => {
            // Remove o card do array de palavras
            words.splice(index, 1);
            // Atualiza o localStorage
            localStorage.setItem('words', JSON.stringify(words));
            // Atualiza a exibição dos cards
            displayStoredWords();
        });
        buttonContainer.appendChild(deleteButton);

        card.appendChild(buttonContainer);
        cardsDiv.appendChild(card);
    });
}
