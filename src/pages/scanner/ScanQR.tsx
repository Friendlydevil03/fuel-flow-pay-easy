
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QRData } from "@/types";
import { useStationStore } from "@/store/stationStore";
import { ScanBarcode } from "lucide-react";

// Mock scanner component
const QRScanner = ({
  onScan,
}: {
  onScan: (data: string) => void;
}) => {
  const [isScanning, setIsScanning] = useState(false);
  
  const handleStartScan = () => {
    setIsScanning(true);
    
    // Simulate a scan after 2 seconds
    setTimeout(() => {
      const mockQrData: QRData = {
        userId: "user-001",
        walletId: "wallet-001",
        vehicleId: "vehicle-001",
        fuelType: "Regular",
        maxAmount: 200,
      };
      
      onScan(JSON.stringify(mockQrData));
      setIsScanning(false);
    }, 2000);
  };
  
  return (
    <Card className="border-2 border-dashed border-fuel-blue-200">
      <CardContent className="p-8 flex flex-col items-center justify-center">
        <div className="bg-fuel-blue-100 p-4 rounded-full mb-4">
          <ScanBarcode className="h-12 w-12 text-fuel-blue-500" />
        </div>
        
        {isScanning ? (
          <div className="space-y-4 text-center">
            <div className="h-[200px] w-[200px] bg-fuel-blue-50 border-2 border-fuel-blue-200 flex items-center justify-center rounded-lg relative overflow-hidden">
              {/* Scanning animation */}
              <div className="absolute w-full h-2 bg-fuel-blue-300 opacity-70 top-0" 
                style={{ 
                  animation: "scanAnimation 2s infinite" 
                }}
              ></div>
              <style>
                {`
                  @keyframes scanAnimation {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(200px); }
                    100% { transform: translateY(0); }
                  }
                `}
              </style>
              <p className="text-fuel-blue-500 font-semibold">Scanning...</p>
            </div>
            <p className="text-gray-500">
              Please hold still while scanning the QR code
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold text-fuel-blue-700">
              Ready to Scan
            </h3>
            <p className="text-gray-500">
              Scan the customer's QR code to process payment
            </p>
            <Button
              onClick={handleStartScan}
              className="bg-fuel-blue-500 hover:bg-fuel-blue-600"
            >
              <ScanBarcode className="h-5 w-5 mr-2" />
              Start Scanner
            </Button>
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
