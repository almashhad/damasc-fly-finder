
# تحسين الهيدر - إضافة طائرة متحركة وعبارة احترافية

## الفكرة
تحويل منطقة الشعار والهيدر من شكل بسيط إلى تصميم احترافي ومميز يتضمن:

1. **طائرة SVG متحركة** تطير عبر الهيدر بمسار منحني مع خط متقطع خلفها (flight trail)
2. **تأثير نبض مضيء** حول أيقونة الشعار (pulsing glow ring)
3. **عبارة قوية** تحت اسم "رحلات سوريا" مثل: "بوابتك الجوية" بحجم صغير
4. **استبدال emoji** بأيقونة SVG احترافية مع حركة طفيفة (float)

### الشكل المقترح للهيدر

```text
    ╔════════════════════════════════════════╗
    ║  [✈ متحرك]  رحلات سوريا              ║
    ║              بوابتك الجوية             ║
    ║         ✈------>  (طائرة عابرة)        ║
    ║  ═══════════════════════════════════   ║
    ║  [ من وإلى دمشق ]  [ من وإلى حلب ]   ║
    ╚════════════════════════════════════════╝
```

---

## التفاصيل التقنية

### 1. تعديل `src/pages/Index.tsx`

**تغييرات في منطقة الشعار (سطر 130-135):**

- استبدال `✈` emoji بأيقونة SVG مخصصة للطائرة داخل `.syria-logo-mark`
- اضافة عنصر `<span className="syria-logo-sub">بوابتك الجوية</span>` تحت اسم "رحلات سوريا"
- لف اسم الشعار والعبارة في div عمودي

**اضافة طائرة متحركة عابرة:**
- اضافة عنصر `<div className="syria-fly-plane">` داخل `.syria-hdr-in` (قبل الاغلاق)
- يحتوي على SVG صغير لطائرة بخط متقطع خلفها
- يطير من اليمين إلى اليسار كل 8 ثوانٍ (مناسب لـ RTL)

### 2. تعديل `src/pages/Index.css`

**أيقونة الشعار المحسنة:**

| الكلاس | الوصف |
|--------|-------|
| `.syria-logo-mark` | اضافة `animation: syria-logo-float 3s ease-in-out infinite` للحركة الطافية + `position: relative` |
| `.syria-logo-mark::after` | حلقة نبض مضيئة (pulsing ring) - `border-radius: 14px`, `border: 2px solid hsla(var(--primary) / .3)`, `animation: syria-logo-pulse 2.5s ease infinite` |
| `.syria-logo-name-wrap` | wrapper جديد بـ `display: flex; flex-direction: column` |
| `.syria-logo-sub` | عبارة "بوابتك الجوية" - `font-size: 10px`, `color: hsl(var(--muted-foreground))`, `font-weight: 500`, `letter-spacing: 0.5px`, `margin-top: -2px` |

**الطائرة العابرة:**

| الكلاس | الوصف |
|--------|-------|
| `.syria-fly-plane` | `position: absolute`, `top: 50%`, `pointer-events: none`, `animation: syria-fly 12s linear infinite` |
| `.syria-fly-trail` | خط متقطع خلف الطائرة - `stroke-dasharray: 4 6`, `stroke: hsla(var(--primary) / .15)`, `width: 60px` |

**Keyframes جديدة:**

```text
@keyframes syria-logo-float
  0%, 100%: translateY(0)
  50%: translateY(-2px)

@keyframes syria-logo-pulse
  0%, 100%: opacity 0, scale 1
  50%: opacity 1, scale 1.15

@keyframes syria-fly
  0%: translateX(100%) - بداية من خارج الشاشة يمين
  100%: translateX(-200%) - خروج من يسار الشاشة
```

**ملاحظات على الحركة:**
- الطائرة العابرة شفافة جزئياً (`opacity: 0.2`) لتكون خلفية وليست مشتتة
- تأخير بداية الحركة 3 ثوانٍ بعد تحميل الصفحة (`animation-delay: 3s`)
- على الموبايل: تصغير حجم الطائرة العابرة وتسريع الحركة قليلاً

**تعديلات responsive (480px):**
- `.syria-logo-sub`: `font-size: 9px`
- `.syria-fly-plane svg`: `width: 16px; height: 16px` (بدل 20px)

**تعديلات responsive (360px):**
- `.syria-logo-sub`: `font-size: 8px`
- اخفاء الطائرة العابرة على الشاشات الاصغر من 360px لتجنب التشتيت

---

## ملخص الملفات المعدلة

| الملف | التغيير |
|-------|---------|
| `src/pages/Index.tsx` | استبدال emoji بـ SVG + اضافة عبارة "بوابتك الجوية" + طائرة متحركة عابرة |
| `src/pages/Index.css` | keyframes للطفو والنبض والطيران + كلاسات جديدة + responsive |
