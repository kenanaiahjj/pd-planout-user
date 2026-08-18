/**
 * @file CertificatesTab.tsx
 * @description Certificates & Trainings tab — manage active/expired
 * professional certifications and training records.
 */
import React, { useState } from 'react';
import {
  Plus,
  X,
  Award,
  Building2,
  Calendar,
  Hash,
  Eye,
  EyeOff,
} from 'lucide-react';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { PrimaryButton } from '../PrimaryButton';
import { IconButton } from '../IconButton';
import { FormTextField } from '../FormTextField';
import { ConfirmDialog } from '../ConfirmDialog';

// --- Mock certificate data ---
interface Certificate {
  id: string;
  name: string;
  issuer: string;
  certId: string;
  expiresDate: string;
  expired: boolean;
  visible: boolean;
}

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    name: 'First Aid & CPR Certification',
    issuer: 'Red Cross Philippines',
    certId: 'RC-2023-FA-001234',
    expiresDate: '3/15/2025',
    expired: false,
    visible: true,
  },
  {
    id: 'cert-2',
    name: 'Advanced Wilderness First Responder',
    issuer: 'Wilderness Medical Associates',
    certId: 'WMA-AWFR-2023-9012',
    expiresDate: '6/10/2026',
    expired: false,
    visible: true,
  },
  {
    id: 'cert-3',
    name: 'Sports Event Management',
    issuer: 'Philippine Sports Commission',
    certId: 'PSC-SEM-2022-5678',
    expiresDate: '8/20/2024',
    expired: true,
    visible: true,
  },
];

function CertificateCard({
  cert,
  onToggleVisibility,
}: {
  cert: Certificate;
  onToggleVisibility: () => void;
}) {
  return (
    <div
      className={`account-settings-section flex flex-col gap-3 border-b p-4 sm:p-5 transition-colors ${
        !cert.visible
          ? 'border-slate-200/80 opacity-60'
          : cert.expired
          ? 'border-red-200/70 bg-red-50/20'
          : 'border-slate-200/80'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${
              !cert.visible
                ? 'bg-slate-100'
                : cert.expired
                ? 'bg-red-50'
                : 'bg-[#def2ee]'
            }`}
          >
            <Award
              className={`w-4 h-4 ${
                !cert.visible
                  ? 'text-[#94a3b8]'
                  : cert.expired
                  ? 'text-[#dc2626]'
                  : 'text-[#177564]'
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className={`text-[14px] font-semibold ${
                  !cert.visible ? 'text-[#94a3b8]' : 'text-[#181d27]'
                }`}
              >
                {cert.name}
              </p>
              {cert.expired && cert.visible && (
                <span className="px-2 py-0.5 text-[10px] font-semibold text-[#dc2626]">
                  Expired
                </span>
              )}
              {!cert.visible && (
                <span className="px-2 py-0.5 text-[10px] font-semibold text-[#94a3b8]">
                  Hidden
                </span>
              )}
            </div>
          </div>
        </div>
        {cert.visible ? (
          <ConfirmDialog
            trigger={
              <button
                aria-label={`Hide ${cert.name}`}
                className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center text-[#94a3b8] transition-colors hover:text-[#177564]"
              >
                <Eye className="w-4 h-4" />
              </button>
            }
            icon={<EyeOff className="w-6 h-6" />}
            iconVariant="info"
            title="Hide Certificate?"
            description={
              <>
                <strong>{cert.name}</strong> will be hidden from your public profile. You can show it again at any time.
              </>
            }
            confirmLabel="Yes, Hide"
            cancelLabel="Cancel"
            variant="default"
            onConfirm={onToggleVisibility}
          />
        ) : (
          <button
            onClick={onToggleVisibility}
            aria-label={`Show ${cert.name}`}
            className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center text-[#94a3b8] transition-colors hover:text-[#177564]"
            title="Show on profile"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 ml-11">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#94a3b8]" />
          <span className="text-[#64748b] text-[12px]">{cert.issuer}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
          <span className="text-[#64748b] text-[12px]">
            {cert.expired ? 'Expired:' : 'Expires:'} {cert.expiresDate}
          </span>
        </div>
      </div>

      <div className="ml-11">
        <span className="inline-flex items-center gap-1 border-l-2 border-slate-300 px-2 py-0.5 text-[11px] font-mono text-[#64748b]">
          <Hash className="w-3 h-3" />
          {cert.certId}
        </span>
      </div>
    </div>
  );
}

// --- Add Certificate Modal ---
function AddCertificateModal({ onClose, onAdd }: { onClose: () => void; onAdd: (cert: Certificate) => void }) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [certId, setCertId] = useState('');
  const [expires, setExpires] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !issuer.trim()) return;
    onAdd({
      id: `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      certId: certId.trim() || 'N/A',
      expiresDate: expires || 'N/A',
      expired: false,
      visible: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-[20px] sm:rounded-3xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 fade-in duration-300">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#def2ee] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#177564]" />
            </div>
            <div>
              <h3 className="text-[#181d27] text-[18px] font-semibold tracking-tight">Add Certificate</h3>
              <p className="text-[#94a3b8] text-[12px]">Add a new certification or training</p>
            </div>
          </div>
          <IconButton onClick={onClose} aria-label="Close add certificate">
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="px-5 sm:px-6 pb-6 flex flex-col gap-4">
          <FormTextField
            label="Certificate Name"
            required
            placeholder="e.g. First Aid & CPR Certification"
            value={name}
            onChange={setName}
          />

          <FormTextField
            label="Issuing Organization"
            required
            placeholder="e.g. Red Cross Philippines"
            value={issuer}
            onChange={setIssuer}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormTextField
              label="Certificate ID"
              placeholder="e.g. RC-2023-001234"
              value={certId}
              onChange={setCertId}
            />
            <FormTextField
              label="Expiration Date"
              placeholder="MM/DD/YYYY"
              value={expires}
              onChange={setExpires}
            />
          </div>

          <PrimaryButton
            onClick={handleSubmit}
            fullWidth
            disabled={!name.trim() || !issuer.trim()}
            className="mt-2 py-3"
          >
            Add Certificate
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export function CertificatesTab() {
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
  const [showAddModal, setShowAddModal] = useState(false);

  const active = certificates.filter((c) => !c.expired);
  const expired = certificates.filter((c) => c.expired);

  const toggleVisibility = (id: string) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  const addCert = (cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Header */}
      <section className="account-settings-section border-b border-slate-200/80 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[#181d27] text-[16px] font-semibold">Certificates & Trainings</h3>
            <p className="text-[#94a3b8] text-[13px] mt-0.5">Manage your professional certifications and training records</p>
          </div>
        </div>
      </section>

      {/* Active Certificates */}
      {active.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#177564]" />
            <p className="text-[#181d27] text-[14px] font-semibold">
              Active Certificates ({active.length})
            </p>
          </div>
          {active.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onToggleVisibility={() => toggleVisibility(cert.id)}
            />
          ))}
        </div>
      )}

      {/* Expired Certificates */}
      {expired.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
            <p className="text-[#181d27] text-[14px] font-semibold">
              Expired Certificates ({expired.length})
            </p>
          </div>
          {expired.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onToggleVisibility={() => toggleVisibility(cert.id)}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {certificates.length === 0 && (
        <div className="flex flex-col items-center gap-3 border-y border-slate-200/80 bg-white p-8 text-center">
          <EmptyStateGraphic kind="no-certificates" className="h-32 w-32" />
          <p className="text-[#181d27] text-sm font-semibold">No certificates yet</p>
          <p className="text-[#94a3b8] text-[13px]">
            Add your professional certifications and training records.
          </p>
          <PrimaryButton compact onClick={() => setShowAddModal(true)} className="mt-2">
            <Plus className="w-4 h-4" />
            Add Your First Certificate
          </PrimaryButton>
        </div>
      )}

      {showAddModal && (
        <AddCertificateModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCert}
        />
      )}
    </div>
  );
}
