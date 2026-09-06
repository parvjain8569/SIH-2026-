import { useState } from 'react'

const FAQS = [
  {
    id: 'faq1',
    question: '1. How to update Email Address via OTP Verification',
    answer:
      'To update your registered email: Go to Setting ➔ Change Email. Enter your new email address and click "Send Verification OTP". Check your inbox for the 6-digit OTP code, enter it in the prompt, and click "Verify & Update". Your profile will immediately reflect the new email.',
  },
  {
    id: 'faq2',
    question: '2. How to change your Mobile Number',
    answer:
      'Go to Setting ➔ Change Number. Enter your new 10-digit mobile number. You will receive an SMS containing a 6-digit OTP. Enter the code to bind the new phone number to your landholder profile.',
  },
  {
    id: 'faq3',
    question: '3. Why are Email and Phone locked in the Profile tab?',
    answer:
      'For land record security and fraud prevention, critical identifiers (Email & Phone Number) cannot be casually overwritten in the profile editor. They require cryptographic two-factor OTP verification in the Setting tab.',
  },
  {
    id: 'faq4',
    question: '4. What does "Needs Review" status mean?',
    answer:
      '"Needs Review" indicates that the uploaded document had partial legibility or a slight discrepancy with the Tehsil GIS map. Our automated system routes it to the local Revenue Officer for physical cross-verification.',
  },
]

const SUPPORT_CHANNELS = [
  {
    href: 'mailto:support@bhoomisetu.gov.in',
    iconBg: '#e0e7ff',
    iconColor: '#4338ca',
    icon: '✉️',
    label: 'Official Email',
    value: 'support@bhoomisetu.gov.in',
  },
  {
    href: 'https://wa.me/00000000000',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    icon: '💬',
    label: 'WhatsApp Helpdesk',
    value: '00000000000',
  },
  {
    href: 'https://x.com/BhoomiSetu_Gov',
    iconBg: '#f1f5f9',
    iconColor: '#0f172a',
    icon: '𝕏',
    label: 'X (Twitter) Support',
    value: '@BhoomiSetu_Gov',
  },
  {
    href: 'https://instagram.com/bhoomisetu_official',
    iconBg: '#fdf2f8',
    iconColor: '#db2777',
    icon: '📷',
    label: 'Instagram Portal',
    value: '@bhoomisetu_official',
  },
]

export default function HelpCenterTab() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#0f172a' }}>
        BhoomiSetu Help Center & Knowledge Base
      </h3>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>
        Everything you need to know about updating details, verification, and support.
      </p>

      {/* FAQ Accordions */}
      {FAQS.map((faq) => (
        <div key={faq.id} className="help-guide-card">
          <div
            className="help-guide-header"
            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
          >
            <span>{faq.question}</span>
            <span>{openFaq === faq.id ? '▲' : '▼'}</span>
          </div>
          {openFaq === faq.id && (
            <div className="help-guide-body">{faq.answer}</div>
          )}
        </div>
      ))}

      {/* Support Channels */}
      <h4 style={{ margin: '28px 0 12px 0', fontSize: '16px', color: '#0f172a' }}>
        Official Support Channels
      </h4>
      <div className="help-channels-grid">
        {SUPPORT_CHANNELS.map((ch) => (
          <a
            key={ch.label}
            href={ch.href}
            className="help-channel-box"
            target="_blank"
            rel="noreferrer"
          >
            <div
              className="help-channel-icon"
              style={{ backgroundColor: ch.iconBg, color: ch.iconColor }}
            >
              {ch.icon}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{ch.label}</div>
              <strong style={{ fontSize: '14px' }}>{ch.value}</strong>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
