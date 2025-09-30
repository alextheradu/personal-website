import React, { useState, useEffect, useRef } from 'react';
import Stepper, { Step } from '../components/Stepper/Stepper';
// import GlassSurface from '../components/GlassSurface/GlassSurface';
import './Contact.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [sendError, setSendError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus management and accessibility
  useEffect(() => {
    if (isOpen) {
      // Focus first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm({ name: '', email: '', message: '' });
  setStatus('idle');
  setSendError(null);
      setSubmitted(false);
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(form).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    return isValid;
  };

  const submitForm = async () => {
    if (!validateForm()) {
      setStatus('error');
      setSendError('Please fix the highlighted fields.');
      return;
    }

  setStatus('sending');
  setSendError(null);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim()
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('sent');
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setSendError(data?.error || 'Server error: failed to send. Please retry in a moment.');
        // Handle backend validation errors
        if (data.details && Array.isArray(data.details)) {
          const backendErrors: FormErrors = {};
          data.details.forEach((error: string) => {
            if (error.toLowerCase().includes('name')) {
              backendErrors.name = error;
            } else if (error.toLowerCase().includes('email')) {
              backendErrors.email = error;
            } else if (error.toLowerCase().includes('message')) {
              backendErrors.message = error;
            }
          });
          setErrors(backendErrors);
          setTouched({ name: true, email: true, message: true });
        }
        console.error('Contact form error:', data);
      }
    } catch (error: any) {
      setStatus('error');
      setSendError(error?.message ? `Network error: ${error.message}` : 'Network error: Could not reach server.');
      console.error('Contact form submission failed:', error);
    }
  };

  const getFieldClassName = (fieldName: keyof FormErrors) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && form[fieldName].trim();
    return `form-input ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      {/* <GlassSurface
        width={900}
        height="auto"
        borderRadius={32}
        borderWidth={0.08}
        brightness={65}
        opacity={0.92}
        blur={24}
        saturation={1.3}
        distortionScale={-80}
        className="contact-modal-surface"
      > */}
        <div className="contact-modal-content" ref={modalRef} onClick={e => e.stopPropagation()}>
          <button className="contact-modal-close" onClick={onClose} aria-label="Close modal">×</button>
          {!submitted && <h1 id="contact-modal-title" className="contact-modal-heading">Contact Me</h1>}
          {submitted ? (
            <div className="contact-success-panel">
              <div className="success-icon">✅</div>
              <h2>Message Sent Successfully!</h2>
              <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
              <button className="contact-reset-btn" onClick={onClose}>Close</button>
            </div>
          ) : (
            <Stepper
              performanceMode
              initialStep={1}
              onFinalStepCompleted={submitForm}
              className="contact-stepper"
              contentClassName="contact-stepper-content"
              stepCircleContainerClassName="contact-stepper-container"
              nextButtonText={status === 'sending' ? 'Sending...' : 'Next'}
            >
              <Step>
                <div className="step-pane">
                  <h3>Basic Information</h3>
                  <p className="step-description">Let's start with your contact details</p>
                  <div className="field-row">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input 
                      id="contact-name"
                      ref={firstInputRef}
                      name="name" 
                      value={form.name} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClassName('name')}
                      placeholder="Your full name" 
                      aria-describedby={errors.name ? "name-error" : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {touched.name && errors.name && (
                      <span id="name-error" className="field-error" role="alert">{errors.name}</span>
                    )}
                  </div>
                  <div className="field-row">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input 
                      id="contact-email"
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClassName('email')}
                      placeholder="you@example.com"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {touched.email && errors.email && (
                      <span id="email-error" className="field-error" role="alert">{errors.email}</span>
                    )}
                  </div>
                </div>
              </Step>
              <Step>
                <div className="step-pane">
                  <h3>Your Message</h3>
                  <p className="step-description">Tell me about your project or inquiry</p>
                  <div className="field-row">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea 
                      id="contact-message"
                      name="message" 
                      value={form.message} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClassName('message')}
                      placeholder="How can I help you? Please provide details about your project, timeline, and any specific requirements..."
                      rows={8}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      aria-invalid={!!errors.message}
                    />
                    {touched.message && errors.message && (
                      <span id="message-error" className="field-error" role="alert">{errors.message}</span>
                    )}
                    <div className="character-count">
                      {form.message.length}/1000 characters
                    </div>
                  </div>
                </div>
              </Step>
              <Step>
                <div className="step-pane">
                  <h3>Review & Send</h3>
                  <p className="step-description">Please review your information before sending</p>
                  <div className="review-container">
                    <div className="review-item">
                      <strong>Name:</strong> 
                      <span className="review-value">{form.name || <em>Not provided</em>}</span>
                    </div>
                    <div className="review-item">
                      <strong>Email:</strong> 
                      <span className="review-value">{form.email || <em>Not provided</em>}</span>
                    </div>
                    <div className="review-item">
                      <strong>Message:</strong> 
                      <div className="review-message">{form.message || <em>Not provided</em>}</div>
                    </div>
                  </div>
      {status === 'error' && (
                    <div className="form-error" role="alert">
                      <span className="error-icon">⚠️</span>
                      {sendError || 'Failed to send message. Please check your information and try again.'}
                      {sendError && (
                        <button type="button" className="retry-btn" onClick={submitForm}>
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                  <div className="review-footer">
                    <p className="review-hint">
                      <span className="hint-icon">💡</span>
                      Click "Complete" to send your message. I typically respond within 24 hours.
                    </p>
                  </div>
                </div>
              </Step>
            </Stepper>
          )}
        </div>
      {/* </GlassSurface> */}
    </div>
  );
};

export default Contact;
