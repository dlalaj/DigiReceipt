"use client"

import { useEffect, useRef } from 'react';
import styles from './styles.module.css';

const SelfCheckout1 = () => {
    const products = [
        { id: 1, name: "Cyber-chicken", price: 10.99 },
        { id: 2, name: "Firewallicious", price: 20.49 },
        { id: 3, name: "Hackadoodle", price: 5.99 },
    ];

    let cart: any = [];
    let totalAmount = 0;
    const totalRef = useRef(null);

    useEffect(() => {



        const renderProductList = () => {
            const productList = document.getElementById("productList");
            if (productList) {
                productList.innerHTML = "";

                products.forEach(product => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("productItem");
                    listItem.innerHTML = `
                        <span>${product.name}</span>
                        <span>$${product.price.toFixed(2)}</span>
                        <button class='button1212' onclick={addToCart(${product.id})}>Add to Cart</button>
                    `;
                    productList.appendChild(listItem);
                });
            }
        };





       //  renderProductList();
    }, []);
    const addToCart = (productId: any) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            updateTotal();
        }
    };



    const updateTotal = () => {
        const totalElement = totalRef;
        const totalPrice = cart.reduce((sum: any, product: any) => sum + product.price, 0);
        totalAmount = totalPrice.toFixed(2);
        if (totalElement && totalElement.current) {
            totalElement.current.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
        }
    };

    const completeCheckout = () => {
        alert("Checkout completed!\nTotal amount: $" + getTotalAmount());
        localStorage.setItem('totalAmount', totalAmount);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = "/payment"; // Redirect to the payment page
        processPayment();
        resetCart();
    };

    const getTotalAmount = () => {
        return cart.reduce((sum, product) => sum + product.price, 0).toFixed(2);
    };

    const resetCart = () => {
        cart = [];
        updateTotal();
    };

    const processPayment = () => {
        alert("Payment processed successfully!");
        window.location.href = "/Merchant/receipt"; // Redirect to the receipt page
    };

    return (
        <div id="container">
            <h1 className={styles.h1}>Self-Checkout</h1>
            <div>
                <h1 className={styles.h1}>Products:</h1>
                <ul id={styles.productList}>
                    {products.map(product => (
                        <li className={styles.productItem}>
                            <span>{product.name}</span>
                            <span>${product.price.toFixed(2)}</span>
                            <button className={styles.button1212} onClick={() => {addToCart(product.id)}}>Add to Cart</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div ref={totalRef} id="total">Total: $0.00</div>
            <button className={styles.button1212} onClick={completeCheckout}>Complete Checkout</button>
        </div>
    );
};

export default SelfCheckout1;
