# MKA Donations App

## Overview
The MKA Donations App is a web application designed to facilitate online donations for Majlis Khuddam ul Ahmadiyya Nederland. The application features a user-friendly three-step form that allows users to provide their details, specify their donation breakdown, and review their submission before making a payment.

## Features
- Responsive design suitable for both mobile and desktop devices.
- Three-step donation process:
  1. User Details: Collects name, email, Majlis selection, AIMS ID, and Atfal or Khuddam selection.
  2. Chanda Breakdown: Allows users to specify their donation amounts for various categories.
  3. Summary: Displays a summary of the entered information and total amount, with a Pay button to initiate payment.
- Integration with the Mollie API for secure iDEAL payments.

## Project Structure
```
mka-donations-app
├── src
│   ├── index.html
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── main.js
│   │   ├── form.js
│   │   └── mollie.js
│   ├── components
│   │   ├── step1-user-details.html
│   │   ├── step2-chanda-breakdown.html
│   │   └── step3-summary.html
│   └── assets
│       └── fonts
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open `src/index.html` in your web browser to view the application.

## Usage Guidelines
- Fill in the user details in Step 1 and click "Next" to proceed.
- Specify the chanda breakdown in Step 2 and click "Next" to review your submission.
- Review the summary in Step 3 and click "Pay" to initiate the payment process.

## Technologies Used
- HTML, CSS, JavaScript
- Mollie API for payment processing

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.