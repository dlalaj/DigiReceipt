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

// const items = [
//   { id: 1, name: "Cyber-chicken", price: 10.99 },
//   { id: 2, name: "Firewallicious", price: 20.49 },
//   { id: 3, name: "Hackadoodle", price: 5.99 },
//   { id: 1, name: "Cyber-chicken", price: 10.99 },
//   { id: 2, name: "Firewallicious", price: 20.49 },
//   { id: 3, name: "Hackadoodle", price: 5.99 }
// ];

const items = JSON.parse(localStorage.getItem('cart'));
const orderID = localStorage.getItem("orderID");

let finalSale = [];

let totalAmount = 0;

function checkifExist(finalSale: [{}], checkItem: {}) {
  for (let i = 0; i < finalSale.length; i++) {
    let tmp = finalSale[i];
    if (tmp.id === checkItem.id) {
      totalAmount += tmp.price;
      tmp.totalNumber++;
      tmp.totalPrice += tmp.price;
      return;
    }
  }
  checkItem['totalNumber'] = 1;
  totalAmount += checkItem.price;
  checkItem.totalPrice = checkItem.price;
  finalSale.push(checkItem);

}




let onetime = 0





export default function Home() {

  if (onetime === 0) {
    onetime++;
    for (let i = 0; i < items.length; i++) {
      checkifExist(finalSale, items[i]);
    }
  }





  const today = new Date();

  // Format the date as "Month DD, YYYY"
  const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const router = useRouter()

  // SendRescipts();
  const PSTtax = Number(Number(totalAmount * 5 / 100).toFixed(2));
  const GSTtax = Number(Number(totalAmount * 7 / 100).toFixed(2));
  const EveryAmount = Number(totalAmount + PSTtax + GSTtax).toFixed(2);



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
                <span>${totalAmount.toFixed(2)}</span>
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
                <span>${(EveryAmount)}</span>
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
          <Button variant="outline" onClick={() => router.push('/QRcode')}> Go Back</Button>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <AlertDialog>
                  <AlertDialogTrigger><Button>Send Receipt</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This action will send your receipt to the server with the given account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <Button onClick={() => {
                          let Purchase = {};
                          Purchase['items'] = finalSale;
                          Purchase['userID'] = sessionStorage.getItem('userID');
                          Purchase['merchantID'] = 12;
                          Purchase['total'] = Number(EveryAmount);
                          Purchase['totalTax'] = Number(PSTtax + GSTtax);
                          Purchase['totalBeforeTax'] = Number(totalAmount.toFixed(2));
                          Purchase['OrderID'] = orderID;
                          Purchase['time'] = formattedDate;
                          Purchase['merchantName'] = "CyberSecure Bistro";
                          Purchase['gstTotal'] = Number(GSTtax);
                          Purchase['pstTotal'] = Number(PSTtax);
                          sessionStorage.setItem('purchase', JSON.stringify(Purchase));
                          router.push('/Confirmation')
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

