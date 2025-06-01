// src/lib/analytics/error-tracker.ts
interface ErrorContext {
  errorId?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  url?: string;
  userAgent?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  name: string;
  context: ErrorContext;
  timestamp: string;
  fingerprint: string;
}

class ErrorTracker {
  private errorQueue: ErrorReport[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(error: Error, context: ErrorContext): string {
    const components = [
      error.name,
      error.message,
      context.componentStack?.split('\n')[0] || '',
      window.location.pathname
    ];
    return btoa(components.join('|')).substr(0, 16);
  }

  private setupGlobalErrorHandlers(): void {
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(new Error(event.reason), {
        severity: 'high',
        tags: { type: 'unhandled_promise_rejection' }
      });
    });

    // Capture global errors
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), {
        severity: 'high',
        tags: { 
          type: 'global_error',
          filename: event.filename,
          lineno: event.lineno?.toString(),
          colno: event.colno?.toString()
        }
      });
    });
  }

  setUser(userId: string): void {
    this.userId = userId;
  }

  reportError(error: Error, context: ErrorContext = {}): string {
    if (!this.isEnabled) {
      console.error('Error (tracking disabled):', error, context);
      return '';
    }

    const errorId = context.errorId || `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      fingerprint: this.generateFingerprint(error, context),
      context: {
        ...context,
        errorId,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: context.timestamp || new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: context.severity || 'medium'
      }
    };

    this.errorQueue.push(errorReport);
    this.flushErrors();

    return errorId;
  }

  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Send to your error tracking service (e.g., Sentry, LogRocket, etc.)
      await this.sendToErrorService(errors);
    } catch (sendError) {
      console.error('Failed to send errors to tracking service:', sendError);
      // Re-queue the errors for retry
      this.errorQueue.unshift(...errors);
    }
  }

  private async sendToErrorService(errors: ErrorReport[]): Promise<void> {
    // Replace with your actual error tracking service endpoint
    const endpoint = process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT;
    
    if (!endpoint) {
      console.warn('Error tracking endpoint not configured');
      return;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errors,
        meta: {
          app_version: process.env.NEXT_PUBLIC_APP_VERSION,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error tracking service responded with ${response.status}`);
    }
  }

  setContext(context: Partial<ErrorContext>): void {
    // Store context for future error reports
    this.globalContext = { ...this.globalContext, ...context };
  }

  private globalContext: Partial<ErrorContext> = {};
}

export const errorTracker = new ErrorTracker();

// Convenience function for reporting errors
export const reportError = (error: Error, context?: ErrorContext): string => {
  return errorTracker.reportError(error, context);
};
