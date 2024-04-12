
// const url = 'https://127.0.0.1:5000/sendreceipt'

const url = 'https://127.0.0.1:5000/query-user-receipt'

// const url = 'https://127.0.0.1:5000/signup'

// const url = 'https://127.0.0.1:5000/validatereceipt'




let array = ['ProductA', 'ProductB']
// const data = {
//     cid: 1,
//     mid: 12,
//     time: "2021-09-09 15:44:15.817857",
//     purchases: JSON.stringify(array)
// };

const data = {
    cid: "1",
    username : "Ranbir",
    password : "VerySecure",
    qrdata : "1ed4b8fc23a824276d65c8f0d01775b8ab167629fc385808266b39ac07d7855cb99ffd31"
    // qrdata : "1ed4b8fc23a824276d65c8f0d01775b8ab167629fc385808266b39ac07d7855cb99ffd30"
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
            console.log(response)
            // console.log(response.error);
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
