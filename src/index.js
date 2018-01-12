import 'normalize.css';
import './index.scss';
import alphabet from './alphabet';

function createLetterRow(letter) {
    const letterObj = alphabet[letter];
    const inputId = `letter-${letter}`;

    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.innerText = `${letter} ${letterObj.lower}`;
    label.classList.add('alphabet__letter__label');

    const input = document.createElement('input');
    input.id = inputId;
    input.autocomplete = 'off';
    input.dataset.letter = letter;
    input.disabled = letterObj.latin === '';
    input.classList.add('alphabet__letter__input');

    const response = document.createElement('span');
    response.innerText = letterObj.latin;
    response.classList.add('alphabet__letter__response');

    const container = document.createElement('div');
    container.classList.add('alphabet__letter');
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(response);

    return container;
}

function validate(event) {
    event.preventDefault();

    const form = document.querySelector('#alphabet');
    const inputs = document.querySelectorAll('input:not([disabled])');
    const result = document.querySelector('#result');

    let nbSuccess = 0;

    result.innerHTML = '';
    Array.prototype.forEach.call(inputs, (input) => {
        input.classList.remove('alphabet__letter__input--valid');
        input.classList.remove('alphabet__letter__input--invalid');

        if (!input.value || input.value.toLowerCase() !== alphabet[input.dataset.letter].latin.toLowerCase()) {
            input.classList.add('alphabet__letter__input--invalid');
        } else {
            input.classList.add('alphabet__letter__input--valid');
            nbSuccess++;
        }
    });

    form.classList.add('alphabet--submitted');
    result.innerHTML = `You scored: ${nbSuccess} / ${inputs.length}`;
}

window.addEventListener('load', () => {
    const form = document.querySelector('#alphabet');
    const submit = document.querySelector('#submit');
    const fragment = document.createDocumentFragment();

    Object.keys(alphabet).forEach((letter) => {
        fragment.appendChild(createLetterRow(letter));
    });

    form.addEventListener('submit', validate);
    form.insertBefore(fragment, submit);
    form.appendChild(fragment);
});
