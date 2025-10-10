import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Type pour la vérification de paiement
type VerifyRequest = {
  ref: string; // référence de la facture
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as VerifyRequest;
    
    // Validation des champs requis
    if (!data.ref) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing invoice reference' 
        },
        { status: 400 }
      );
    }
    
    // Log the received verification request for debugging
    console.log('Received payment verification request:', JSON.stringify(data, null, 2));
    
    // Dans une implémentation réelle, vous chercheriez la référence dans la base de données
    // ou appelleriez un service externe pour vérifier le statut du paiement
    
    // Exemple d'utilisation d'Axios pour vérifier un paiement auprès d'un service externe
    // try {
    //   const paymentGatewayResponse = await axios.get(
    //     `${process.env.PAYMENT_GATEWAY_URL}/transactions/${data.ref}`,
    //     {
    //       headers: {
    //         'Authorization': `Bearer ${process.env.PAYMENT_GATEWAY_API_KEY}`,
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //   );
    //   
    //   // Traiter la réponse du service de paiement
    //   const gatewayData = paymentGatewayResponse.data;
    //   const paymentExists = gatewayData.status === 'success';
    //   
    //   // Utiliser les données réelles du service de paiement
    //   if (paymentExists) {
    //     return NextResponse.json(
    //       { 
    //         success: true, 
    //         message: 'Payment found',
    //         data: {
    //           ref: data.ref,
    //           code: gatewayData.metadata.code,
    //           reason: gatewayData.metadata.reason,
    //           academic_year_id: gatewayData.metadata.academic_year_id,
    //           status: gatewayData.status === 'success' ? 'completed' : 'pending',
    //           paytype: gatewayData.payment_method,
    //           amount: gatewayData.amount,
    //           currency: gatewayData.currency,
    //           payer_email: gatewayData.customer.email,
    //           payer_phone: gatewayData.customer.phone,
    //           payer_name: gatewayData.customer.name,
    //           created_at: gatewayData.created_at,
    //           completed_at: gatewayData.completed_at
    //         }
    //       },
    //       { status: 200 }
    //     );
    //   }
    // } catch (verifyError) {
    //   console.error('Payment verification error:', verifyError);
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       message: 'Error verifying payment with gateway' 
    //     },
    //     { status: 502 }
    //   );
    // }
    
    // Pour la démonstration, nous simulons une réponse positive
    const paymentExists = true; // Simulation - en réalité, vérifier dans la base de données
    
    if (paymentExists) {
      // Simulons un paiement trouvé
      return NextResponse.json(
        { 
          success: true, 
          message: 'Payment found',
          data: {
            ref: data.ref,
            code: "ADMISSION-12345",
            reason: "admission",
            academic_year_id: 1,
            status: 'completed', // pending, completed, failed
            paytype: 'maxicash',
            amount: 500,
            currency: 'USD',
            payer_email: 'example@mail.com',
            payer_phone: '+123456789',
            payer_name: 'John Doe',
            created_at: '2025-09-24T12:00:00Z',
            completed_at: '2025-09-24T12:15:00Z'
          }
        },
        { status: 200 }
      );
    } else {
      // Si le paiement n'est pas trouvé
      return NextResponse.json(
        { 
          success: false, 
          message: 'Payment not found' 
        },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error verifying payment' 
      },
      { status: 500 }
    );
  }
}
