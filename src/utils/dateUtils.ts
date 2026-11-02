// English month names
const EN_MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

// Bengali month names
const BN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// Bengali digits
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => BN_DIGITS[parseInt(digit, 10)]);
}

/**
 * Returns formatted date string in English uppercase e.g. "19 OCT, 2026"
 */
export function getEnglishDate(date: Date = new Date()): string {
  const day = date.getDate();
  const month = EN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

/**
 * Returns formatted date string in Bengali e.g. "২৯ অক্টোবর, ২০২৬"
 */
export function getBengaliDate(date: Date = new Date()): string {
  const dayBn = toBengaliNumber(date.getDate());
  const monthBn = BN_MONTHS[date.getMonth()];
  const yearBn = toBengaliNumber(date.getFullYear());
  return `${dayBn} ${monthBn}, ${yearBn}`;
}

/**
 * Returns YYYY-MM-DD formatted date in Asia/Dhaka timezone
 */
export function getDhakaDateKey(date: Date = new Date()): string {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return dtf.format(date); // YYYY-MM-DD
}

/**
 * Returns Bengali formatted date for today in Asia/Dhaka timezone
 */
export function getDhakaDateBengali(date: Date = new Date()): string {
  const dtfParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);

  let day = 1;
  let month = 1;
  let year = 2026;

  for (const part of dtfParts) {
    if (part.type === 'day') day = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'year') year = parseInt(part.value, 10);
  }

  const dayBn = toBengaliNumber(day);
  const monthBn = BN_MONTHS[month - 1] || BN_MONTHS[0];
  const yearBn = toBengaliNumber(year);
  return `${dayBn} ${monthBn}, ${yearBn}`;
}

