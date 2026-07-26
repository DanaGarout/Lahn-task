// shape every API error gets normalized into, so components don't care
// whether it was a network error, a 401, or a validation error

export type ValidationErrors = Record<string, string[]>

export interface NormalizedApiError {
  message: string
  status?: number
  fieldErrors?: ValidationErrors // only set on 422s
  isNetworkError?: boolean
}