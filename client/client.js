const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.meowslist');
loadingElement.style.display = '';
/*
const API_URL = 'http://localhost:5000/meow'; //POST
const GET_URL = 'http://localhost:5000/meowslist';
*/

const API_URL = 'https://meowerapp.joanafpt.vercel.app/meow';
const GET_URL = 'https://meowerapp.joanafpt.vercel.app/meowslist';


const divoutput = document.querySelector('.output'); //selects class
const outputmessage = document.createElement('div');

const getFullListOfMeows = () => {
    mewsElement.innerHTML = '';
    loadingElement.style.display = 'none';
    fetch(GET_URL)
        .then(res => res.json())
        .then(mews => {
            //console.log(mews);
            mews.reverse();
            mews.forEach(mew => {
                const hr = document.createElement('hr');
                loadingElement.style.display = 'none'; //esconder o loading?
                const div = document.createElement('div');
                const header = document.createElement('div');
                header.setAttribute("style", "color:#7c8c9c; font-size:2em;");
                header.textContent = mew.name;
                const message = document.createElement('div');
                message.setAttribute("style", "color:black; font-size:1.2em;");
                message.textContent = mew.message;
                const date = document.createElement('div');
                date.setAttribute("style", "color:#7c8c9c; font-size:0.9em;");
                date.textContent = new Date(mew.created);
                div.appendChild(header);
                div.appendChild(message);
                div.appendChild(date);
                div.appendChild(hr);
                mewsElement.appendChild(div);//mandar a div para o HTML
            });
        });
}

getFullListOfMeows();


form.addEventListener('submit', (event) => {
    event.preventDefault();
    var error = '';
    const formData = new FormData(form);
    const name = formData.get('name');
    const message = formData.get('message');

    if (name.length == 0 || message.length == 0) {
        error = "Oops! Please provide a name and a message. Thanks! 😸";
        outputmessage.textContent = error;
        divoutput.append(outputmessage);
        return;
    }
    const mew = {
        name,
        message
    };
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(createdMeow => {
            form.reset();
            /* setTimeout(() => {
                 form.style.display = '';
             }, 3600);*/
            form.style.display = '';
            getFullListOfMeows();
        });
});


