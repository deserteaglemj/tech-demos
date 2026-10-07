/**
 * Evaluates a ReUI `FilterQuery` tree against plain records.
 *
 * The `Filters` component only manages the query tree - it never touches
 * the consumer's data - so this is the predicate half of the contract,
 * covering the operators the ticket schema (text/select/multiselect) uses.
 */
import type {
  FilterGroupNode,
  FilterNode,
  FilterQuery,
  FilterRule,
} from "@/components/reui/filters/filters-types"

function toArray(value: unknown): unknown[] {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase()
}

function isEmptyValue(raw: unknown): boolean {
  if (raw === undefined || raw === null || raw === "") return true
  if (Array.isArray(raw)) return raw.length === 0
  return false
}

function evaluateOperator(
  operator: string,
  raw: unknown,
  filterValues: unknown[]
): boolean {
  switch (operator) {
    case "contains":
      return filterValues.some((v) => normalize(raw).includes(normalize(v)))
    case "not_contains":
      return !filterValues.some((v) => normalize(raw).includes(normalize(v)))
    case "starts_with":
      return filterValues.some((v) => normalize(raw).startsWith(normalize(v)))
    case "ends_with":
      return filterValues.some((v) => normalize(raw).endsWith(normalize(v)))
    case "is":
      return filterValues.some((v) => normalize(v) === normalize(raw))
    case "is_not":
      return !filterValues.some((v) => normalize(v) === normalize(raw))
    case "is_any_of":
      return filterValues.some((v) => normalize(v) === normalize(raw))
    case "is_none_of":
      return !filterValues.some((v) => normalize(v) === normalize(raw))
    case "has_any_of": {
      const rawArr = toArray(raw).map(normalize)
      return filterValues.some((v) => rawArr.includes(normalize(v)))
    }
    case "has_all_of": {
      const rawArr = toArray(raw).map(normalize)
      return filterValues.every((v) => rawArr.includes(normalize(v)))
    }
    case "has_none_of": {
      const rawArr = toArray(raw).map(normalize)
      return !filterValues.some((v) => rawArr.includes(normalize(v)))
    }
    case "empty":
      return isEmptyValue(raw)
    case "not_empty":
      return !isEmptyValue(raw)
    default:
      // Unknown / not-yet-implemented operator: fail open so a mid-edit
      // rule never silently drops every row.
      return true
  }
}

function evaluateRule<TData>(
  rule: FilterRule,
  getValue: (record: TData, path: string[]) => unknown,
  record: TData
): boolean {
  if (!rule.operator) return true
  const raw = getValue(record, rule.path)
  const filterValues = toArray(rule.value)
  let result = evaluateOperator(rule.operator, raw, filterValues)
  if (rule.negated) result = !result
  return result
}

function evaluateNode<TData>(
  node: FilterNode,
  getValue: (record: TData, path: string[]) => unknown,
  record: TData
): boolean {
  if (node.type === "rule") return evaluateRule(node, getValue, record)
  return evaluateGroup(node, getValue, record)
}

function evaluateGroup<TData>(
  group: FilterGroupNode,
  getValue: (record: TData, path: string[]) => unknown,
  record: TData
): boolean {
  if (group.rules.length === 0) return true
  if (group.combinator === "and") {
    return group.rules.every((child) => evaluateNode(child, getValue, record))
  }
  return group.rules.some((child) => evaluateNode(child, getValue, record))
}

/**
 * Filters `records` down to the ones matching `query`. `getValue` resolves a
 * rule's field path to the raw value on a record, so the evaluator stays
 * schema-agnostic.
 */
export function filterRecordsByQuery<TData>(
  records: TData[],
  query: FilterQuery,
  getValue: (record: TData, path: string[]) => unknown
): TData[] {
  return records.filter((record) => evaluateGroup(query, getValue, record))
}
