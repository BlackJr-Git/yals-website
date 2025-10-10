# API Integration Guide

Ce document explique comment utiliser Axios pour les appels API dans le projet YALS.

## Configuration

Axios est déjà installé dans le projet. La configuration de base se trouve dans le fichier `services/api.ts`.

## Utilisation côté client

### Importer le service API

```typescript
import { PaymentService, PaymentRequest } from "@/services/api";
```

### Effectuer un appel API

```typescript
// Exemple d'appel pour créer un paiement
const paymentData: PaymentRequest = {
  code: "ADMISSION-12345",
  reason: "admission",
  academic_year_id: 1,
  paytype: "maxicash",
  payer_email: "example@mail.com",
  payer_phone: "+123456789",
  payer_name: "John Doe"
};

try {
  const result = await PaymentService.createPayment(paymentData);
  
  if (result.success && result.data) {
    // Traiter la réponse
    console.log("Payment reference:", result.data.ref);
  } else {
    // Gérer l'erreur
    console.error("Payment error:", result.message);
  }
} catch (error) {
  console.error("API call failed:", error);
}
```

### Vérifier un paiement

```typescript
try {
  const result = await PaymentService.verifyPayment("INV-123456-2025");
  
  if (result.success && result.data) {
    // Traiter la réponse
    console.log("Payment status:", result.data.status);
  } else {
    // Gérer l'erreur
    console.error("Verification error:", result.message);
  }
} catch (error) {
  console.error("API call failed:", error);
}
```

## Utilisation côté serveur (API Routes)

Dans les routes API, vous pouvez utiliser Axios pour appeler des services externes:

```typescript
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Appel à un service externe
    const externalResponse = await axios.post(
      process.env.EXTERNAL_API_URL,
      data,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return NextResponse.json(externalResponse.data);
  } catch (error) {
    console.error('API error:', error);
    
    // Gestion des erreurs Axios
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.response?.data?.message || 'External API error' 
        },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Unknown error' },
      { status: 500 }
    );
  }
}
```

## Gestion des erreurs

Axios fournit des informations détaillées sur les erreurs via `error.response`:

```typescript
try {
  // Appel API
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Erreur Axios
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
  } else {
    // Autre type d'erreur
    console.error('Error:', error);
  }
}
```

## Variables d'environnement

Les URLs d'API et autres configurations sont stockées dans les variables d'environnement:

- `NEXT_PUBLIC_API_URL`: URL de base pour les appels API côté client
- `PAYMENT_GATEWAY_URL`: URL du service de paiement externe
- `PAYMENT_GATEWAY_API_KEY`: Clé API pour le service de paiement

Voir le fichier `.env.local.example` pour plus de détails.
