
const url = 'http://localhost:5000/receiveReceipts'

let array = ['ProductA', 'ProductB']
const data = {
    merchantID: 12,
    receipt: array, 
    userID: 121212
};


const requestOptions = {
    method: 'POST', 
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
