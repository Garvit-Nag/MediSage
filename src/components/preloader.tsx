'use client';
import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const messages = [
    "Analyzing symptoms...",
    "Scanning health parameters...",
    "Evaluating details...",
    "Processing inputs...",
    "Checking for patterns...",
    "Assessing information...",
    "Refining insights...",
    "Decoding health clues..."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <>
      <style jsx>{`
        .preloader-section {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          background: #e8e8e8;
          overflow: hidden;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 300px;
          padding: 20px;
        }
        
        .heart-rate {
          width: 150px;
          height: 73px;
          position: relative;
          margin: 0 auto;
        }
        
        .heart-rate .fade-in {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #e8e8e8;
          top: 0;
          right: 0;
          animation: heartRateIn 2.5s linear infinite;
        }
        
        .heart-rate .fade-out {
          position: absolute;
          width: 120%;
          height: 100%;
          background-color: #e8e8e8;
          top: 0;
          right: -120%;
          animation: heartRateOut 2.5s linear infinite;
        }

        .message-wrapper {
          width: 100%;
          height: 40px;
          margin-top: 2rem;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .message {
          position: absolute;
          text-align: center;
          width: 100%;
          color: #009B9E;
          font-size: 1.1rem;
          font-weight: 500;
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 2s ease infinite;
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        
        @keyframes heartRateIn {
          0% { width: 100%; }
          50% { width: 0; }
          100% { width: 0; }
        }
        
        @keyframes heartRateOut {
          0% { left: -120%; }
          30% { left: -120%; }
          100% { left: 0; }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .container {
            max-width: 250px;
          }
          
          .heart-rate {
            width: 120px;
            height: 58px;
          }

          .message {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            max-width: 200px;
          }
          
          .heart-rate {
            width: 100px;
            height: 48px;
          }

          .message {
            font-size: 0.9rem;
          }
        }
      `}</style>
      <section className="preloader-section">
        <div className="container">
          <div className="heart-rate">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="100%"
              height="100%"
              viewBox="0 0 150 73"
              preserveAspectRatio="xMidYMid meet"
              xmlSpace="preserve"
            >
              <polyline
                fill="none"
                stroke="#009B9E"
                strokeWidth="3"
                strokeMiterlimit="10"
                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,
                  63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
              />
            </svg>
            <div className="fade-in"></div>
            <div className="fade-out"></div>
          </div>
          <div className="message-wrapper">
            <div className="message">
              {messages[currentMessageIndex]}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Preloader;