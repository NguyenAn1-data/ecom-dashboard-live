import React from 'react';
import { FileText } from 'lucide-react';

interface SetupGuideModalProps {
  showSetupGuide: boolean;
}

export default function SetupGuideModal({ showSetupGuide }: SetupGuideModalProps) {
  if (!showSetupGuide) return null;

  return (
    <section className="bg-[#0b101c] border-b border-slate-800 p-6 px-8 animate-in slide-in-from-top duration-300">
      <div className="max-w-4xl">
        <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          Google Sheets Real-time Sync Configuration
        </h2>
        <p className="text-xs text-slate-400 mb-2">
          Your Google Cloud Service Account credentials have been configured inside [.env.local](file:///d:/e-com%20example/dashboard/.env.local).
          Simply share your Google Sheet with the Service Account email below as an <strong>Editor</strong>:
        </p>
        <div className="bg-[#050810] border border-slate-900 p-2.5 rounded font-mono text-[11px] text-blue-400 select-all max-w-fit mb-4">
          thiennhien1@ecom-example-501902.iam.gserviceaccount.com
        </div>
        <p className="text-xs text-slate-400 leading-normal">
          Then run: <code className="text-slate-300 font-mono bg-slate-950 px-1 py-0.5 rounded">python dashboard/scripts/upload_sheets.py</code> in your console to sync.
        </p>
      </div>
    </section>
  );
}
