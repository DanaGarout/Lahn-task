// simple debounce, no need to pull in lodash for one function
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs = 350,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delayMs)
  }
}