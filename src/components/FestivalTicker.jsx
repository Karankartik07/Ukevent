'use client';

const FESTIVALS = [
  { name: 'Diwali Festival', query: 'Diwali', tag: 'diwali' },
  { name: 'Eid Festival', query: 'Eid', tag: 'eid' },
  { name: 'Holi Festival', query: 'Holi', tag: 'holi' },
  { name: 'Vaisakhi Mela', query: 'Vaisakhi', tag: 'vaisakhi' },
  { name: 'Navratri Garba', query: 'Navratri', tag: 'navratri' },
  { name: 'Durga Puja', query: 'Durga', tag: 'durga' },
  { name: 'Independence Day', query: 'Independence', tag: 'independence' },
  { name: 'Onam UK', query: 'Onam', tag: 'onam' },
];

export default function FestivalTicker({ activeFilter, onSelectFestival }) {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center overflow-x-auto hide-scrollbar space-x-3 sm:space-x-6">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full shrink-0">
          Festivals 2026
        </span>
        {FESTIVALS.map((fest) => {
          const isActive = activeFilter === fest.query;
          return (
            <button
              key={fest.name}
              onClick={() => onSelectFestival && onSelectFestival(fest.query === activeFilter ? '' : fest.query)}
              className={`shrink-0 text-xs sm:text-sm font-medium transition-all px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                isActive
                  ? 'bg-white text-orange-600 font-bold shadow-sm scale-105'
                  : 'text-white/95 hover:text-white hover:bg-white/15'
              }`}
            >
              {fest.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
