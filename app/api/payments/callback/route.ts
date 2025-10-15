import { NextRequest, NextResponse } from 'next/server';

/**
 * Gestionnaire de callback pour les paiements MaxiCash
 * Cette API est appelée par MaxiCash après le traitement d'un paiement
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du callback
    const data = await request.json();
    
    // Vérifier la signature pour s'assurer que la requête vient bien de MaxiCash
    // Dans une implémentation réelle, vous devriez vérifier la signature avec la clé secrète
    const isValidSignature = true; // À remplacer par une vérification réelle
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Extraire les informations importantes
    const {
      payment_reference,
      external_reference,
      status,
      amount,
      currency,
      transaction_id,
      payment_date
    } = data;
    
    // Mettre à jour le statut du paiement dans votre base de données
    // Dans une implémentation réelle, vous devriez appeler votre service de paiement
    
    // Enregistrer les informations du paiement pour référence future
    console.log('Payment callback received:', {
      payment_reference,
      external_reference,
      status,
      amount,
      currency,
      transaction_id,
      payment_date
    });
    
    // Répondre à MaxiCash pour confirmer la réception
    return NextResponse.json(
      { success: true, message: 'Callback processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing MaxiCash callback:', error);
    
    return NextResponse.json(
      { success: false, message: 'Error processing callback' },
      { status: 500 }
    );
  }
}
