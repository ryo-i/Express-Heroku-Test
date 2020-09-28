const env = document.querySelector('.env');
const url = '/env';

// Read
const readFetch = () => {
    fetch(url).then((response) => {
        if(!response.ok) {
            console.log('Read error!');
            throw new Error('error');
        } 
        console.log('Read ok!');
        return response.text();
    }).then((data)  => {
        console.log(data);
        appendList(data);
    }).catch((error) => {
        console.log(error);
    });
};

readFetch();


// Append List
const appendList = (thisData) => {
    const li = document.createElement('li');
    li.innerHTML = 'こんにちは、' + thisData + 'さん！';
    env.appendChild(li);
};