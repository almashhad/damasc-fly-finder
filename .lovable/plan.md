
# دمج صورة الهيرو مع خلفية الصفحة (تأثير Google Flights)

## المشكلة الحالية
الصورة التوضيحية لها حواف واضحة وحادة - تبدو كصورة مستطيلة موضوعة فوق الصفحة. في Google Flights، الصورة تذوب وتندمج بسلاسة مع الخلفية بدون أي حدود مرئية.

## الحل: تدرجات شفافة على حواف الصورة

### التقنية المستخدمة
استخدام pseudo-elements (`::before` و `::after`) على `.syria-hero-img-wrap` لوضع تدرجات لونية (gradients) فوق حواف الصورة تتحول تدريجياً من شفاف إلى لون الخلفية.

```text
شكل التدرجات:

    ┌─────────────────────────────┐
    │▓▓▒░                     ░▒▓▓│  ← تدرج جانبي (::before)
    │▓▒░                       ░▒▓│
    │▒░          صورة           ░▒│
    │░                           ░│
    │          سوريا              │
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← تدرج سفلي (::after)
    │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    └ ← يندمج مع الخلفية البيضاء ┘
```

---

## التفاصيل التقنية

### تعديل `src/pages/Index.css`

#### 1. تعديل `.syria-hero-img-wrap` الاساسي

**اضافة `position: relative`** (موجود اصلاً) للسماح بالـ pseudo-elements.

#### 2. اضافة `::after` - تدرج سفلي (الاهم)
يذيب الحافة السفلية للصورة في الخلفية البيضاء:

```css
.syria-hero-img-wrap::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    hsla(var(--background) / 0.03) 20%,
    hsla(var(--background) / 0.15) 40%,
    hsla(var(--background) / 0.5) 65%,
    hsla(var(--background) / 0.85) 80%,
    hsl(var(--background)) 100%
  );
  pointer-events: none;
  z-index: 2;
}
```

#### 3. اضافة `::before` - تدرج جانبي
يذيب الحواف اليمنى واليسرى:

```css
.syria-hero-img-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    hsl(var(--background)) 0%,
    transparent 8%,
    transparent 92%,
    hsl(var(--background)) 100%
  );
  pointer-events: none;
  z-index: 2;
}
```

#### 4. تعديل `.syria-hero` (النص)
سحب النص لاعلى قليلاً ليتداخل مع الجزء السفلي المذاب من الصورة:

```css
.syria-hero {
  margin-top: -40px;  /* سحب النص فوق التدرج */
  position: relative;
  z-index: 3;
}
```

هذا يجعل العنوان "كل شركات الطيران..." يظهر كأنه جزء من الصورة - تماماً مثل Google Flights حيث كلمة "Flights" تتداخل مع الصورة.

#### 5. ازالة `overflow: hidden` من `.syria-hero-img-wrap`
لا حاجة لها بعد الان لان التدرجات تتكفل باخفاء الحواف. بل نبقيها لكن نضيف `margin-bottom: -20px` لتقليل الفجوة.

#### 6. تعديلات الموبايل (480px)
- تقليل `margin-top` السلبي للنص الى `-30px` لان الصورة اصغر
- تقليل ارتفاع التدرج السفلي الى `50%`

#### 7. تعديلات الشاشات الصغيرة (360px)
- تقليل `margin-top` السلبي الى `-25px`

---

## ملخص التغييرات

| العنصر | التغيير | السبب |
|--------|---------|-------|
| `.syria-hero-img-wrap::after` | تدرج سفلي جديد | اذابة الحافة السفلية |
| `.syria-hero-img-wrap::before` | تدرج جانبي جديد | اذابة الحواف الجانبية |
| `.syria-hero` | `margin-top: -40px` | تداخل النص مع الصورة |
| موبايل 480px | تعديل margin-top | تناسب مع الحجم الاصغر |
| موبايل 360px | تعديل margin-top | تناسب مع الحجم الاصغر |

## ملف واحد فقط يحتاج تعديل

| الملف | التغيير |
|-------|---------|
| `src/pages/Index.css` | اضافة pseudo-elements للتدرجات + تعديل margin النص + responsive |
