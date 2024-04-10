'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import './style.css';

function MyComponent() {
    const [data, setData] = useState(null);
    const [fail, setF] = useState(false);
    let onetime = 0;

    useEffect(() => {
        // Function to fetch data
        async function fetchData() {
            try {
                const finalSale = sessionStorage.getItem('purchase');
                const userID = sessionStorage.getItem('userID');

                if (!userID || !finalSale) {
                    // @ts-ignore
                    setData('hello');
                    setF(true);
                    return;
                }

                const parsedFinalSale = JSON.parse(finalSale);
                const currentTime = getCurrentTime();

                setTimeout(() => {
                    if (onetime === 0) {
                        sendReceipts(userID, parsedFinalSale, currentTime);
                        // setData("hello");
                        onetime++;

                    }

                }, 1000);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);


    function sendReceipts(userID: string, finalSale: any, currentTime: string) {
        const sendUrl = 'https://127.0.0.1:5000/sendreceipt';
        const data = {
            cid: Number(userID),
            mid: 12,
            time: currentTime,
            purchases: JSON.stringify(finalSale)
        };

        const requestOptions = {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        };

        fetch(sendUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
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
                console.error('There was a problem with the fetch operation:', error);
            });

    }


    return (
        <div>
            <br /> <br /> <br /> <br /> <br />  <br /> <br /> <br /> <br /> <br /> <br /> <br />
            <div className='container3'>
                {/* <h3 className="text-2xl font-bold tracking-tight">
                            Your Receipt has been send to your account
                        </h3>
                        <br />
                        <p className="text-sm text-muted-foreground">
                            You can view your exisiting Receipts on the app!
                        </p> */}
            </div>

            {!data ? (


                <div className="container3">

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
                                          <h3 className="text-2xl font-bold tracking-tight">
                                          Transcation falied, try again!
                        </h3>
                        
                    </div>

                    :
                    <div className='container3'>

                        <h3 className="text-2xl font-bold tracking-tight">
                            Your Receipt has been send to your account
                        </h3>
                        <br />
                        <p className="text-sm text-muted-foreground">
                            You can view your exisiting Receipts on the app!
                        </p>
                    </div>

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






