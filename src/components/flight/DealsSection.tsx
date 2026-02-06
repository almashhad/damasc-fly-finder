import { Plane, ChevronLeft } from "lucide-react";

interface ExploreRowProps {
  cityName: string;
  airportCode: string;
  airportLabel: string;
  onExplore: () => void;
  delay?: number;
}

function ExploreRow({ cityName, airportCode, airportLabel, onExplore, delay = 0 }: ExploreRowProps) {
  return (
    <button
      className="flex items-center gap-4 p-[18px_20px] w-full bg-background border-[1.5px] border-border rounded-[20px] mb-2.5 text-right shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-[250ms] hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-[0_4px_16px_hsl(var(--primary)/0.06)] hover:-translate-y-0.5 active:translate-y-0 group animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onExplore}
    >
      {/* Airplane Icon */}
      <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-primary/10 to-primary/[0.15] flex items-center justify-center flex-shrink-0">
        <Plane className="h-[22px] w-[22px] text-primary" strokeWidth={1.5} />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[15px] font-semibold text-foreground">
          أرخص الرحلات من وإلى {cityName}
        </span>
        <span className="text-[13px] text-muted-foreground">
          {airportCode} · {airportLabel}
        </span>
      </div>

      {/* Chevron */}
      <ChevronLeft className="h-5 w-5 text-primary flex-shrink-0 opacity-50 transition-opacity duration-150 group-hover:opacity-100" />
    </button>
  );
}

interface ExploreSectionProps {
  onExploreDamascus: () => void;
  onExploreAleppo: () => void;
}

export function ExploreSection({ onExploreDamascus, onExploreAleppo }: ExploreSectionProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-10 relative z-[1]">
      <h2 className="text-xl font-bold text-foreground mb-3.5 px-2 animate-fade-in">
        استكشف الرحلات
      </h2>
      <ExploreRow
        cityName="دمشق"
        airportCode="DAM"
        airportLabel="مطار دمشق الدولي"
        onExplore={onExploreDamascus}
        delay={400}
      />
      <ExploreRow
        cityName="حلب"
        airportCode="ALP"
        airportLabel="مطار حلب الدولي"
        onExplore={onExploreAleppo}
        delay={480}
      />
    </div>
  );
}
