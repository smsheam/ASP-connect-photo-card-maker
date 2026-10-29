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
