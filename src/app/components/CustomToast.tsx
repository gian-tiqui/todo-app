import { Toast } from "primereact/toast";
import React, { RefObject } from "react";

interface Props {
  ref: RefObject<Toast | null>;
}

const CustomToast: React.FC<Props> = ({ ref }) => {
  return (
    <>
      <style jsx global>{`
        /* Custom toast container */
        .p-toast .p-toast-message {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          padding: 16px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          min-width: 250px !important;
          animation: fadeIn 0.3s ease-in-out !important;
        }

        /* Toast content layout */
        .p-toast .p-toast-message .p-toast-message-content {
          display: flex !important;
          align-items: flex-start !important;
          gap: 12px !important;
          padding: 0 !important;
        }

        /* Icon styling */
        .p-toast .p-toast-message .p-toast-message-icon {
          font-size: 20px !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
        }

        /* Success icon */
        .p-toast
          .p-toast-message.p-toast-message-success
          .p-toast-message-icon:before {
          content: "✔" !important;
          color: #4ade80 !important;
          font-family: inherit !important;
        }

        /* Warning icon */
        .p-toast
          .p-toast-message.p-toast-message-warn
          .p-toast-message-icon:before {
          content: "⚠" !important;
          color: #facc15 !important;
          font-family: inherit !important;
        }

        /* Error icon */
        .p-toast
          .p-toast-message.p-toast-message-error
          .p-toast-message-icon:before {
          content: "✖" !important;
          color: #f87171 !important;
          font-family: inherit !important;
        }

        /* Info icon */
        .p-toast
          .p-toast-message.p-toast-message-info
          .p-toast-message-icon:before {
          content: "ℹ" !important;
          color: #60a5fa !important;
          font-family: inherit !important;
        }

        /* Hide default PrimeReact icons */
        .p-toast .p-toast-message .p-toast-message-icon {
          background: none !important;
          width: auto !important;
          height: auto !important;
        }

        /* Text content */
        .p-toast .p-toast-message .p-toast-message-text {
          flex: 1 !important;
          margin: 0 !important;
        }

        /* Summary styling */
        .p-toast .p-toast-message .p-toast-summary {
          color: white !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          margin-bottom: 4px !important;
          line-height: 1.2 !important;
        }

        /* Detail styling */
        .p-toast .p-toast-message .p-toast-detail {
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
          margin: 0 !important;
        }

        /* Close button styling */
        .p-toast .p-toast-message .p-toast-icon-close {
          color: rgba(255, 255, 255, 0.6) !important;
          background: none !important;
          border: none !important;
          font-size: 16px !important;
          width: 20px !important;
          height: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          align-self: flex-start !important;
        }

        .p-toast .p-toast-message .p-toast-icon-close:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 4px !important;
        }

        /* Fade in animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Remove default PrimeReact styling that might interfere */
        .p-toast .p-toast-message .p-toast-message-content,
        .p-toast .p-toast-message .p-toast-message-text {
          background: none !important;
          border: none !important;
        }
      `}</style>
      <Toast ref={ref} position="top-right" />
    </>
  );
};

export default CustomToast;
