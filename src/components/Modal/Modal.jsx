import React from "react";
import "./Modal.css";

// Simple modal component for dialogs/popups
// Usage: <Modal open={true} onClose={fn}>...</Modal>
export default function Modal({ open, onClose, children }) {
  // Don't render anything if the modal isn't open
  if (!open) return null;

  // Clicking the overlay closes the modal, but clicking inside the modal doesn't
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Close (X) button in the top right */}
        <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        {/* Render whatever is passed as children */}
        {children}
      </div>
    </div>
  );
}
