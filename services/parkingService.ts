/**
 * Servicio de Parking Lots
 * Maneja todas las peticiones relacionadas con estacionamientos
 */

import { API_ENDPOINTS, API_TIMEOUT } from "@/constants/api";
import axios from "axios";

// Tipos
export interface ParkingLot {
  _id: string;
  name: string;
  moto_available: number;
  car_available: number;
  created_at: string;
  updated_at: string;
}

export interface ParkingLotsResponse {
  success: boolean;
  message: string;
  count: number;
  data: ParkingLot[];
}

export interface UpdateParkingLotData {
  moto_available: number;
  car_available: number;
}

export interface UpdateParkingLotResponse {
  success: boolean;
  message: string;
  data?: ParkingLot;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Obtiene todos los parking lots disponibles
 */
export const getParkingLots = async (): Promise<ParkingLotsResponse> => {
  try {
    const response = await axios.get<ParkingLotsResponse>(
      API_ENDPOINTS.PARKING_LOTS,
      {
        timeout: API_TIMEOUT,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // El servidor respondió con un error
        throw {
          message:
            error.response.data?.message ||
            error.response.data?.error ||
            `Error del servidor: ${error.response.status}`,
          status: error.response.status,
        } as ApiError;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        throw {
          message: "No se pudo conectar con el servidor. Verifica tu conexión.",
        } as ApiError;
      }
    }

    // Error desconocido
    throw {
      message: "Ocurrió un error inesperado. Intenta de nuevo.",
    } as ApiError;
  }
};

/**
 * Actualiza la disponibilidad de un parking lot
 */
export const updateParkingLot = async (
  parkingId: string,
  data: UpdateParkingLotData
): Promise<UpdateParkingLotResponse> => {
  try {
    const response = await axios.put<UpdateParkingLotResponse>(
      `${API_ENDPOINTS.PARKING_LOTS}/${parkingId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: API_TIMEOUT,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // El servidor respondió con un error
        throw {
          message:
            error.response.data?.message ||
            error.response.data?.error ||
            `Error del servidor: ${error.response.status}`,
          status: error.response.status,
        } as ApiError;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        throw {
          message: "No se pudo conectar con el servidor. Verifica tu conexión.",
        } as ApiError;
      }
    }

    // Error desconocido
    throw {
      message: "Ocurrió un error inesperado. Intenta de nuevo.",
    } as ApiError;
  }
};
