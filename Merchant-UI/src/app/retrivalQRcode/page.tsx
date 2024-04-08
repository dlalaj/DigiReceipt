
"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import jsQR from '../QRcode/jsQR';
import "./styles.css"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import ScannerPage from '../QRcode/page';
import Scanner from '../Scanner';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';


const ScannerPage1 = () => {
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState(false);
  const [receipt, setRe] = useState(false);
  const router = useRouter();


  useEffect(() => {
    function isUserID() {
      let obj = sessionStorage.getItem('UserID');
      setUser(!!obj);
  
      return !!obj;
  
    }
    function isReceiptID() {
      let obj = sessionStorage.getItem('ReceiptID');
      setRe(!!obj);
      return !!obj;
  
    }

    function combine() {
      let obj1 = isUserID();
      let obj2 =isReceiptID();
      let result = !(obj1 && obj2);
      setDisabled(result);
    }

    combine();
    const instervalID = setInterval(combine, 1000);

    return () => clearInterval(instervalID);



  }, [])




  return (
    <div className='container'>
      <div id="container">
        <br></br><br></br><br></br><br></br><br></br><br></br>


        <Tabs defaultValue="Scan User QR" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Scan User QR">Scan User QR</TabsTrigger>
            <TabsTrigger value="Scan Receipt QR">Scan Receipt QR</TabsTrigger>
          </TabsList>
          <TabsContent value="Scan User QR">
            <Card>
              <CardHeader>
                <CardTitle>Scan User QR</CardTitle>
                <CardDescription>
                  Please ensure that you have your User QR code readily available for scanning.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
              <div>
                {
                  user && receipt && <p>Thank you for scanning both QR codes. You may now proceed to click on 'Retrieve Receipt'</p>
                }
                {
                  user && !receipt && <p>Great! You've successfully scanned the User QR code. Now, please proceed to scan the Receipt QR code</p>
                }
                </div>

              </CardContent>
              <CardFooter className="flex justify-between">

                <Drawer>
                  <DrawerTrigger>
                    <Button>
                      Scan User QR
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <Scanner name="User"></Scanner>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose>
                        <Button style={{ width: '1390px' }}>Submit</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

                <Button disabled={disabled} onClick={() => {
                  router.push('/RetrieveReceipts?retrieveReceipts=1')
                }}> Retrieve Receipt </Button>

              </CardFooter>
            </Card>






          </TabsContent>
          <TabsContent value="Scan Receipt QR">
            <Card>
              <CardHeader>
                <CardTitle>Scan Receipt QR</CardTitle>
                <CardDescription>
                  Please ensure that you have your Receipt QR code readily available for scanning.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
              <div>
                {
                  user && receipt && <p>Thank you for scanning both QR codes. You may now proceed to click on 'Retrieve Receipt'</p>
                }
                {
                  !user && receipt && <p>Great! You've successfully scanned the Receipt QR code. Now, please proceed to scan the User QR code</p>
                }
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Drawer>
                  <DrawerTrigger>
                    <Button>Scan Receipt QR
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <Scanner name="Receipt"></Scanner>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose>
                        <Button style={{ width: '1390px' }}>Submit</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <Button disabled={disabled}> Retrieve Receipt</Button>

              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>



        {/* <Drawer>
          <DrawerTrigger>
            <button>
              Scan User QR
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader> 
              <Scanner name="User"></Scanner>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button  style={{ width: '1390px' }}>Submit</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer> */}

        {/* <Drawer>
          <DrawerTrigger>
            <button>Scan Receipt QR
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <Scanner name="Receipt QR"></Scanner>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
              <Button  style={{ width: '1390px' }}>Submit</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer> */}

      </div>
    </div>

  );
};

export default ScannerPage1;
