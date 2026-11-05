import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function AlertNotification({ alert, onClose }) {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <span>{alert.message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Cerrar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
