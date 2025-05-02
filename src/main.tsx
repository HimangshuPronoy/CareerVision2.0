import { createRoot } from 'react-dom/client'
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './integrations/stripe/client';
import App from './App.tsx'
import './index.css'

// Get the root element
const container = document.getElementById("root");

// Ensure the root element exists
if (!container) throw new Error("Root element not found!");

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>
);
