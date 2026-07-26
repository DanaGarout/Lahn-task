// turns raw HTTP status codes into messages a user can actually read

const STATUS_MESSAGES: Record<number, string> = {
  400: 'That request could not be processed. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: "You don't have permission to do that.",
  404: 'The item you were looking for could not be found.',
  409: 'This action conflicts with existing data. Please refresh and try again.',
  413: 'The file you uploaded is too large.',
  415: 'That file type is not supported.',
  422: 'Please fix the highlighted fields and try again.',
  429: 'Too many requests — please slow down and try again shortly.',
  500: 'Something went wrong on the server. Please try again in a moment.',
  502: 'The server is temporarily unavailable. Please try again shortly.',
  503: 'The server is temporarily unavailable. Please try again shortly.',
}

export function getFriendlyStatusMessage(status?: number): string {
  if (!status) return 'Unable to reach the server. Please check your internet connection and try again.'
  return STATUS_MESSAGES[status] ?? 'An unexpected error occurred. Please try again.'
}

export const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Please check your internet connection and try again.'

export const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.'