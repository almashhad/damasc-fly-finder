import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DealsBannerProps {
  cityName: string;
  onExplore: () => void;
}

export function DealsBanner({ cityName, onExplore }: DealsBannerProps) {
  return (
    <Card className="border-0 bg-gradient-to-l from-[hsl(210,100%,97%)] to-[hsl(210,100%,98%)] shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-medium text-foreground">
                أرخص الرحلات من وإلى {cityName} هذا الشهر
              </h3>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
                صفقات
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              اكتشف أفضل الأسعار للرحلات الجوية من وإلى مطار {cityName} الدولي
            </p>
          </div>
          
          {/* Button */}
          <Button 
            variant="outline"
            className="flex-shrink-0 bg-white hover:bg-gray-50 border-gray-200 text-primary font-medium"
            onClick={onExplore}
          >
            استكشاف الصفقات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
