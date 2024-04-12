// @ts-nocheck
"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Copy, CreditCard, MoreHorizontal, MoreVertical, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

// const obj = {
//   "id": 3,
//   "purchases": "{\"items\":[{\"id\":3,\"name\":\"Hackadoodle\",\"price\":5.99,\"totalNumber\":2,\"totalPrice\":11.98}],\"userID\":\"1\",\"merchantID\":12,\"total\":\"13.42\",\"totalTax\":1.44,\"totalBeforeTax\":\"11.98\",\"tax\":5,\"OrderID\":\"hspwlxwscp\",\"time\":\"April 10, 2024\",\"merchantName\":\"CyberSecure Bistro\",\"gstTotal\":0.84,\"pstTotal\":0.6}",
//   "time": "Wed, 10 Apr 2024 19:08:46 GMT"
// }

let onetime = 0;
export default function Home12({purchase}) {
  let obj = purchase;
  purchase = (obj.purchases);
  console.log(purchase);
  let orderID = purchase.OrderID;
  let formattedDate = obj.time;
  let totalBeforeTax = Number(purchase.totalBeforeTax);
  let total = Number(purchase.total)
  let PSTtax = Number(purchase.pstTotal);
  let GSTtax = Number(purchase.gstTotal);
  const router = useRouter()


  let finalSale = [];

  for(const items of purchase.items) {
    finalSale.push(items);
  }




  return (
    <main>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order ID: {orderID}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>Date: {formattedDate}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {
                finalSale.map((item, index) => (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {item.name} x <span>{item.totalNumber}</span>
                    </span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </li>

                ))

              }
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalBeforeTax.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">GST Tax</span>
                <span>${GSTtax}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">PST Tax</span>
                <span>${PSTtax}</span>
              </li>
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$5.00</span>
              </li> */}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>${(total).toFixed(2)}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Merchant Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>CyberSecure Bistro</span>
                <span>2040 Two-Factor Authentication Circle</span>
                <span>Malware Boulevard, Vancouver</span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as merchant address
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>DigiReceipt Customer | N/A</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">DigiReceipt Email | N/A</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">DigiReceipt Phone | N/A</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Visa
                </dt>
                <dd>**** **** **** 4532</dd>
              </div>
            </dl>
          </div>

        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          {/* <Button variant="outline" onClick={() => router.push('/QRcode')}> Go Back</Button> */}
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <AlertDialog>
                  <AlertDialogTrigger><Button>Go back to Dashboard</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. If you need to come back to retrieve receipts, you would need to scan both QR codes again!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <Button onClick={() => {
                          router.push('/Dashboard')
                        }}> Confirm</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

    </main>
  );
}

