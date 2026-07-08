'use client';

import { useRef, useState } from 'react';
import { usePlanner } from '@/lib/planner/store';
import Modal, { primaryBtnStyle } from './Modal';
import { Download, Upload, AlertTriangle, Trash2 } from 'lucide-react';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { exportData, importData, resetAll, state } = usePlanner();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedOk, setImportedOk] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compass-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (file: File) => {
    setImportError(null);
    setImportedOk(false);
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result ?? ''));
      if (ok) setImportedOk(true);
      else setImportError("That file doesn't look like a Compass backup.");
    };
    reader.onerror = () => setImportError('Could not read that file.');
    reader.readAsText(file);
  };

  const totalItems = state.goals.length + state.activities.length + state.blocks.length;

  return (
    <Modal title="Settings & data" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, display: 'flex', gap: 10 }}>
          <AlertTriangle size={16} style={{ color: '#92400e', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.5 }}>
            Everything is stored only in this browser. Clearing site data or switching devices will lose it —
            export a backup regularly.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: 8 }}>Backup</h3>
          <button
            onClick={handleExport}
            style={{ ...primaryBtnStyle, background: '#111827' }}
          >
            <Download size={15} /> Export {totalItems > 0 ? `(${totalItems} items)` : ''}
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: 8 }}>Restore</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#fff', color: '#374151', padding: '11px 20px', borderRadius: 7,
              fontSize: '0.88rem', fontWeight: 700, border: '1.5px solid #d1d5db', cursor: 'pointer', width: '100%',
            }}
          >
            <Upload size={15} /> Import backup file
          </button>
          {importError && <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: 8 }}>{importError}</p>}
          {importedOk && <p style={{ fontSize: '0.8rem', color: '#059669', marginTop: 8 }}>Backup restored.</p>}
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 6 }}>Importing replaces everything currently in Compass.</p>
        </div>

        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Danger zone</h3>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fef2f2', color: '#dc2626', padding: '10px 16px', borderRadius: 7,
                fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >
              <Trash2 size={14} /> Erase all data
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => { resetAll(); setConfirmReset(false); onClose(); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#dc2626', color: '#fff', padding: '10px 16px', borderRadius: 7,
                  fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                }}
              >
                Confirm — erase everything
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{
                  background: '#fff', color: '#374151', padding: '10px 16px', borderRadius: 7,
                  fontSize: '0.85rem', fontWeight: 600, border: '1.5px solid #d1d5db', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
