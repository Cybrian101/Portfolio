import React, { useState, useEffect, useCallback } from 'react';

// --- CONFIGURATION CONSTANTS ---
const RAZORPAY_KEY_ID = 'rzp_test_XXXXXXXXXXXXXXXX'; // !!! REPLACE WITH YOUR LIVE KEY ID !!!
const COMMUNITY_FEE_INR = 83; // Approx $1 USD (83 INR)
const AMOUNT_PAISE = COMMUNITY_FEE_INR * 100;
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/YourCybriansGroupInvite';
const COMMUNITY_NAME = 'The Cybrians: Elite Network';
const LOADING_DURATION_MS = 3500; // 3.5 seconds total loading time
const VIDEO_SOURCE = 'uploaded:Reverse Doneundefined.mp4'; // Direct reference to the uploaded video file

/**
 * Dynamically loads the Razorpay checkout script.
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

// --- PRELOADER COMPONENT ---
const Preloader = ({ setLoadingComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fade-out effect near the end of the video playback
    const fadeOutTimer = setTimeout(() => {
      setFade(true);
    }, LOADING_DURATION_MS - 500); // Start fade 500ms before completion

    // Complete the loading process
    const completeTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, LOADING_DURATION_MS);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [setLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-950 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
      style={{ zIndex: 9999 }}
    >
      {/* Video component now uses the direct reference for the source */}
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop // Loop the video if the loading takes longer than the video duration
        style={{ maxWidth: '400px', maxHeight: '400px' }}
      >
        <source src={VIDEO_SOURCE} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// --- MAIN COMPONENT ---
const CommunitySection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, loading, success, failed
  const [error, setError] = useState(null);

  // 1. Load payment script and handle loading screen timeout
  useEffect(() => {
    loadRazorpayScript().then(setIsScriptLoaded);
  }, []);

  // 2. Handler for the actual payment initiation
  const handlePayment = useCallback(async () => {
    if (!isScriptLoaded) {
      setError('Payment script is still loading. Please wait a moment.');
      return;
    }
    if (typeof window.Razorpay === 'undefined') {
      setError('Razorpay SDK failed to load.');
      return;
    }

    setPaymentStatus('loading');
    setError(null);

    // --- MOCK ORDER ID GENERATION (REMEMBER TO USE A SECURE BACKEND API FOR PRODUCTION) ---
    const mockOrderId = `order_${Date.now()}`;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: AMOUNT_PAISE,
      currency: 'INR',
      name: COMMUNITY_NAME,
      description: 'One-time membership fee for ' + COMMUNITY_NAME,
      order_id: mockOrderId,
      handler: function (response) {
        // --- REAL-WORLD STEP: FINAL server-side verification MUST be done here.
        setPaymentStatus('success');
        console.log('Payment Successful. ID:', response.razorpay_payment_id);
      },
      prefill: { name: '', email: '', contact: '' },
      notes: { community: 'Cybrians', fee: COMMUNITY_FEE_INR },
      theme: { color: '#D147FF' },
      modal: { ondismiss: () => { setPaymentStatus('idle'); } },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setPaymentStatus('failed');
      setError('Payment failed: ' + response.error.description);
      console.error('Payment Error:', response.error);
    });

    rzp.open();
    setPaymentStatus('idle');
  }, [isScriptLoaded]);
  
  // Set global background style for the simulated "data stream" effect
  const mainStyle = {
    minHeight: '100vh',
    backgroundImage: `radial-gradient(ellipse at center, rgba(30, 0, 70, 0.4) 0%, rgba(10, 0, 20, 0.9) 100%), 
                     url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a1a2e"/><path d="M 0 50 L 50 0 L 100 50 L 50 100 Z" fill="none" stroke="%23300050" stroke-width="1"/></svg>')`,
    backgroundSize: 'cover, 50px 50px',
    backgroundAttachment: 'fixed',
    opacity: isLoading ? 0 : 1, // Fade in the content
    transition: 'opacity 1s ease-in-out',
  };

  if (isLoading) {
    return <Preloader setLoadingComplete={setIsLoading} />;
  }

  return (
    <div className="bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-4 relative" style={mainStyle}>
      <style jsx global>{`
        /* Custom font import if not already globally included */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        /* Define the neon glow effect */
        .neon-glow {
          text-shadow: 0 0 5px #D147FF, 0 0 15px #D147FF, 0 0 20px #8A2BE2;
        }
        .ring-cyan-pulse {
            box-shadow: 0 0 10px rgba(52, 211, 235, 0.7); /* Base glow */
            animation: pulse-ring 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes pulse-ring {
            0%, 100% { box-shadow: 0 0 10px rgba(52, 211, 235, 0.7); }
            50% { box-shadow: 0 0 20px rgba(52, 211, 235, 1), 0 0 30px rgba(52, 211, 235, 0.5); }
        }
        .animate-pulse-once {
          animation: fade-in-success 0.5s ease-out;
        }
        @keyframes fade-in-success {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="max-w-4xl w-full bg-[#1A1A2E]/95 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl ring-2 ring-cyan-400/50 ring-cyan-pulse transform transition-all duration-500 my-16">
        
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 neon-glow text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Join The Cybrians Elite Network
        </h2>
        <p className="text-gray-300 text-lg mb-8 border-b border-purple-600/50 pb-4">
          Access an ecosystem where potential becomes performance. Pay once, gain lifetime access to our private WhatsApp group for collaboration, mentorship, and exclusive opportunities in AI & Cybersecurity.
        </p>

        {/* Value Proposition Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <FeatureCard 
            title="Exclusive Access" 
            icon="M13.89 17.51a1.99 1.99 0 01-1.42.59H8.5a2 2 0 01-2-2V9a2 2 0 012-2h4.51c.53 0 1.04.2 1.42.59l4 4a2 2 0 010 2.82l-4 4z"
            description="Direct line to startup founders, CEOs, and innovative leaders for real-world mentorship."
          />
          <FeatureCard 
            title="Zero Fees, High Value" 
            icon="M12 2a10 10 0 100 20 10 10 0 000-20zM12 4a8 8 0 110 16 8 8 0 010-16zm4 8a4 4 0 11-8 0 4 4 0 018 0z"
            description="Unlock resources, job opportunities, and technical deep-dives specific to AI/Cybersecurity."
          />
        </div>

        {/* Pricing Card */}
        <div className="text-center mb-10 bg-[#252540] p-6 rounded-lg border border-purple-600/70 shadow-inner shadow-purple-900/50">
            <p className="text-4xl font-bold text-cyan-400 mb-2 neon-glow">
                ₹{COMMUNITY_FEE_INR} <span className="text-lg text-gray-400 font-normal">One-Time Fee</span>
            </p>
            <p className="text-sm text-gray-400">
                This is a single, lifetime membership fee.
            </p>
        </div>


        {/* Payment and Status Handling */}
        {paymentStatus === 'success' ? (
          <SuccessPanel />
        ) : (
          <>
            <button
              onClick={handlePayment}
              disabled={paymentStatus === 'loading' || !isScriptLoaded}
              className={`w-full py-4 text-xl font-bold rounded-lg transition duration-300 transform 
                ${paymentStatus === 'loading' || !isScriptLoaded 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 active:scale-[0.98] text-gray-900'
                }`}
            >
              {paymentStatus === 'loading' ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Initializing Secure Gateway...
                </div>
              ) : (
                `Pay ₹${COMMUNITY_FEE_INR} to Join The Network`
              )}
            </button>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-800 rounded-md text-sm text-red-200">
                Error: {error}
              </div>
            )}
            
            {/* Disclaimer */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              Payments processed securely by Razorpay. By clicking "Pay," you agree to our membership terms.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// --- Helper Components ---

// Card for listing community features
const FeatureCard = ({ title, description, icon }) => (
  <div className="flex items-start p-4 bg-[#1A1A2E] border-l-4 border-cyan-400/80 rounded-lg shadow-inner shadow-cyan-900/50">
    <div className="flex-shrink-0 mr-4">
      <svg className="w-6 h-6 text-purple-400 neon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
      </svg>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

// Panel shown on successful payment
const SuccessPanel = () => (
  <div className="text-center p-8 bg-green-900/40 rounded-xl border border-green-400 shadow-2xl shadow-green-500/30 animate-pulse-once">
    <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <h3 className="text-3xl font-bold text-green-400 mb-4">Access Granted! Welcome, Cybrian.</h3>
    <p className="text-lg text-white mb-6">
      Your membership is active. Here is your exclusive, private access link to the community WhatsApp group:
    </p>
    <a 
      href={WHATSAPP_GROUP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-8 py-3 text-lg font-bold bg-cyan-600 text-gray-900 rounded-full transition duration-300 hover:bg-cyan-500 shadow-xl shadow-cyan-500/50 hover:shadow-cyan-400/70"
    >
      Join the Private WhatsApp Group
    </a>
    <p className="mt-4 text-sm text-gray-400">
      The link is also being sent to the email used during checkout for permanent access.
    </p>
  </div>
);

export default CommunitySection;