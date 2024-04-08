// @ts-nocheck
'use client'
import { useEffect } from 'react';
import styles from '../index/styles.module.css'


const SelfCheckout2 = () => {
    // Component logic remains the same
    let onetime = 0;
    useEffect(() => {


        function displayReceipt(items) {
            var receiptContainer = document.getElementById('receipt-container');
            var totalAmount = 0;
        
            // Create HTML elements for each item
            items.forEach(function(item) {
                var itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
        
                // Display item details
                var itemName = document.createElement('span');
                itemName.textContent = item.name;
                itemDiv.appendChild(itemName);
        
                var itemPrice = document.createElement('span');
                itemPrice.textContent = ' $' + item.price.toFixed(2);
                itemDiv.appendChild(itemPrice);
        
                // Add the item to the receipt container
                receiptContainer.appendChild(itemDiv);
        
                // Update total amount
                totalAmount += item.price;
            });
        
            // Display total amount
            var totalDiv = document.createElement('div');
            totalDiv.innerHTML = '<strong>Total:</strong> $' + totalAmount.toFixed(2);
            receiptContainer.appendChild(totalDiv);
        }

        function displayReceiptDetails() {
            const receiptDetails = document.getElementById("receiptDetails");
            
            // Retrieve total amount from localStorage
            let totalAmount = localStorage.getItem('totalAmount');
            
            let cart = JSON.parse(localStorage.getItem("cart"));
        
            console.log(cart);
        
            if (totalAmount) {
                receiptDetails.innerHTML = `<p>Thank you for your purchase!</p>
                                             <p>Here's your Receipt</p>`;
                displayReceipt(cart);
            } else {
                receiptDetails.textContent = "No receipt details available.";
            }
        }

        if(onetime === 0) {
            onetime++;
            displayReceiptDetails();
            

        }

        

    }, [])

    function submitButton() {
        let cart = JSON.parse(localStorage.getItem("cart"));
        let orderID = generateRandomString(10);
        localStorage.setItem("orderID", orderID);

        let name = "http://localhost:3000/Dashboard"
        
        window.location.href = name;
    }


    return (
        <main id="body" className={styles.body}>
            <div className={styles.container}>
                <div id="container" className={styles.container}>
                    <h2>Receipt</h2>
                    <div id="receiptDetails"></div>
                    <br />
                    <div id="receipt-container"></div>
                </div>
                <div
                    className={styles.digiReceiptButton}>
                    <button onClick={submitButton} className={styles.button1212} type="button">Use DigiReceipt</button>
                </div>
            </div>
        </main>
    );
};

export default SelfCheckout2;


function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }