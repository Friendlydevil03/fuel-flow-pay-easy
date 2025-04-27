
import { create } from 'zustand';
import { User, Vehicle, Transaction } from '@/types';

interface UserState {
  currentUser: User | null;
  vehicles: Vehicle[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Mock functions for auth (would connect to backend in real version)
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Mock functions for wallet
  getBalance: () => number;
  topUpBalance: (amount: number) => Promise<void>;
  
  // Mock functions for vehicles
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  
  // Mock functions for transactions
  getTransactions: () => Promise<void>;
  createTransaction: (transactionData: Partial<Transaction>) => Promise<Transaction>;
}

// Mock data
const mockUser: User = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  balance: 500.00,
};

const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-001',
    userId: 'user-001',
    type: 'Sedan',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    licensePlate: 'ABC123',
    fuelType: 'Regular',
  },
  {
    id: 'vehicle-002',
    userId: 'user-001',
    type: 'SUV',
    make: 'Honda',
    model: 'CR-V',
    year: '2019',
    licensePlate: 'XYZ789',
    fuelType: 'Premium',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    userId: 'user-001',
    amount: 45.75,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    stationId: 'station-001',
    stationName: 'City Fuel Station',
    fuelType: 'Regular',
    liters: 15.25,
    vehicleId: 'vehicle-001',
    status: 'completed',
    paymentType: 'wallet',
  },
  {
    id: 'tx-002',
    userId: 'user-001',
    amount: 100.00,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    stationId: '',
    stationName: '',
    fuelType: '',
    liters: 0,
    status: 'completed',
    paymentType: 'topup',
  },
];

// Create store
export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  vehicles: [],
  transactions: [],
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (mock)
      if (email === 'john@example.com' && password === 'password') {
        set({ 
          currentUser: mockUser,
          vehicles: mockVehicles,
          transactions: mockTransactions,
        });
      } else {
        set({ error: 'Invalid credentials' });
      }
    } catch (error) {
      set({ error: 'Failed to login' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    set({ currentUser: null, vehicles: [], transactions: [] });
  },
  
  getBalance: () => {
    return get().currentUser?.balance || 0;
  },
  
  topUpBalance: async (amount) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = get().currentUser;
      if (!user) throw new Error('User not logged in');
      
      const updatedUser = {
        ...user,
        balance: user.balance + amount,
      };
      
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        amount: amount,
        timestamp: new Date().toISOString(),
        stationId: '',
        stationName: '',
        fuelType: '',
        liters: 0,
        status: 'completed',
        paymentType: 'topup',
      };
      
      set({ 
        currentUser: updatedUser,
        transactions: [newTransaction, ...get().transactions],
      });
    } catch (error) {
      set({ error: 'Failed to top up balance' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addVehicle: (vehicleData) => {
    const user = get().currentUser;
    if (!user) return;
    
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      userId: user.id,
      ...vehicleData,
    };
    
    set({ vehicles: [...get().vehicles, newVehicle] });
  },
  
  updateVehicle: (id, updates) => {
    set({
      vehicles: get().vehicles.map(vehicle =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      ),
    });
  },
  
  removeVehicle: (id) => {
    set({
      vehicles: get().vehicles.filter(vehicle => vehicle.id !== id),
    });
  },
  
  getTransactions: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ transactions: mockTransactions });
    } catch (error) {
      set({ error: 'Failed to fetch transactions' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createTransaction: async (transactionData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = get().currentUser;
      if (!user) throw new Error('User not logged in');
      
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        amount: transactionData.amount || 0,
        timestamp: new Date().toISOString(),
        stationId: transactionData.stationId || '',
        stationName: transactionData.stationName || '',
        fuelType: transactionData.fuelType || '',
        liters: transactionData.liters || 0,
        vehicleId: transactionData.vehicleId,
        status: 'completed',
        paymentType: 'wallet',
      };
      
      const updatedUser = {
        ...user,
        balance: user.balance - (transactionData.amount || 0),
      };
      
      set({ 
        currentUser: updatedUser,
        transactions: [newTransaction, ...get().transactions],
      });
      
      return newTransaction;
    } catch (error) {
      set({ error: 'Failed to create transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
