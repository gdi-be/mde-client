import type { VisibilityCondition } from "../models/form";

export function isVisible(values: Record<string, unknown> = {}, condition?: VisibilityCondition, ): boolean {
  if (!condition) return true;
  const [key, operator, value] = condition.split(' ');
  const actualValue = values[key];

  if (operator === '==') {
    return actualValue === value;
  }
  if (operator === '!=') {
    return actualValue !== value;
  }
  if (operator === undefined) {
    return !!actualValue;
  }

  throw new Error('Invalid form configuration. Operator in visibilityCondition not supported: ' + operator);

};
