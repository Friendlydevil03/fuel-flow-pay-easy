
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import { CreditCard, Fuel, Car, ArrowRight, Plus } from "lucide-react";
import QRCode from "@/components/QRCode";

const Dashboard = () => {
  const { currentUser, vehicles } = useUserStore();
  const [showQR, setShowQR] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0]?.id || "");
  const navigate = useNavigate();

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleTopUp = () => {
    navigate("/wallet/top-up");
  };

  // Get QR code data
  const getQRData = () => {
    if (!currentUser) return "";
    
    const qrData = {
      userId: currentUser.id,
      walletId: currentUser.id,
      vehicleId: activeVehicle || undefined,
      fuelType: vehicles.find(v => v.id === activeVehicle)?.fuelType,
      maxAmount: 200, // Default max amount
    };
    
    return JSON.stringify(qrData);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="border-fuel-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-fuel-green-700">Your Balance</CardTitle>
          <CardDescription>Available for fuel payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${currentUser?.balance.toFixed(2)}</p>
            </div>
            <div className="space-x-2">
              <Button
                onClick={handleTopUp}
                className="bg-fuel-green-500 hover:bg-fuel-green-600"
              >
                <Plus className="h-5 w-5 mr-1" />
                Top Up
              </Button>
              <Button
                onClick={handleShowQR}
                variant="outline"
                className="border-fuel-green-500 text-fuel-green-500"
              >
                <CreditCard className="h-5 w-5 mr-1" />
                Pay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Scan to Pay</CardTitle>
              <CardDescription className="text-center">
                Show this QR code to the gas station attendant
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={getQRData()} size={200} />
              </div>
              
              {vehicles.length > 0 && (
                <div className="w-full">
                  <h3 className="font-medium text-sm mb-2">Select Vehicle:</h3>
                  <div className="grid gap-2">
                    {vehicles.map((vehicle) => (
                      <Button
                        key={vehicle.id}
                        variant={activeVehicle === vehicle.id ? "default" : "outline"}
                        className={`justify-start ${
                          activeVehicle === vehicle.id
                            ? "bg-fuel-green-500 hover:bg-fuel-green-600"
                            : "hover:border-fuel-green-500"
                        }`}
                        onClick={() => setActiveVehicle(vehicle.id)}
                      >
                        <Car className="h-5 w-5 mr-2" />
                        {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowQR(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vehicles Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-fuel-green-700">Your Vehicles</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/wallet/settings")}
            className="text-fuel-green-500 hover:text-fuel-green-600"
          >
            Manage
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        {vehicles.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Car className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 mb-4">No vehicles added yet</p>
              <Button
                onClick={() => navigate("/wallet/settings")}
                variant="outline"
              >
                Add Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-fuel-green-100 p-2 rounded-full mr-3">
                      <Car className="h-5 w-5 text-fuel-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.licensePlate}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 text-fuel-green-500 mr-1" />
                      <span className="text-sm">{vehicle.fuelType}</span>
                    </div>
                    <span className="text-sm text-gray-500">{vehicle.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Transactions Teaser */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-fuel-green-700">Recent Transactions</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/wallet/transactions")}
            className="text-fuel-green-500 hover:text-fuel-green-600"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {useUserStore.getState().transactions.slice(0, 3).map((transaction, index) => (
              <div
                key={transaction.id}
                className={`flex justify-between items-center p-4 ${
                  index < 2 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center">
                  {transaction.paymentType === 'wallet' ? (
                    <div className="bg-fuel-blue-100 p-2 rounded-full mr-3">
                      <Fuel className="h-5 w-5 text-fuel-blue-500" />
                    </div>
                  ) : (
                    <div className="bg-fuel-green-100 p-2 rounded-full mr-3">
                      <CreditCard className="h-5 w-5 text-fuel-green-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">
                      {transaction.paymentType === 'wallet'
                        ? `${transaction.stationName}`
                        : 'Top Up'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.paymentType === 'topup' ? 'text-fuel-green-500' : 'text-fuel-blue-500'
                  }`}>
                    {transaction.paymentType === 'topup' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  {transaction.paymentType === 'wallet' && (
                    <p className="text-sm text-gray-500">
                      {transaction.liters.toFixed(2)} L {transaction.fuelType}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
