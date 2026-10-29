import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyReferenceStyle: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({
  isOpen,
  onClose,
  onApplyReferenceStyle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              রেফারেন্স স্টাইল গাইড ও ডিজাইন স্পেক
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ডেইলি টাইমস অফ বাংলাদেশের রেফারেন্স কার্ড এবং ASP কানেক্ট ব্র্যান্ডিং
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-side reference view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Reference Image 1: Daily Times News Card */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              প্রদত্ত স্টাইল রেফারেন্স (Daily Times)
            </span>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/5] flex items-center justify-center">
              <img
                src="/assets/aistudio/image_6c8a5620.png"
                alt="Style Reference"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              বৈশিষ্ট্য: টপ-লেফটে লোগো, টপ-রাইটে তারিখ, উপরের অংশে ৫০-৫৫% ফটো, লাল ক্যাটাগরি বক্স, বড় বোল্ড হেডলাইন (প্রথম অংশ হলুদ হাইলাইট), নিচে বিস্তারিত কমেন্টে ও ওয়েবসাইট লিংক।
            </p>
          </div>

          {/* Reference Image 2: ASP কানেক্ট Logo */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              ASP কানেক্ট মূল লোগো
            </span>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-white p-6 aspect-[4/5] flex flex-col items-center justify-center text-center">
              <img
                src="/assets/aistudio/image_15d93372.png"
                alt="ASP কানেক্ট Logo"
                className="max-h-48 object-contain"
              />
              <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200 text-left w-full text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">স্বয়ংক্রিয় অ্যাডাপ্টেশন:</div>
                <div>• ডার্ক ফটোকার্ডে কালো ASP অটোমেটিক সাদা ও স্পষ্ট রেন্ডার হয়</div>
                <div>• 'কানেক্ট' ভাইব্রেন্ট রেড কালারে সংরক্ষিত থাকে</div>
                <div>• ভেক্টর রেন্ডারিংয়ে 4K এক্সপোর্ট পর্যন্ত ক্রিস্টাল ক্লিয়ার থাকে</div>
              </div>
            </div>
          </div>
        </div>

        {/* Design improvements implemented */}
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-slate-200">লেআউট উন্নতকরণ ও আধুনিক সুবিধা:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>বাংলা ও ইংরেজি দুই ভাষার নিখুঁত টাইপোগ্রাফি</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ছবি জুম ও ফেস অ্যাডজাস্টমেন্ট স্লাইডার</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>১-ক্লিকে ফেসবুকে পেস্ট করার জন্য ক্লিপবোর্ড কপি</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>মোবাইলে সহজে কার্ড বানিয়ে পোস্ট করার রেসপনসিভ ভিউ</span>
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={() => {
              onApplyReferenceStyle();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all shadow-md shadow-rose-950"
          >
            <span>রেফারেন্স স্টাইল প্রয়োগ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
