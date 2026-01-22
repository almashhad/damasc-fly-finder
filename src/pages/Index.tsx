import { useState, useEffect, useMemo } from "react";
import { Plane, Loader2, ArrowLeftRight, ExternalLink, Clock, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDestinations, useDamascusFlights } from "@/hooks/useFlights";
import type { Flight, Destination } from "@/types/flight";
import { cn } from "@/lib/utils";

// Map countries to their likely airport codes
const countryToAirport: Record<string, string> = {
  'AE': 'DXB', 'QA': 'DOH', 'SA': 'JED', 'KW': 'KWI', 'BH': 'BAH',
  'OM': 'MCT', 'JO': 'AMM', 'LB': 'BEY', 'EG': 'CAI', 'TR': 'IST',
  'IQ': 'BGW', 'RU': 'SVO',
};

const Index = () => {
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [tripDirection, setTripDirection] = useState<'to' | 'from'>('to');
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  
  const { data: destinations } = useDestinations();
  const { data: flights, isLoading: flightsLoading } = useDamascusFlights(
    tripDirection === 'to' ? 'to' : 'from',
    userLocation || undefined
  );

  // Non-Damascus destinations
  const otherDestinations = useMemo(() => {
    return destinations?.filter(d => d.airport_code !== 'DAM') || [];
  }, [destinations]);

  // Detect user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'SY') {
          setUserLocation('DXB');
          setTripDirection('from');
        } else if (data.country_code && countryToAirport[data.country_code]) {
          setUserLocation(countryToAirport[data.country_code]);
        } else {
          setUserLocation('DXB');
        }
      } catch (error) {
        setUserLocation('DXB');
      } finally {
        setIsDetecting(false);
      }
    };
    detectLocation();
  }, []);

  const userDestination = useMemo(() => {
    return destinations?.find(d => d.airport_code === userLocation);
  }, [destinations, userLocation]);

  const toggleDirection = () => {
    setTripDirection(prev => prev === 'to' ? 'from' : 'to');
  };

  const handleSelectCity = (code: string) => {
    setUserLocation(code);
    setCityPickerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background" dir="rtl">
      {/* Simple Header */}
      <header className="py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">رحلات دمشق</h1>
        </div>
        <p className="text-muted-foreground text-sm">ابحث عن رحلتك بسهولة</p>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl px-4 pb-12">
        {/* Route Display */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              {/* From */}
              <div className="flex-1 p-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">من</p>
                {tripDirection === 'to' ? (
                  <CitySelector
                    destinations={otherDestinations}
                    selectedCode={userLocation}
                    onSelect={handleSelectCity}
                    isOpen={cityPickerOpen}
                    setIsOpen={setCityPickerOpen}
                    isDetecting={isDetecting}
                    selectedCity={userDestination}
                  />
                ) : (
                  <div>
                    <p className="text-xl font-bold">دمشق</p>
                    <p className="text-sm text-muted-foreground">DAM</p>
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-2 flex-shrink-0 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={toggleDirection}
              >
                <ArrowLeftRight className="h-5 w-5" />
              </Button>

              {/* To */}
              <div className="flex-1 p-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">إلى</p>
                {tripDirection === 'from' ? (
                  <CitySelector
                    destinations={otherDestinations}
                    selectedCode={userLocation}
                    onSelect={handleSelectCity}
                    isOpen={cityPickerOpen}
                    setIsOpen={setCityPickerOpen}
                    isDetecting={isDetecting}
                    selectedCity={userDestination}
                  />
                ) : (
                  <div>
                    <p className="text-xl font-bold">دمشق</p>
                    <p className="text-sm text-muted-foreground">DAM</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Detection Message */}
        {isDetecting && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">جاري تحديد موقعك...</span>
          </div>
        )}

        {/* Flights List */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg mb-4">
            {flightsLoading ? 'جاري البحث...' : `${flights?.length || 0} رحلة متاحة`}
          </h2>

          {flightsLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">جاري البحث عن أفضل الرحلات...</p>
            </div>
          ) : flights && flights.length > 0 ? (
            flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))
          ) : (
            <Card className="py-16 text-center">
              <Plane className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد رحلات متاحة حالياً</p>
              <p className="text-sm text-muted-foreground mt-1">جرب اختيار مدينة أخرى</p>
            </Card>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center border-t bg-muted/30">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} رحلات دمشق
        </p>
      </footer>
    </div>
  );
};

// City Selector Component
function CitySelector({
  destinations,
  selectedCode,
  onSelect,
  isOpen,
  setIsOpen,
  isDetecting,
  selectedCity,
}: {
  destinations: Destination[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isDetecting: boolean;
  selectedCity?: Destination;
}) {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center gap-1">
            <p className="text-xl font-bold">
              {isDetecting ? 'جاري التحديد...' : (selectedCity?.city_ar || 'اختر مدينة')}
            </p>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedCode || '...'}
          </p>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="center">
        <Command>
          <CommandInput placeholder="ابحث عن مدينة..." className="text-right" />
          <CommandList>
            <CommandEmpty>لا توجد نتائج</CommandEmpty>
            <CommandGroup>
              {destinations.map((dest) => (
                <CommandItem
                  key={dest.id}
                  value={`${dest.city_ar} ${dest.city} ${dest.airport_code}`}
                  onSelect={() => onSelect(dest.airport_code)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedCode === dest.airport_code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="text-right">
                      <p className="font-medium">{dest.city_ar}</p>
                      <p className="text-xs text-muted-foreground">{dest.country_ar}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-primary">{dest.airport_code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Simplified Flight Card
function FlightCard({ flight }: { flight: Flight }) {
  const formatTime = (time: string) => time.slice(0, 5);
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}س ${mins > 0 ? `${mins}د` : ''}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Airline */}
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary">{flight.airline?.code}</span>
          </div>

          {/* Flight Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold">{formatTime(flight.departure_time)}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-bold">{formatTime(flight.arrival_time)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(flight.duration_minutes)}
              </span>
              <Badge variant={flight.stops === 0 ? "default" : "secondary"} className="text-xs">
                {flight.stops === 0 ? "مباشرة" : `${flight.stops} توقف`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {flight.airline?.name_ar}
            </p>
          </div>

          {/* Price & Book */}
          <div className="text-left flex-shrink-0">
            <p className="text-xl font-bold text-primary">
              {flight.price_usd ? `$${flight.price_usd}` : '-'}
            </p>
            {flight.airline?.website_url && (
              <Button asChild size="sm" variant="outline" className="mt-2 w-full">
                <a href={flight.airline.website_url} target="_blank" rel="noopener noreferrer">
                  احجز
                  <ExternalLink className="h-3 w-3 mr-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Index;
