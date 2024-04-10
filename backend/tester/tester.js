
const url = 'https://127.0.0.1:5000/sendreceipt'

let array = ['ProductA', 'ProductB']
const data = {
    cid: 1,
    mid: 12,
    time: "2021-09-09 15:44:15.817857",
    purchases: JSON.stringify(array)
};


const requestOptions = {
    method: 'POST',
    mode: 'no-cors',
    // credentials: 'include',
    headers: {
        'Content-Type': 'application/json',

    },
    body: JSON.stringify(data)
};


fetch(url, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
