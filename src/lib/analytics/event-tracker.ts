// src/lib/analytics/event-tracker.ts
interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

interface UserProperties {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  timezone?: string;
  language?: string;
  screenResolution?: string;
  referrer?: string;
}

interface AnalyticsEvent {
  event: string;
  properties: EventProperties;
  userProperties: UserProperties;
  timestamp: string;
  page: string;
  sessionId: string;
}

class EventTracker {
  private eventQueue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userProperties: UserProperties = {};
  private isEnabled: boolean;
  private flushInterval: number = 5000; // 5 seconds
  private maxQueueSize: number = 50;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.initializeUserProperties();
    this.startFlushTimer();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeUserProperties(): void {
    if (typeof window === 'undefined') return;

    this.userProperties = {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || 'direct'
    };
  }

  private startFlushTimer(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush(true);
      });
    }
  }

  setUser(userId: string, additionalProperties?: Record<string, any>): void {
    this.userProperties = {
      ...this.userProperties,
      userId,
      ...additionalProperties
    };

    this.track('user_identified', { userId });
  }

  track(event: string, properties: EventProperties = {}): void {
    if (!this.isEnabled) {
      console.log('Analytics event (tracking disabled):', event, properties);
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      userProperties: this.userProperties,
      timestamp: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      sessionId: this.sessionId
    };

    this.eventQueue.push(analyticsEvent);

    // Flush immediately if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  page(pageName?: string, properties: EventProperties = {}): void {
    this.track('page_view', {
      page_name: pageName || (typeof window !== 'undefined' ? window.location.pathname : ''),
      ...properties
    });
  }

  private async flush(isUnloading: boolean = false): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.sendEvents(events, isUnloading);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      
      // Re-queue events if not unloading
      if (!isUnloading) {
        this.eventQueue.unshift(...events.slice(0, this.maxQueueSize - this.eventQueue.length));
      }
    }
  }

  private async sendEvents(events: AnalyticsEvent[], isUnloading: boolean = false): Promise<void> {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    
    if (!endpoint) {
      console.warn('Analytics endpoint not configured');
      return;
    }

    const payload = {
      events,
      meta: {
        app_version: process.env.NEXT_PUBLIC_APP_VERSION,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    };

    if (isUnloading && navigator.sendBeacon) {
      // Use sendBeacon for reliability during page unload
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
      return;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: isUnloading
    });

    if (!response.ok) {
      throw new Error(`Analytics service responded with ${response.status}`);
    }
  }

  // Specific tracking methods for common events
  trackProjectGeneration(templateId: string, features: string[]): void {
    this.track('project_generated', {
      template_id: templateId,
      feature_count: features.length,
      features: features.join(',')
    });
  }

  trackDeployment(platform: string, success: boolean): void {
    this.track('deployment_attempted', {
      platform,
      success
    });
  }

  trackDownload(projectName: string, fileCount: number): void {
    this.track('project_downloaded', {
      project_name: projectName,
      file_count: fileCount
    });
  }

  trackError(errorType: string, errorMessage: string): void {
    this.track('error_occurred', {
      error_type: errorType,
      error_message: errorMessage
    });
  }

  trackFeatureUsage(feature: string, action: string): void {
    this.track('feature_used', {
      feature,
      action
    });
  }

  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.track('performance_metric', {
      metric,
      value,
      unit
    });
  }
}

export const eventTracker = new EventTracker();

// Convenience functions
export const trackEvent = (event: string, properties?: EventProperties): void => {
  eventTracker.track(event, properties);
};

export const trackPage = (pageName?: string, properties?: EventProperties): void => {
  eventTracker.page(pageName, properties);
};
