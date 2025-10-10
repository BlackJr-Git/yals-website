import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types pour les requêtes et réponses
export interface PaymentRequest {
  code: string;
  reason: 'admission' | 'scolarity';
  academic_year_id: number;
  paytype: string;
  payer_email: string;
  payer_phone: string;
  payer_name?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    ref: string;
    status: string;
    amount: number;
    currency: string;
    created_at: string;
  };
}

export interface PaymentVerificationRequest {
  ref: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    ref: string;
    status: string;
    amount: number;
    currency: string;
    created_at: string;
    updated_at: string;
    payment_method: string;
  };
}

// Types pour les grades scolaires
export interface Grade {
  id: number;
  name: string;
  cycle: string;
}

export interface GradesResponse {
  jsonrpc: string;
  id: null;
  result: {
    grades: Grade[];
  };
}

// Types pour les années académiques
export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface AcademicYearsResponse {
  jsonrpc: string;
  id: null;
  result: {
    academic_years: AcademicYear[];
  };
}

// Types pour les frais d'admission
export interface AdmissionFeesResponse {
  jsonrpc: string;
  id: null;
  result: {
    amount: number;
    currency_id: string;
  };
}

// Service pour les paiements
export const PaymentService = {
  // Créer un nouveau paiement
  createPayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response = await api.post<PaymentResponse>('/admissions/payment', paymentData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as PaymentResponse;
      }
      throw error;
    }
  },

  // Vérifier le statut d'un paiement
  verifyPayment: async (ref: string): Promise<PaymentVerificationResponse> => {
    try {
      const response = await api.get<PaymentVerificationResponse>(`/admissions/payment/verify/${ref}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as PaymentVerificationResponse;
      }
      throw error;
    }
  },
};

// Service pour les données scolaires
export const SchoolService = {
  // Récupérer tous les grades
  getGrades: async (): Promise<GradesResponse> => {
    try {
      const response = await api.get<GradesResponse>('/school/grades');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as GradesResponse;
      }
      throw error;
    }
  },
  
  // Récupérer toutes les années académiques
  getAcademicYears: async (): Promise<AcademicYearsResponse> => {
    try {
      const response = await api.get<AcademicYearsResponse>('/school/academic-years');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AcademicYearsResponse;
      }
      throw error;
    }
  },
  
  // Récupérer le montant des frais d'admission
  getAdmissionFeesAmount: async (): Promise<AdmissionFeesResponse> => {
    try {
      const response = await api.post<AdmissionFeesResponse>('/school/admiss-fees-amount');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AdmissionFeesResponse;
      }
      throw error;
    }
  },
};

export default api;
