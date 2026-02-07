

# اضافة زر استكشاف مخصص بناء على موقع المستخدم

## المشكلة
المستخدم في دبي (مثلا) يرى فقط "رحلات دمشق" و"رحلات حلب" ويعتقد ان القسم مخصص للمسافرين من سوريا فقط. لا يوجد ما يوحي له بان هناك رحلات من مدينته الى سوريا.

## الحل
اضافة زر ثالث مخصص يظهر تلقائيا بناء على الموقع المكتشف للمستخدم. مثلا اذا كان المستخدم في دبي يظهر زر "رحلات من دبي الى سوريا" مع سعر ابتدائي حقيقي.

### الهيكل الجديد للقسم

```text
+----------------------------------------------+
| وفّر على رحلتك القادمة                       |
+----------------------------------------------+
| [✈] رحلات من دبي     [مخصص لك]              |
|     رحلات مباشرة إلى دمشق وحلب              |
|     ابتداءً من $120                 ←        |
+----------------------------------------------+
| [✈] رحلات دمشق       [أسعار مميزة]          |
|     مطار دمشق الدولي                        |
|     8 وجهات · ابتداءً من $85        ←        |
+----------------------------------------------+
| [✈] رحلات حلب        [أسعار مميزة]           |
|     مطار حلب الدولي                          |
|     4 وجهات · ابتداءً من $170       ←        |
+----------------------------------------------+
```

### سلوك الزر المخصص
- يظهر فقط اذا تم اكتشاف موقع المستخدم بنجاح وكان خارج سوريا
- اذا كان المستخدم في سوريا: لا يظهر (لان الازرار الموجودة كافية)
- اذا فشل اكتشاف الموقع: لا يظهر
- عند النقر: يفتح صفحة Explore لمطار دمشق مع فلتر مدينة المستخدم مفعّل تلقائيا

### ربط مع صفحة Explore
- اضافة query parameter `?dest=DXB` عند التنقل
- صفحة Explore تقرا هذا الـ parameter وتفعّل الفلتر تلقائيا

---

## التفاصيل التقنية

### 1. تعديل `src/components/flight/ExploreDealsSection.tsx`

**اضافة props جديدة:**
- `userLocation: string | null` - كود المطار المكتشف
- `userCityName: string | null` - اسم المدينة بالعربي
- `isDetecting: boolean` - هل لا يزال يكتشف الموقع

**اضافة زر مخصص:**
- يظهر قبل ازرار دمشق وحلب اذا `userLocation` موجود وليس `null`
- لا يظهر اذا المستخدم في سوريا (DAM او ALP)
- النص: "رحلات من {اسم المدينة}"
- الوصف: "رحلات مباشرة إلى دمشق وحلب"
- شارة: "مخصص لك" بلون ازرق بدلا من اخضر
- عند النقر: `navigate(/explore/DAM?dest=${userLocation})`
- يعرض ارخص سعر من/الى مدينة المستخدم (من بيانات minPrices الموجودة اصلا)

### 2. تعديل `src/pages/Index.tsx`

- تمرير `userLocation` و `userDestination?.city_ar` و `isDetecting` الى `ExploreDealsSection`

**التغيير المطلوب (سطر 330):**
```text
قبل: <ExploreDealsSection navigate={navigate} />
بعد: <ExploreDealsSection 
        navigate={navigate} 
        userLocation={userLocation} 
        userCityName={userDestination?.city_ar || null}
        isDetecting={isDetecting}
      />
```

### 3. تعديل `src/pages/Explore.tsx`

**قراءة query parameter:**
- استخدام `useSearchParams` من react-router-dom لقراءة `?dest=XXX`
- اذا وجد الـ parameter، تعيين `selectedDestination` الى قيمته عند التحميل الاول

**التغيير:** اضافة useEffect يقرا `searchParams.get('dest')` ويعيّنه كـ `selectedDestination` الابتدائي

### 4. تعديل `src/pages/Index.css`

**شارة "مخصص لك":**
- `.syria-explore-tag-personal` - نفس شكل `.syria-explore-tag` لكن بلون ازرق
- خلفية: `hsl(217 91% 95%)`
- نص: `hsl(217 91% 45%)`
- لتمييزها عن شارة "اسعار مميزة" الخضراء

### 5. تعديل `src/hooks/useFlights.ts`

**اضافة hook جديد: `useMinPriceForRoute`**
- يجلب ارخص سعر للرحلات بين مطار محدد (مثل DXB) وسوريا (DAM + ALP)
- يستخدم لعرض "ابتداء من $XX" على الزر المخصص
- Query بسيط: يبحث في جدول flights حيث origin او destination يساوي كود مطار المستخدم والطرف الاخر DAM او ALP

---

## ملخص الملفات المعدلة

| الملف | التغيير |
|-------|---------|
| `src/hooks/useFlights.ts` | اضافة hook `useMinPriceForRoute` لجلب ارخص سعر بين مدينة المستخدم وسوريا |
| `src/components/flight/ExploreDealsSection.tsx` | اضافة زر مخصص بناء على الموقع + props جديدة |
| `src/pages/Index.tsx` | تمرير بيانات الموقع الى ExploreDealsSection |
| `src/pages/Explore.tsx` | قراءة `?dest=` parameter وتفعيل الفلتر تلقائيا |
| `src/pages/Index.css` | اضافة كلاس `.syria-explore-tag-personal` للشارة الزرقاء |

