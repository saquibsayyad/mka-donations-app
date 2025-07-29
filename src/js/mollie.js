const mollieApiKey = 'YOUR_MOLLIE_API_KEY'; // Replace with your actual Mollie API key

async function createPayment(amount, description) {
    const response = await fetch('https://api.mollie.com/v2/payments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${mollieApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: {
                currency: 'EUR',
                value: amount.toFixed(2) // Amount in euros
            },
            description: description,
            redirectUrl: 'https://your-redirect-url.com', // Replace with your redirect URL
            webhookUrl: 'https://your-webhook-url.com' // Replace with your webhook URL
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Payment creation failed: ${error.message}`);
    }

    const payment = await response.json();
    return payment;
}

function redirectToPayment(paymentUrl) {
    window.location.href = paymentUrl;
}

async function handlePayment(amount, description) {
    try {
        const payment = await createPayment(amount, description);
        redirectToPayment(payment._links.checkout.href);
    } catch (error) {
        console.error(error);
        alert('An error occurred while processing your payment. Please try again.');
    }
}