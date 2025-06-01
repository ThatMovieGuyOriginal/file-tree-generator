// src/lib/performance/performance-monitor.ts
import { trackEvent } from '@/lib/analytics/event-tracker';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
              this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'ms');
              this.recordMetric('first_contentful_paint', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
            }
          });
        });
        
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation performance observer not supported:', error);
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largest_contentful_paint', lastEntry.startTime, 'ms');
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP performance observer not supported:', error);
      }

      // Observe cumulative layout shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          this.recordMetric('cumulative_layout_shift', clsValue, 'score');
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS performance observer not supported:', error);
      }
    }
  }

  recordMetric(name: string, value: number, unit: string = 'ms', context?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      context
    };

    this.metrics.push(metric);
    
    // Track performance metric in analytics
    trackEvent('performance_metric', {
      metric_name: name,
      metric_value: value,
      metric_unit: unit,
      ...context
    });

    // Log performance warnings
    this.checkPerformanceThresholds(metric);
  }

  private checkPerformanceThresholds(metric: PerformanceMetric): void {
    const thresholds: Record<string, number> = {
      'page_load_time': 3000, // 3 seconds
      'project_generation_time': 5000, // 5 seconds
      'file_parsing_time': 1000, // 1 second
      'template_processing_time': 2000, // 2 seconds
      'largest_contentful_paint': 2500, // 2.5 seconds
      'cumulative_layout_shift': 0.1 // CLS score
    };

    const threshold = thresholds[metric.name];
    if (threshold && metric.value > threshold) {
      console.warn(`Performance warning: ${metric.name} (${metric.value}${metric.unit}) exceeds threshold (${threshold}${metric.unit})`);
      
      trackEvent('performance_warning', {
        metric_name: metric.name,
        metric_value: metric.value,
        threshold_value: threshold,
        exceeded_by: metric.value - threshold
      });
    }
  }

  startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(name, duration);
      return duration;
    };
  }

  measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    const stopTimer = this.startTimer(name);
    
    return asyncFn().finally(() => {
      stopTimer();
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const measureTime = (name: string): (() => number) => {
  return performanceMonitor.startTimer(name);
};

export const measureAsync = <T>(name: string, asyncFn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.measureAsync(name, asyncFn);
};
