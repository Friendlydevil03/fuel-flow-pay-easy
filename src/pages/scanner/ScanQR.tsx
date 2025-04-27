
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QRData } from "@/types";
import { useStationStore } from "@/store/stationStore";
import { ScanBarcode, Camera, CameraOff } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({
  onScan,
}: {
  onScan: (data: string) => void;
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-scanner";

  useEffect(() => {
    // Cleanup scanner when component unmounts
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Initialize scanner if it doesn't exist
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerDivId);
    }
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    // Start scanning
    scannerRef.current.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        // QR code detected
        try {
          onScan(decodedText);
          // Stop scanning after successful scan
          if (scannerRef.current) {
            scannerRef.current.stop().catch(console.error);
            setIsScanning(false);
          }
        } catch (error) {
          console.error("Error processing QR data:", error);
        }
      },
      (errorMessage) => {
        // Handle error cases but continue scanning
        console.log("QR error:", errorMessage);
      }
    ).catch(err => {
      console.error("Scanner error:", err);
      setPermissionDenied(true);
      setIsScanning(false);
    });
  };
  
  const handleStopScan = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(console.error);
      setIsScanning(false);
    }
  };
  
  // For testing: simulate a scan with mock data
  const handleSimulateScan = () => {
    const mockQrData: QRData = {
      userId: "user-001",
      walletId: "wallet-001",
      vehicleId: "vehicle-001",
      fuelType: "Regular",
      maxAmount: 200,
    };
    
    onScan(JSON.stringify(mockQrData));
    setIsScanning(false);
  };

  return (
    <Card className="border-2 border-dashed border-fuel-blue-200">
      <CardContent className="p-8 flex flex-col items-center justify-center">
        <div className="bg-fuel-blue-100 p-4 rounded-full mb-4">
          <ScanBarcode className="h-12 w-12 text-fuel-blue-500" />
        </div>
        
        {isScanning ? (
          <div className="space-y-4 text-center">
            <div className="h-[300px] w-full bg-fuel-blue-50 border-2 border-fuel-blue-200 flex flex-col items-center justify-center rounded-lg relative overflow-hidden">
              <div id={scannerDivId} className="w-full h-full"></div>
              <div className="absolute w-full h-2 bg-fuel-blue-300 opacity-70 top-0" 
                style={{ 
                  animation: "scanAnimation 2s infinite" 
                }}
              ></div>
              <style>
                {`
                  @keyframes scanAnimation {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(300px); }
                    100% { transform: translateY(0); }
                  }
                `}
              </style>
            </div>
            <p className="text-gray-500">
              Please hold still while scanning the QR code
            </p>
            <Button 
              onClick={handleStopScan} 
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-600"
            >
              <CameraOff className="h-5 w-5 mr-2" />
              Stop Scanner
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold text-fuel-blue-700">
              Ready to Scan
            </h3>
            <p className="text-gray-500">
              Scan the customer's QR code to process payment
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <Button
                onClick={handleStartScan}
                className="bg-fuel-blue-500 hover:bg-fuel-blue-600"
                disabled={permissionDenied}
              >
                <Camera className="h-5 w-5 mr-2" />
                Start Scanner
              </Button>
              
              {process.env.NODE_ENV !== 'production' && (
                <Button
                  onClick={handleSimulateScan}
                  variant="outline"
                  className="border-fuel-blue-300 text-fuel-blue-700"
                >
                  Simulate Scan (Dev)
                </Button>
              )}
            </div>
            
            {permissionDenied && (
              <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                Camera access was denied. Please check your browser permissions and try again.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ScanQR = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setScannedQrData } = useStationStore();
  
  const handleScan = (data: string) => {
    try {
      const parsedData: QRData = JSON.parse(data);
      setScannedQrData(parsedData);
      toast({
        title: "QR Code Scanned",
        description: "Customer wallet data received",
      });
      navigate(`/scanner/transaction/${parsedData.userId}`);
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "The QR code could not be processed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-fuel-blue-700">Scan Customer Code</h2>
      <QRScanner onScan={handleScan} />
    </div>
  );
};

export default ScanQR;
