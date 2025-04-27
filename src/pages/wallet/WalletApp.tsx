
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, BarChart3, Settings, LogOut } from "lucide-react";
import { useUserStore } from "@/store/userStore";

const WalletApp = () => {
  const { currentUser, login, logout, isLoading, error } = useUserStore();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/wallet");
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-fuel-green-50 to-fuel-green-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-fuel-green-700">
              Fuel Wallet Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-fuel-green-500 hover:bg-fuel-green-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get current active tab based on the route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/wallet") return "dashboard";
    if (path === "/wallet/transactions") return "transactions";
    if (["/wallet/settings", "/wallet/profile"].includes(path)) return "settings";
    return "dashboard";
  };

  return (
    <div className="min-h-screen bg-fuel-green-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-fuel-green-500 mr-2" />
            <h1 className="text-2xl font-bold text-fuel-green-700">Fuel Wallet</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue={getActiveTab()} className="space-y-4" value={getActiveTab()}>
          <TabsList className="w-full flex">
            <TabsTrigger 
              value="dashboard" 
              className="flex-1"
              onClick={() => navigate("/wallet")}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="flex-1"
              onClick={() => navigate("/wallet/transactions")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1"
              onClick={() => navigate("/wallet/settings")}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value={getActiveTab()}>
            <Outlet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletApp;
