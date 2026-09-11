import React, { useState, useRef, useEffect } from 'react';

export default function UploadWizardModal({ onClose, onComplete }) {
  const [step, setStep] = useState(1); // 1: Captcha, 2: Upload, 3: OTP
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const fileInputRef = useRef(null);

  // Generate a random 5-character alphanumeric captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // removed ambiguous chars like I, 1, O, 0
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setCaptchaInput('');
    setCaptchaError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCaptchaSubmit = (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() === captchaText) {
      setStep(2);
    } else {
      setCaptchaError('Incorrect CAPTCHA. Please try again.');
      generateCaptcha();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = () => {
    if (selectedFile) {
      setStep(3);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpInput === '1234') {
      onComplete(selectedFile);
    } else {
      setOtpError('Invalid OTP. Please enter 1234 for demo.');
    }
  };

  return (
    <div className="bhoomi-modal-overlay" onClick={onClose}>
      <div
        className="bhoomi-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', textAlign: 'center' }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
          Document Upload Verification
        </h3>

        {/* STEP 1: CAPTCHA */}
        {step === 1 && (
          <form onSubmit={handleCaptchaSubmit}>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
              Please complete the security check to proceed with your upload.
            </p>
            <div style={{
              background: '#f1f5f9',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '24px',
              letterSpacing: '4px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: '#1e293b',
              marginBottom: '16px',
              display: 'inline-block',
              userSelect: 'none'
            }}>
              {captchaText}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Enter text shown above"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
                required
              />
              {captchaError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{captchaError}</p>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-how-it-works-downward" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-upload-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Verify & Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: FILE UPLOAD */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
              Select the land document you wish to digitize and verify.
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={{ display: 'none' }}
            />

            {!selectedFile ? (
              <div 
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '32px 16px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  backgroundColor: '#f8fafc'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ margin: '0 auto 12px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>Click to browse files</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>PDF, JPG, PNG (Max 5MB)</p>
              </div>
            ) : (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#065f46', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {selectedFile.name}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-how-it-works-downward" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-upload-primary" 
                style={{ flex: 1, justifyContent: 'center', opacity: selectedFile ? 1 : 0.5 }} 
                onClick={handleFileSubmit}
                disabled={!selectedFile}
              >
                Submit Document
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP */}
        {step === 3 && (
          <form onSubmit={handleOtpSubmit}>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
              To verify this upload, please enter the OTP sent to your registered mobile number.
            </p>
            <p style={{ fontSize: '12px', color: '#059669', marginBottom: '16px', fontWeight: 600 }}>
              (Demo OTP: 1234)
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                maxLength="4"
                placeholder="Enter 4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '200px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '18px',
                  textAlign: 'center',
                  letterSpacing: '4px'
                }}
                required
              />
              {otpError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{otpError}</p>}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-how-it-works-downward" style={{ flex: 1 }} onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" className="btn-upload-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Verify & Upload
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
