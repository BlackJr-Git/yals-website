import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.yals.edu',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuration pour l'API MaxiCash
const maxicashApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAXICASH_API_URL || 'https://api.maxicashapp.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Ajouter l'intercepteur pour les clés API MaxiCash
maxicashApi.interceptors.request.use((config) => {
  config.headers['X-API-KEY'] = process.env.NEXT_PUBLIC_MAXICASH_API_KEY || '';
  return config;
});

// Interfaces pour les grades
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

// Interfaces pour les années académiques
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

// Interface pour les frais d'admission
export interface AdmissionFeesResponse {
  jsonrpc: string;
  id: null;
  result: {
    amount: number;
    currency_id: string;
  };
}

// Types pour les requêtes et réponses
export interface PaymentRequest {
  code: string; // Code de référence de l'application
  reason: string; // Raison du paiement (admission, scolarity, etc.)
  academic_year_id: number; // ID de l'année académique
  paytype: string; // Type de paiement (cash, bank_transfer, etc.)
  payer_email: string; // Email du payeur
  payer_phone: string; // Téléphone du payeur
  payer_name?: string; // Nom du payeur (facultatif)
}

// Interfaces pour MaxiCash
export interface MaxiCashPaymentRequest {
  amount: number; // Montant du paiement
  currency: string; // Devise (XAF, USD, EUR, etc.)
  phone: string; // Numéro de téléphone du payeur
  email?: string; // Email du payeur (facultatif)
  first_name?: string; // Prénom du payeur (facultatif)
  last_name?: string; // Nom de famille du payeur (facultatif)
  description: string; // Description du paiement
  external_reference: string; // Référence externe (notre code de référence)
  callback_url: string; // URL de callback pour les notifications
  return_url: string; // URL de retour après paiement
  cancel_url?: string; // URL en cas d'annulation (facultatif)
}

export interface MaxiCashPaymentResponse {
  status: string; // Status de la requête (success, error)
  message: string; // Message de l'API
  data?: {
    payment_url: string; // URL de redirection pour le paiement
    payment_reference: string; // Référence de paiement MaxiCash
    status: string; // Status du paiement (pending, completed, failed)
    amount: number; // Montant du paiement
    currency: string; // Devise
  };
  error?: string; // Message d'erreur si status est error
}

// Interface pour la vérification des paiements
export interface PaymentVerificationResponse {
  success: boolean;
  data?: {
    ref: string;
    code: string;
    reason: string;
    academic_year_id: number;
    status: 'pending' | 'completed' | 'failed';
    paytype: string;
    amount: number;
    currency: string;
    payer_email: string;
    payer_phone: string;
    payer_name: string;
    created_at: string;
    completed_at?: string;
  };
  message?: string;
}

// Service pour les paiements
export const PaymentService = {
  // Créer un nouveau paiement
  createPayment: async (data: PaymentRequest): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      // Appel à notre API backend qui va ensuite appeler MaxiCash
      const response = await api.post('/payments', data);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Une erreur s'est produite lors du traitement du paiement.",
        };
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      return {
        success: false,
        message: "Échec du traitement du paiement. Veuillez réessayer.",
      };
    }
  },
  
  // Vérifier le statut d'un paiement
  verifyPayment: async (invoiceRef: string): Promise<PaymentVerificationResponse> => {
    try {
      const response = await api.get(`/payments/verify/${invoiceRef}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return {
        success: false,
        message: "Impossible de vérifier le paiement. Veuillez réessayer.",
      };
    }
  },
  
  // Initier un paiement MaxiCash
  initiateMaxiCashPayment: async (data: MaxiCashPaymentRequest): Promise<MaxiCashPaymentResponse> => {
    try {
      const response = await maxicashApi.post('/payments/initiate', data);
      return response.data;
    } catch (error) {
      console.error("Error initiating MaxiCash payment:", error);
      return {
        status: "error",
        message: "Échec de l'initialisation du paiement MaxiCash.",
        error: error instanceof Error ? error.message : "Une erreur inconnue s'est produite"
      };
    }
  },
  
  // Vérifier le statut d'un paiement MaxiCash
  checkMaxiCashPaymentStatus: async (paymentReference: string): Promise<any> => {
    try {
      const response = await maxicashApi.get(`/payments/${paymentReference}/status`);
      return response.data;
    } catch (error) {
      console.error("Error checking MaxiCash payment status:", error);
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
