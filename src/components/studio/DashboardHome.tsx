import React from 'react';
import { Newspaper, Cake, Award, Megaphone, Droplet } from 'lucide-react';
import { StudioModuleId } from '../../types/studio';
import { Language } from '../../utils/translations';

interface DashboardHomeProps {
  onSelectModule: (moduleId: StudioModuleId) => void;
  isDark: boolean;
  language: Language;
}

interface ModuleButtonDef {
  id: StudioModuleId;
  titleBn: string;
  titleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onSelectModule,
  isDark,
  language,
}) => {
  const modules: ModuleButtonDef[] = [
    {
      id: 'news',
      titleBn: 'ASP কানেক্ট নিউজ',
      titleEn: 'ASP Connect News',
      icon: Newspaper,
      iconColorClass: 'text-rose-500',
    },
    {
      id: 'birthday',
      titleBn: 'জন্মদিন কার্ড মেকার',
      titleEn: 'Birthday Card Maker',
      icon: Cake,
      iconColorClass: 'text-emerald-500',
    },
    {
      id: 'appreciation',
      titleBn: 'সম্মাননা পোস্ট',
      titleEn: 'Appreciation Post',
      icon: Award,
      iconColorClass: 'text-amber-500',
    },
    {
      id: 'announcement',
      titleBn: 'অফিশিয়াল বিজ্ঞপ্তি',
      titleEn: 'Official Announcement',
      icon: Megaphone,
      iconColorClass: 'text-sky-500',
    },
    {
      id: 'blood',
      titleBn: 'ASP রক্তদান কার্ড',
      titleEn: 'ASP Blood Donation',
      icon: Droplet,
      iconColorClass: 'text-red-500',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelectModule(mod.id)}
              className={`group flex items-center gap-4 px-6 py-5 rounded-2xl border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-rose-500/60 hover:bg-slate-900/80 text-slate-100'
                  : 'bg-white border-slate-200 hover:border-rose-400 shadow-xs hover:shadow-md text-slate-900'
              }`}
            >
              <Icon className={`w-6 h-6 shrink-0 ${mod.iconColorClass}`} />
              <span className="font-display text-lg font-bold tracking-tight group-hover:text-rose-500 transition-colors">
                {language === 'bn' ? mod.titleBn : mod.titleEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
