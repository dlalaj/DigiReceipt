'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import './style.css';
import Home12 from './Receipt';

function MyComponent() {
    const [data, setData] = useState(null);
    const [fail, setF] = useState(false);
    let onetime = 0;

    useEffect(() => {
        // Function to fetch data
        async function fetchData() {
            try {
                const ReceiptID = sessionStorage.getItem('ReceiptID');
                const userID = sessionStorage.getItem('UserID');

                if (!userID || !ReceiptID) {
                    // @ts-ignore
                    setData('hello');
                    setF(true);
                    return;
                }



                setTimeout(() => {
                    if (onetime === 0) {
                        onetime++;
                        sendReceipts(userID, ReceiptID);
                        // setData("hello");


                    }

                }, 3000);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);


    function sendReceipts(userID: string, ReceiptID: string) {
        const sendUrl = 'https://4.206.218.68:5000/validatereceipt';
        const data = {
            cid: userID,
            qrdata: ReceiptID
        };

        const requestOptions = {

            method: 'POST',
            // mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        };

        fetch(sendUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    // @ts-ignore
                    setData('hello');
                    setF(true);
                    throw new Error("Did not work!")
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                setData(data);
                sessionStorage.clear();
                localStorage.clear();

            })
            .catch(error => {
                setF(true);
                console.error('There was a problem with the fetch operation:', error);
            });

    }


    return (
        <div>

            {/* <div className='container3'> */}
            {/* <h3 className="text-2xl font-bold tracking-tight">
                            Your Receipt has been send to your account
                        </h3>
                        <br />
                        <p className="text-sm text-muted-foreground">
                            You can view your exisiting Receipts on the app!
                        </p> */}
            {/* </div> */}

            {!data ? (



                <div className="container3">
                    <br /> <br /> <br /> <br /> <br />  <br /> <br /> <br /> <br /> <br /> <br /> <br />

                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>


            )

                : (
                    fail ?
                        <div className='container3'>
                            <br /> <br /> <br /> <br /> <br />  <br /> <br /> <br /> <br /> <br /> <br /> <br />
                            <h3 className="text-2xl font-bold tracking-tight">
                                Transcation falied, try again!
                            </h3>

                        </div>

                        :


                        <Home12 purchase={data}></Home12>


                )}


        </div>



    );
}

export default MyComponent;

const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const millisecond = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
};






