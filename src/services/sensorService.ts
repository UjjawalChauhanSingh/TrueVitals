
import { SensorBase, SensorData, MeasurementResult } from './base/sensorBase';
import { spo2HeartRateService } from './spo2HeartRateService';
import { respiratoryService } from './respiratoryService';
import { bloodPressureService } from './bloodPressureService';

/**
 * Main sensor service that coordinates between different measurement types
 * and provides a unified API for the application
 */
class SensorService extends SensorBase {
  // Collect camera data for SpO2 and heart rate
  async collectCameraData(durationMs: number = 30000): Promise<SensorData> {
    return await spo2HeartRateService.collectCameraData(durationMs);
  }

  // Collect microphone data for respiratory rate
  async collectMicrophoneData(durationMs: number = 30000): Promise<SensorData> {
    return await respiratoryService.collectMicrophoneData(durationMs);
  }

  // Collect accelerometer data for blood pressure
  async collectAccelerometerData(durationMs: number = 15000): Promise<SensorData> {
    return await bloodPressureService.collectAccelerometerData(durationMs);
  }

  // Signal processing for SpO2 and heart rate
  async inferSpO2AndHeartRate(data: SensorData): Promise<{ spo2: number, heartRate: number }> {
    return await spo2HeartRateService.inferSpO2AndHeartRate(data);
  }

  // Signal processing for respiratory rate
  async inferRespiratoryRate(data: SensorData): Promise<{ respiratoryRate: number }> {
    return await respiratoryService.inferRespiratoryRate(data);
  }

  // Signal processing for blood pressure
  async inferBloodPressure(data: SensorData): Promise<{ systolicBP: number, diastolicBP: number }> {
    return await bloodPressureService.inferBloodPressure(data);
  }
}

// Fix: Using 'export type' for type re-exports properly
export type { SensorData, MeasurementResult } from './base/sensorBase';
export type { SensorType } from './base/sensorBase';
export const sensorService = new SensorService();
