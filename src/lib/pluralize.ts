/**
 * Утилита для плюрализации русских слов
 */

/**
 * Определяет правильную форму слова для русского языка на основе числа
 * @param count - количество
 * @param forms - массив форм [единственное число, 2-4, 5+]
 * @returns правильная форма слова
 */
export function getPluralForm(
  count: number,
  forms: [string, string, string]
): string {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Исключения для чисел 11-14 (всегда множественное число)
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2]; // 5+ форма
  }

  // Правила для последней цифры
  if (lastDigit === 1) {
    return forms[0]; // единственное число
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]; // 2-4 форма
  }

  return forms[2]; // 5+ форма
}

/**
 * Возвращает правильную форму слова "день"
 * @param count - количество дней
 * @returns правильная форма: день/дня/дней
 */
export function getDaysPlural(count: number): string {
  return getPluralForm(count, ["день", "дня", "дней"]);
}

/**
 * Возвращает правильную форму слова "час"
 * @param count - количество часов
 * @returns правильная форма: час/часа/часов
 */
export function getHoursPlural(count: number): string {
  return getPluralForm(count, ["час", "часа", "часов"]);
}

/**
 * Форматирует время с правильными плюральными формами
 * @param days - количество дней
 * @param hours - количество часов
 * @returns объект с отформатированными строками
 */
export function formatTimeWithPlurals(days: number, hours: number) {
  return {
    days: getDaysPlural(days),
    hours: getHoursPlural(hours),
  };
}
