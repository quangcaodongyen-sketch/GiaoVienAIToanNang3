import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { getAppShareUrl, copyToClipboard } from '../utils/shareUtils';

interface ShareLinkBarProps {
  appUrl: string;
  appName?: string;
  className?: string;
  compact?: boolean;
}

export const ShareLinkBar: React.FC<ShareLinkBarProps> = ({
  appUrl,
  appName,
  className = '',
  compact = false
}) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = getAppShareUrl(appUrl);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(fullUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
          copied
            ? 'bg-emerald-500 text-slate-950 font-black'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        } ${className}`}
        title={`Sao chép link gửi khách: ${fullUrl}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÃ COPY LINK!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Sao chép Link gửi khách</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div
      className={`px-4 py-2.5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border-b border-cyan-800/40 flex items-center justify-between gap-3 flex-wrap ${className}`}
    >
      <div className="flex items-center gap-2.5 text-xs min-w-0 flex-1">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span className="text-slate-300 font-bold shrink-0">
          Link gửi khách {appName ? `(${appName}):` : ':'}
        </span>
        <code className="text-cyan-300 font-mono bg-slate-950/90 px-3 py-1 rounded-xl border border-cyan-700/60 text-xs font-bold truncate max-w-xs sm:max-w-md select-all">
          {fullUrl}
        </code>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 ${
            copied
              ? 'bg-emerald-400 text-slate-950'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
          title={`Bấm để sao chép link gửi khách qua Zalo/Facebook`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>✓ ĐÃ SAO CHÉP THÀNH CÔNG!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>📋 SAO CHÉP LINK GỬI KHÁCH</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
