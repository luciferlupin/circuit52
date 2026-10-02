import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Bell,
  EyeOff,
  Radio,
  Lock,
  Sparkles,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [incognitoStream, setIncognitoStream] = useState<boolean>(false);
  const [maskWaitlist, setMaskWaitlist] = useState<boolean>(true);
  const [autoCheckIn, setAutoCheckIn] = useState<boolean>(true);
  const [proximityAlerts, setProximityAlerts] = useState<boolean>(true);
  const [seatAlerts, setSeatAlerts] = useState<boolean>(true);
  const [highStakesAlerts, setHighStakesAlerts] = useState<boolean>(true);
  const [biometricAuth, setBiometricAuth] = useState<boolean>(true);
  const [soundHaptics, setSoundHaptics] = useState<boolean>(true);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="pulse-modal-overlay" onClick={onClose}>
      <div className="pulse-settings-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Top Header */}
        <div className="pulse-settings-header">
          <div>
            <span className="pulse-booking-step-badge">PREFERENCES & PRIVACY</span>
            <h3 className="pulse-settings-title">Club & Table Settings</h3>
          </div>
          <button type="button" className="pulse-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Settings Form */}
        <div className="pulse-settings-scroll-body">
          {/* Identity & VIP Status Banner */}
          <div className="pulse-settings-identity-card">
            <div className="pulse-settings-avatar">
              <span>AM</span>
              <div className="pulse-settings-badge">
                <ShieldCheck size={12} />
              </div>
            </div>
            <div className="pulse-settings-id-meta">
              <div className="pulse-settings-player-name">Alex "Ace" Morgan</div>
              <div className="pulse-settings-player-sub">Circuit ID: #C52-VIP-9948 • Verified KYC</div>
              <div className="pulse-profile-tier-pill mini">
                <Sparkles size={11} />
                <span>VIP BLACK CARD • LEVEL 24</span>
              </div>
            </div>
          </div>

          {/* Section 1: Privacy & Live Stream Anonymity */}
          <div className="pulse-settings-group">
            <div className="pulse-settings-group-header">
              <EyeOff size={16} className="pulse-set-icon" />
              <span>PRIVACY & STREAM ANONYMITY</span>
            </div>

            <div className="pulse-settings-toggles">
              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Incognito on RFID Stream Tables</div>
                  <div className="pulse-sr-desc">Display chosen avatar / handle instead of real legal name on broadcast graphics</div>
                </div>
                <input
                  type="checkbox"
                  checked={incognitoStream}
                  onChange={e => setIncognitoStream(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>

              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Mask Nickname on Public Waitlists</div>
                  <div className="pulse-sr-desc">Shows as "Player #..." on public club podium queue screens</div>
                </div>
                <input
                  type="checkbox"
                  checked={maskWaitlist}
                  onChange={e => setMaskWaitlist(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Geofence & Proximity Detection */}
          <div className="pulse-settings-group">
            <div className="pulse-settings-group-header">
              <Radio size={16} className="pulse-set-icon" />
              <span>GEOFENCE & ARRIVAL RADAR</span>
            </div>

            <div className="pulse-settings-toggles">
              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Auto Check-in via Bluetooth Beacon</div>
                  <div className="pulse-sr-desc">Confirms physical arrival automatically when stepping through club entrance podium</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoCheckIn}
                  onChange={e => setAutoCheckIn(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>

              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Proximity Radar Alerts (&lt;500m)</div>
                  <div className="pulse-sr-desc">Notifies you if your reserved table or waitlist queue is approaching when nearby</div>
                </div>
                <input
                  type="checkbox"
                  checked={proximityAlerts}
                  onChange={e => setProximityAlerts(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Live Seat & High Roller Alerts */}
          <div className="pulse-settings-group">
            <div className="pulse-settings-group-header">
              <Bell size={16} className="pulse-set-icon" />
              <span>LIVE TABLE NOTIFICATIONS</span>
            </div>

            <div className="pulse-settings-toggles">
              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Instant Seat Offer Notification</div>
                  <div className="pulse-sr-desc">180-second priority seat hold notification when seat opens</div>
                </div>
                <input
                  type="checkbox"
                  checked={seatAlerts}
                  onChange={e => setSeatAlerts(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>

              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">High Stakes Action Alerts (₹500/₹1,000+)</div>
                  <div className="pulse-sr-desc">Alert when high-roller games start up or uncapped tables open</div>
                </div>
                <input
                  type="checkbox"
                  checked={highStakesAlerts}
                  onChange={e => setHighStakesAlerts(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>

              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Chip Click Sound & Haptics</div>
                  <div className="pulse-sr-desc">Tactile vibrations and felt sounds on table reservations</div>
                </div>
                <input
                  type="checkbox"
                  checked={soundHaptics}
                  onChange={e => setSoundHaptics(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Security & Biometrics */}
          <div className="pulse-settings-group">
            <div className="pulse-settings-group-header">
              <Lock size={16} className="pulse-set-icon" />
              <span>SECURITY & CAGE AUTHORIZATION</span>
            </div>

            <div className="pulse-settings-toggles">
              <label className="pulse-settings-row">
                <div className="pulse-sr-info">
                  <div className="pulse-sr-title">Face ID / Touch ID for Buy-in Approvals</div>
                  <div className="pulse-sr-desc">Require biometric verification before cage chips transfer</div>
                </div>
                <input
                  type="checkbox"
                  checked={biometricAuth}
                  onChange={e => setBiometricAuth(e.target.checked)}
                  className="pulse-checkbox"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="pulse-settings-footer">
          <button type="button" className="pulse-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="pulse-primary-cta-btn" onClick={handleSave}>
            {savedSuccess ? (
              <>
                <Check size={16} />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
