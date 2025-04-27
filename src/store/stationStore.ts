
import { create } from 'zustand';
import { FuelStation, QRData, Transaction } from '@/types';

interface StationState {
  currentStation: FuelStation | null;
  scannedQrData: QRData | null;
  currentTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  
  // Mock functions for station
  loginStation: (id: string, password: string) => Promise<void>;
  logoutStation: () => void;
  
  // Mock functions for QR scanning
  setScannedQrData: (data: QRData | null) => void;
  
  // Mock functions for transactions
  processTransaction: (amount: number, fuelType: string, liters: number) => Promise<Transaction>;
}

// Mock data
const mockStation: FuelStation = {
  id: 'station-001',
  name: 'City Fuel Station',
  location: '123 Main St, Anytown',
  fuelTypes: ['Regular', 'Premium', 'Diesel'],
};

export const useStationStore = create<StationState>((set, get) => ({
  currentStation: null,
  scannedQrData: null,
  currentTransaction: null,
  isLoading: false,
  error: null,
  
  loginStation: async (id, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (mock)
      if (id === 'station1' && password === 'password') {
        set({ currentStation: mockStation });
      } else {
        set({ error: 'Invalid station credentials' });
      }
    } catch (error) {
      set({ error: 'Failed to login station' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logoutStation: () => {
    set({ 
      currentStation: null,
      scannedQrData: null,
      currentTransaction: null 
    });
  },
  
  setScannedQrData: (data) => {
    set({ scannedQrData: data });
  },
  
  processTransaction: async (amount, fuelType, liters) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const qrData = get().scannedQrData;
      if (!qrData) throw new Error('No QR data found');
      
      const station = get().currentStation;
      if (!station) throw new Error('Station not logged in');
      
      // Check if amount exceeds max allowed amount in QR
      if (qrData.maxAmount && amount > qrData.maxAmount) {
        throw new Error(`Amount exceeds maximum allowed (${qrData.maxAmount})`);
      }
      
      // Check if fuel type matches QR data preference
      if (qrData.fuelType && qrData.fuelType !== fuelType) {
        throw new Error(`Fuel type mismatch. Customer prefers ${qrData.fuelType}`);
      }
      
      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        userId: qrData.userId,
        amount: amount,
        timestamp: new Date().toISOString(),
        stationId: station.id,
        stationName: station.name,
        fuelType: fuelType,
        liters: liters,
        vehicleId: qrData.vehicleId,
        status: 'completed',
        paymentType: 'wallet',
      };
      
      set({ currentTransaction: transaction });
      return transaction;
    } catch (error: any) {
      set({ error: error.message || 'Failed to process transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
