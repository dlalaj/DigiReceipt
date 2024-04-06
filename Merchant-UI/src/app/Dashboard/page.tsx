"use client"
import { Separator } from "@/components/ui/separator";
import "./styles.css"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()


  return (
    <main className="container">
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div id="context">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to DigiReceipt
        </h1>
      </div>
      <br />
      <div className="flex justify-center">
        <Separator className="my-4 w-23" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <Button variant="ghost" onClick={() => {
            router.push("/QRcode");
          }}>
            <div style={{ fontSize: '17px' }}>Submit Receipt</div>
          </Button>
          <Separator orientation="vertical" />
          <Button variant="ghost" onClick={() => {
            router.push("/retrivalQRcode?retrieveReceipts=1");
          }}>
            <div style={{ fontSize: '17px' }}>Retrieve Receipt</div></Button>
        </div>
      </div>
    </main>
  );
}

