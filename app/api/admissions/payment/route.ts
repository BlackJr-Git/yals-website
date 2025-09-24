import { NextRequest, NextResponse } from 'next/server';

// Type pour le format du premier formulaire
type PaymentRequest = {
  code: string; // code de référence d'admission
  reason: 'admission' | 'scolarity'; // raison du paiement
  academic_year_id: number; // ID de l'année académique
  paytype: string; // type de paiement (maxicash, etc.)
  payer_email: string; // email du payeur
  payer_phone: string; // téléphone du payeur
  payer_name: string; // nom du payeur
};

// Type pour la vérification de paiement
type VerifyRequest = {
  ref: string; // référence de la facture
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as PaymentRequest;
    
    // Validation des champs requis
    if (!data.code || !data.reason || !data.academic_year_id || !data.paytype || !data.payer_email || !data.payer_phone) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }
    
    // Log the received payment data for debugging
    console.log('Received payment data:', JSON.stringify(data, null, 2));
    
    // Génération d'une référence unique
    const invoiceRef = `INV-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    
    // Here you would typically:
    // 1. Validate the payment information
    // 2. Process the payment through a payment gateway
    // 3. Update the database records
    // 4. Generate a receipt
    
    // For now, we'll just return a success response with the format expected
    return NextResponse.json(
      { 
        success: true, 
        message: 'Payment request processed successfully',
        data: {
          ref: invoiceRef,
          code: data.code,
          reason: data.reason,
          academic_year_id: data.academic_year_id,
          status: 'pending', // pending, completed, failed
          paytype: data.paytype,
          amount: 500, // montant fictif pour test
          currency: 'USD',
          payer_email: data.payer_email,
          payer_phone: data.payer_phone,
          payer_name: data.payer_name || 'N/A',
          created_at: new Date().toISOString(),
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing payment request' 
      },
      { status: 500 }
    );
  }
}
