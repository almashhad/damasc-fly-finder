-- Add Aleppo International Airport
INSERT INTO public.destinations (
  airport_code,
  airport_name,
  airport_name_ar,
  city,
  city_ar,
  country,
  country_ar,
  is_active
) VALUES (
  'ALP',
  'Aleppo International Airport',
  'مطار حلب الدولي',
  'Aleppo',
  'حلب',
  'Syria',
  'سوريا',
  true
);

-- Add sample flights for Aleppo (similar to Damascus flights)
INSERT INTO public.flights (
  flight_number,
  airline_id,
  origin_id,
  destination_id,
  departure_time,
  arrival_time,
  duration_minutes,
  price_usd,
  stops,
  days_of_week,
  is_active
)
SELECT 
  'SY' || (400 + ROW_NUMBER() OVER()),
  f.airline_id,
  (SELECT id FROM destinations WHERE airport_code = 'ALP'),
  f.destination_id,
  f.departure_time,
  f.arrival_time,
  f.duration_minutes + 30,
  f.price_usd + 25,
  f.stops,
  f.days_of_week,
  true
FROM flights f
WHERE f.origin_id = (SELECT id FROM destinations WHERE airport_code = 'DAM')
  AND f.is_active = true
LIMIT 5;

-- Also add reverse flights (to Aleppo)
INSERT INTO public.flights (
  flight_number,
  airline_id,
  origin_id,
  destination_id,
  departure_time,
  arrival_time,
  duration_minutes,
  price_usd,
  stops,
  days_of_week,
  is_active
)
SELECT 
  'SY' || (500 + ROW_NUMBER() OVER()),
  f.airline_id,
  f.origin_id,
  (SELECT id FROM destinations WHERE airport_code = 'ALP'),
  f.departure_time,
  f.arrival_time,
  f.duration_minutes + 30,
  f.price_usd + 25,
  f.stops,
  f.days_of_week,
  true
FROM flights f
WHERE f.destination_id = (SELECT id FROM destinations WHERE airport_code = 'DAM')
  AND f.is_active = true
LIMIT 5;