
// Base service with common sensor functionality

export type SensorType = 'camera' | 'microphone' | 'accelerometer';

export interface SensorData {
  timestamp: number;
  values: number[];
  type: SensorType;
}

export interface MeasurementResult {
  spo2?: number;
  heartRate?: number;
  respiratoryRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  timestamp: number;
}

// TypeScript declaration for iOS-specific DeviceMotionEvent permission method
export interface DeviceMotionEventWithPermission {
  requestPermission?: () => Promise<string>;
}

export class SensorBase {
  // Check if the browser supports the required APIs
  checkBrowserSupport() {
    const supports = {
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      motionSensors: 'DeviceMotionEvent' in window && 'DeviceOrientationEvent' in window
    };
    
    return supports;
  }
  
  // Request necessary permissions
  async requestPermissions(type: 'camera' | 'microphone' | 'motion') {
    try {
      if (type === 'camera' || type === 'microphone') {
        const constraints = {
          video: type === 'camera',
          audio: type === 'microphone'
        };
        
        // This will trigger the permission prompt
        await navigator.mediaDevices.getUserMedia(constraints);
        return true;
      } 
      else if (type === 'motion') {
        // For motion sensors on iOS 13+
        // Check if requestPermission exists on DeviceMotionEvent (iOS 13+ specific)
        const deviceMotionEvt = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;
        if (typeof deviceMotionEvt.requestPermission === 'function') {
          const permissionState = await deviceMotionEvt.requestPermission();
          return permissionState === 'granted';
        }
        // For Android and other platforms that don't require explicit permission
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      return false;
    }
  }
  
  // Signal quality calculation utility
  calculateSignalQuality(values: number[]): number {
    // Calculate signal-to-noise ratio as a quality metric
    
    // Get trend line (simple moving average)
    const windowSize = 10;
    const trend: number[] = [];
    
    for (let i = 0; i < values.length; i++) {
      let sum = 0;
      let count = 0;
      
      for (let j = Math.max(0, i - windowSize/2); j < Math.min(values.length, i + windowSize/2); j++) {
        sum += values[j];
        count++;
      }
      
      trend.push(sum / count);
    }
    
    // Calculate noise as deviation from trend
    let noiseSum = 0;
    let signalSum = 0;
    
    for (let i = 0; i < values.length; i++) {
      const noise = Math.abs(values[i] - trend[i]);
      noiseSum += noise;
      signalSum += Math.abs(trend[i]);
    }
    
    const snr = signalSum / (noiseSum + 1); // Add 1 to avoid division by zero
    
    // Convert to 0-1 range
    return Math.min(1, snr / 20); // Normalize (assuming typical SNR values)
  }
  
  // Apply simple moving average smoothing
  smoothSignal(values: number[], windowSize: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < values.length; i++) {
      let sum = 0;
      let count = 0;
      
      for (let j = Math.max(0, i - windowSize); j <= Math.min(values.length - 1, i + windowSize); j++) {
        sum += values[j];
        count++;
      }
      
      result.push(sum / count);
    }
    
    return result;
  }
}
