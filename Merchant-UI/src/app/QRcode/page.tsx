// @ts-nocheck
"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import jsQR from './jsQR';
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


const ScannerPage = () => {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const retryBtnRef = useRef(null);
  let scanning = true;
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter()


  useEffect(() => {
    const video = videoRef.current;
    const retryBtn = retryBtnRef.current;
    const resultElement = document.getElementById('result');

    const startScanning = () => {
      if (!scanning || !video) return;

      let resultElement12 = document.getElementById('result');
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          video.srcObject = stream;
          video.play();
          video.onplay = () => {
            requestAnimationFrame(scanFrame);
          };
        })
        .catch(err => {
          console.error('Error accessing camera:', err);
          resultElement12.innerText = 'Error accessing camera. Please grant camera permission.';
        });
    };

    const scanFrame = () => {
      if (!scanning) return;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(scanFrame);
        return;
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      let resultElement12 = document.getElementById('result');



      if (code) {
        if (!(code.data === '')) {
          retryBtn.style.display = 'block';
          scanning = false;
          setIsDisabled(false);
          console.log('QR Code detected:', code.data);
          resultElement12.innerText = 'QR Code detected';
          sessionStorage.setItem('userID', code.data);
          stopScanning();
        }
      } else {
        resultElement12.innerText = 'Scanning...';
      }

      requestAnimationFrame(scanFrame);
    };

    const stopScanning = () => {
      const stream = video.srcObject;
      if (!stream) return;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());
      cancelAnimationFrame(requestAnimationFrame(scanFrame));
    };

    retryBtn.addEventListener('click', () => {
      scanning = true;
      setIsDisabled(false);
      retryBtn.style.display = 'none';
      startScanning();
    });

    startScanning();

    // Cleanup
    return () => {
      stopScanning();
    };
  }, []);

  function oneClick() {
    router.push('/Receipt')
  }

  return (
    <div className='container'>
      <div id="container">
        <br /> <br /> <br /> <br /> <br />
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Scan the QR code</CardTitle>
            <CardDescription>QR code can be found on the user app</CardDescription>
          </CardHeader>
          <CardContent>
            <video id="video" ref={videoRef} autoPlay></video>
            <p className="leading-7 [&:not(:first-child)]:mt-6" ref={resultRef} id="result">Scanning.121212..</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button id="sendButton" disabled={isDisabled} onClick={oneClick}>
              <PaperPlaneIcon className="mr-2 h-4 w-4" /> Send Receipt
            </Button>
            <Button ref={retryBtnRef} id="retryBtn" style={{ display: 'none' }}>Retry</Button>
          </CardFooter>
        </Card>


      </div>
    </div>

  );
};

export default ScannerPage;
