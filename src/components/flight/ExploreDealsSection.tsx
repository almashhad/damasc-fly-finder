import { useMinPricesForAirports } from "@/hooks/useFlights";
import type { NavigateFunction } from "react-router-dom";

const airports = [
  { name: "دمشق", sub: "مطار دمشق الدولي", code: "DAM" },
  { name: "حلب", sub: "مطار حلب الدولي", code: "ALP" },
];

interface Props {
  navigate: NavigateFunction;
}

export function ExploreDealsSection({ navigate }: Props) {
  const { data: minPrices } = useMinPricesForAirports(["DAM", "ALP"]);

  return (
    <div className="syria-explore-sec">
      <div className="syria-explore-header">
        <h2 className="syria-explore-h2">وفّر على رحلتك القادمة</h2>
        <p className="syria-explore-desc">
          اكتشف أرخص الأسعار المتاحة وأفضل أوقات السفر من خلال تقويم الأسعار
        </p>
      </div>
      {airports.map((a, i) => {
        const info = minPrices?.[a.code];
        return (
          <button
            key={a.code}
            className="syria-explore-row"
            style={{ animationDelay: `${400 + i * 80}ms` }}
            onClick={() => navigate(`/explore/${a.code}`)}
          >
            {/* Icon */}
            <div className="syria-explore-avi">
              <svg width="22" height="22" fill="none" stroke="hsl(217 91% 50%)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>

            {/* Info */}
            <div className="syria-explore-info">
              <div className="syria-explore-top-row">
                <span className="syria-explore-name">رحلات {a.name}</span>
                {info && info.minPrice > 0 && (
                  <span className="syria-explore-tag">أسعار مميزة</span>
                )}
              </div>
              <span className="syria-explore-sub">{a.sub}</span>
              {info && (
                <div className="syria-explore-meta">
                  {info.destinationCount > 0 && (
                    <span className="syria-explore-dest-count">
                      {info.destinationCount} وجهات متاحة
                    </span>
                  )}
                  {info.minPrice > 0 && (
                    <span className="syria-explore-price">
                      ابتداءً من ${info.minPrice}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Badge + Chevron */}
            <div className="syria-explore-badge">{a.code}</div>
            <svg className="syria-explore-chevron" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
