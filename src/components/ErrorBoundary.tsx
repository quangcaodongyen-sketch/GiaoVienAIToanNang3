import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, MessageCircle, AlertTriangle } from 'lucide-react';
import { BRAND } from '../config/brand';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GIÁO VIÊN AI] Uncaught Error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = '/';
  };

  public handleClearCacheAndReload = () => {
    try {
      sessionStorage.clear();
      // Giữ lại key bản quyền, chỉ xóa cache tạm
      const keysToKeep = ['gvai_hardware_machine_id', 'gvai_taode_hw_code', 'gvai_taode_active_key'];
      const backup: Record<string, string> = {};
      keysToKeep.forEach(k => {
        const v = localStorage.getItem(k);
        if (v) backup[k] = v;
      });
      localStorage.clear();
      Object.entries(backup).forEach(([k, v]) => localStorage.setItem(k, v));
    } catch (e) {
      console.warn(e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/40">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                HỆ THỐNG GIÁO VIÊN AI TOÀN NĂNG
              </h2>
              <p className="text-sm text-slate-300">
                Đã xảy ra sự cố hiển thị tạm thời trên trình duyệt của Thầy/Cô.
              </p>
              <p className="text-xs text-slate-400">
                Tác giả Đinh Thành, ĐT: 0915.213717  (Hotline/Zalo: <strong>0915.213717</strong>)
              </p>
              {this.state.error && (
                <div className="mt-3 text-left bg-slate-950/90 p-3 rounded-xl border border-red-900/60 text-xs font-mono">
                  <div className="font-bold text-red-400 mb-1 flex items-center gap-1.5">
                    <span>⚠️ Lỗi phát hiện:</span>
                    <span className="text-red-300 font-semibold">{this.state.error.name}</span>
                  </div>
                  <div className="text-red-200 text-[11px] break-all">{this.state.error.message}</div>
                  {this.state.error.stack && (
                    <details className="mt-2 text-slate-400 text-[10px]">
                      <summary className="cursor-pointer hover:text-slate-200">Chi tiết dấu vết lỗi (Stack trace)</summary>
                      <pre className="mt-1 p-2 bg-slate-900 rounded text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-36">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TẢI LẠI TRANG</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>VỀ TRANG CHỦ</span>
              </button>
            </div>

            <button
              onClick={this.handleClearCacheAndReload}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 font-semibold text-xs transition cursor-pointer border border-slate-800"
            >
              🧹 Xóa Bộ Nhớ Đệm Trình Duyệt & Tải Lại Mới
            </button>

            <div className="pt-4 border-t border-slate-800">
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hỗ trợ kỹ thuật Zalo Thầy Thành: 0915.213717</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
