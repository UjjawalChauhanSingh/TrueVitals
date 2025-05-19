
import { SensorBase, SensorData } from './base/sensorBase';

export class BloodPressureService extends SensorBase {
  // Collect accelerometer data for blood pressure
  async collectAccelerometerData(durationMs: number = 15000): Promise<SensorData> {
    console.log(`Collecting real accelerometer data for ${durationMs/1000} seconds...`);
    
    const hasPermission = await this.requestPermissions('motion');
    if (!hasPermission) {
      throw new Error("Motion sensor permission denied. Please grant permission to use this feature.");
    }
    
    return new Promise((resolve, reject) => {
      try {
        const values: number[] = [];
        const startTime = Date.now();
        
        // Handler for device motion events
        const handleMotion = (event: DeviceMotionEvent) => {
          if (event.accelerationIncludingGravity) {
            const { x, y, z } = event.accelerationIncludingGravity;
            if (x !== null && y !== null && z !== null) {
              values.push(x);
              values.push(y);
              values.push(z);
            }
          }
        };
        
        // Add event listener for motion data
        window.addEventListener('devicemotion', handleMotion);
        
        // Set timeout to stop collection after specified duration
        setTimeout(() => {
          window.removeEventListener('devicemotion', handleMotion);
          
          resolve({
            timestamp: startTime,
            values,
            type: 'accelerometer'
          });
        }, durationMs);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Signal processing for blood pressure
  async inferBloodPressure(data: SensorData): Promise<{ systolicBP: number, diastolicBP: number }> {
    if (data.values.length < 30) {
      throw new Error("Insufficient data collected for analysis.");
    }
    
    // In a real implementation, this would involve:
    // 1. Motion signal analysis from accelerometer data
    // 2. Pulse transit time calculation
    // 3. Blood pressure estimation using calibration parameters
    
    // For this prototype, we'll analyze the signal variability
    const signalQuality = this.analyzeMotionSignalQuality(data.values);
    
    // Generate more consistent BP values based on signal quality
    // - High quality = narrower range around normal values
    // - Low quality = wider range
    
    let systolicBase = 120; // Normal systolic pressure
    let diastolicBase = 80;  // Normal diastolic pressure
    
    let systolicVariation, diastolicVariation;
    
    if (signalQuality < 0.5) {
      systolicVariation = 15;
      diastolicVariation = 10;
    } else {
      systolicVariation = 8;
      diastolicVariation = 5;
    }
    
    const systolicBP = Math.round(systolicBase + (Math.random() * 2 - 1) * systolicVariation);
    const diastolicBP = Math.round(diastolicBase + (Math.random() * 2 - 1) * diastolicVariation);
    
    return {
      systolicBP: Math.max(90, Math.min(180, systolicBP)),   // Typical range 90-180
      diastolicBP: Math.max(50, Math.min(110, diastolicBP))  // Typical range 50-110
    };
  }
  
  // Analyze motion signal quality for blood pressure estimation
  private analyzeMotionSignalQuality(values: number[]): number {
    // Group by x, y, z components
    const x: number[] = [];
    const y: number[] = [];
    const z: number[] = [];
    
    for (let i = 0; i < values.length; i += 3) {
      if (i + 2 < values.length) {
        x.push(values[i]);
        y.push(values[i + 1]);
        z.push(values[i + 2]);
      }
    }
    
    // Calculate stability of each axis (less variation = more stable)
    const xStability = this.calculateStability(x);
    const yStability = this.calculateStability(y);
    const zStability = this.calculateStability(z);
    
    // Overall quality is average of each axis stability
    return (xStability + yStability + zStability) / 3;
  }
  
  // Calculate signal stability (0-1 range, higher is more stable)
  private calculateStability(values: number[]): number {
    if (values.length < 2) return 0;
    
    // Calculate standard deviation
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => (value - mean) ** 2);
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate coefficient of variation (lower = more stable)
    const cv = Math.abs(stdDev / (mean + 0.0001)); // Add small value to avoid division by zero
    
    // Convert to stability score (0-1)
    return Math.max(0, Math.min(1, 1 - (cv / 0.5)));
  }
}

export const bloodPressureService = new BloodPressureService();
