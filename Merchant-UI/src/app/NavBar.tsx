"use client"
import Link from "next/link"
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import path from "path";

const Navbar = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const isRetrival = !!params.get('retrieveReceipts');
  const isMerchant = pathname.includes("/Merchant/");
  console.log(isRetrival);

  if (isMerchant) {
    return (
      <div>
        <br /> <br /> <br /> <br /> 
      </div>);
  }


  return (

    <header className="sticky top-0 flex flex-col md:flex-row h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/Merchant/index"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/"
          className="text-foreground transition-colors hover:text-foreground"
        >
          DigiRecieipt
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link href="#" className="hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </SheetContent>
      </Sheet>



      <div className="flex-1 flex justify-center items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {
                pathname != "/Dashboard" ?
                  <BreadcrumbLink>
                    <Link href="/Dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                  :
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>

              }
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {
                isRetrival ?
                  pathname != "/retrivalQRcode" ?
                    <BreadcrumbLink>
                      <Link href="/retrivalQRcode?retrieveReceipts=1">Scan QR Code</Link>
                    </BreadcrumbLink>
                    :
                    <BreadcrumbPage>Scan QR Code</BreadcrumbPage>
                  :
                  pathname != "/QRcode" ?
                    <BreadcrumbLink>
                      <Link href="/QRcode">Scan QR Code</Link>
                    </BreadcrumbLink>
                    :
                    <BreadcrumbPage>Scan QR Code</BreadcrumbPage>


              }
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {

                isRetrival ?
                  pathname != "/RetrieveReceipts" ?
                    <BreadcrumbLink>
                      <Link href="/RetrieveReceipts?retrieveReceipts=1">Retrieve Receipt</Link>
                    </BreadcrumbLink>

                    :
                    <BreadcrumbPage>Retrieve Receipt</BreadcrumbPage>




                  :
                  pathname != "/Receipt" ?
                    <BreadcrumbLink>
                      <Link href="/Receipt">Send Receipt</Link>
                    </BreadcrumbLink>

                    :
                    <BreadcrumbPage>Send Receipt</BreadcrumbPage>



              }

            </BreadcrumbItem>
            {
              isRetrival ?
                <div></div>
                :

                <><BreadcrumbSeparator /><BreadcrumbItem>
                  {pathname != "/Confirmation" ?
                    <BreadcrumbLink>
                      <Link href="/Confirmation">Confirmation</Link>
                    </BreadcrumbLink>
                    :
                    <BreadcrumbPage>Confirmation</BreadcrumbPage>}

                </BreadcrumbItem></>


            }

          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <Link href="/">Documentation</Link>

      </div>
    </header>

  );
};

export default Navbar;
