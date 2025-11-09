/**
 * Error handling utilities with graceful degradation
 * Provides error handling patterns for analysis scripts
 */

export interface AnalysisError {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
}

/**
 * Create an analysis error
 * @internal
 */
function createError(
  message: string,
  options: {
    code?: string;
    context?: Record<string, unknown>;
    recoverable?: boolean;
  } = {}
): AnalysisError {
  return {
    message,
    code: options.code,
    context: options.context,
    recoverable: options.recoverable ?? true,
  };
}

/**
 * Handle errors with graceful degradation
 * Returns error information instead of throwing
 */
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): AnalysisError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as NodeJS.ErrnoException).code,
      context,
      recoverable: true,
    };
  }
  
  return {
    message: String(error),
    context,
    recoverable: true,
  };
}

/**
 * Check if error is recoverable
 * @internal
 */
function isRecoverable(error: AnalysisError): boolean {
  return error.recoverable;
}

/**
 * Format error for logging
 * @internal
 */
function formatError(error: AnalysisError): string {
  let message = `Error: ${error.message}`;
  
  if (error.code) {
    message += ` (${error.code})`;
  }
  
  if (error.context) {
    message += `\nContext: ${JSON.stringify(error.context, null, 2)}`;
  }
  
  return message;
}

/**
 * Result type for operations that may fail
 */
export type Result<T, E = AnalysisError> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Wrap async operation with error handling
 */
export async function safeExecute<T>(
  operation: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, context),
    };
  }
}

/**
 * Continue execution even if some operations fail
 * Collects all errors and returns successful results
 */
export async function gracefulExecute<T>(
  operations: Array<() => Promise<T>>,
  context?: Record<string, unknown>
): Promise<{
  results: T[];
  errors: AnalysisError[];
}> {
  const results: T[] = [];
  const errors: AnalysisError[] = [];
  
  for (const operation of operations) {
    const result = await safeExecute(operation, context);
    if (result.success) {
      results.push(result.data);
    } else {
      errors.push(result.error);
    }
  }
  
  return { results, errors };
}

