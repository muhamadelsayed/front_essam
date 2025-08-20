// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // إعداد مؤقت لإ更新 القيمة بعد انتهاء الـ delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // تنظيف المؤقت في كل مرة تتغير فيها القيمة أو الـ delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}