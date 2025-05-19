
import { create } from 'zustand';
import { sensorService } from '@/services/sensorService';

export interface MeasurementResult {
  timestamp: number;
  spo2?: number;
  heartRate?: number;
  respiratoryRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
}

interface VitalSignsState {
  history: MeasurementResult[];
  currentResult: MeasurementResult | null;
  isCollectingData: boolean;
  progress: number;
  startMeasurement: (type: "spo2-hr" | "respiratory" | "blood-pressure") => Promise<void>;
  resetCurrent: () => void;
  clearHistory: () => void;
}

export const useVitalSignsStore = create<VitalSignsState>((set, get) => ({
  history: [],
  currentResult: null,
  isCollectingData: false,
  progress: 0,
  
  startMeasurement: async (type) => {
    set({ isCollectingData: true, progress: 0 });
    
    // Set up progress simulation
    const progressInterval = setInterval(() => {
      set(state => ({
        progress: Math.min(state.progress + 10, 90) // Max 90% until complete
      }));
    }, 300);
    
    try {
      // Collect data based on measurement type
      let result: MeasurementResult = { timestamp: Date.now() };
      
      if (type === 'spo2-hr') {
        const data = await sensorService.collectCameraData();
        const inference = await sensorService.inferSpO2AndHeartRate(data);
        result = { ...result, ...inference };
      } else if (type === 'respiratory') {
        const data = await sensorService.collectMicrophoneData();
        const inference = await sensorService.inferRespiratoryRate(data);
        result = { ...result, ...inference };
      } else if (type === 'blood-pressure') {
        const data = await sensorService.collectAccelerometerData();
        const inference = await sensorService.inferBloodPressure(data);
        result = { ...result, ...inference };
      }
      
      clearInterval(progressInterval);
      
      set(state => ({
        isCollectingData: false,
        progress: 100,
        currentResult: result,
        history: [result, ...state.history]
      }));
    } catch (error) {
      clearInterval(progressInterval);
      set({ isCollectingData: false, progress: 0 });
      throw error;
    }
  },
  
  resetCurrent: () => set({ currentResult: null, progress: 0 }),
  
  clearHistory: () => set({ history: [] }),
}));
