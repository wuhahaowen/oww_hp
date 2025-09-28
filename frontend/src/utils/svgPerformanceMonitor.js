/**
 * SVG Performance Monitor
 * Utility to track and measure the performance of SVG loading optimizations
 */

class SvgPerformanceMonitor {
    constructor() {
        this.metrics = {
            totalRequests: 0,
            cachedRequests: 0,
            networkRequests: 0,
            loadingTime: 0,
            spriteSheetsGenerated: 0,
            errors: 0
        };
        
        this.startTime = null;
        this.isActive = false;
    }

    /**
     * Start monitoring
     */
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.startTime = performance.now();
        console.log('SVG Performance Monitoring Started');
    }

    /**
     * Stop monitoring and report results
     */
    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        const endTime = performance.now();
        this.metrics.loadingTime = endTime - this.startTime;
        
        this.report();
    }

    /**
     * Record a request
     */
    recordRequest(isCached = false) {
        if (!this.isActive) return;
        
        this.metrics.totalRequests++;
        if (isCached) {
            this.metrics.cachedRequests++;
        } else {
            this.metrics.networkRequests++;
        }
    }

    /**
     * Record a sprite sheet generation
     */
    recordSpriteGeneration() {
        if (!this.isActive) return;
        
        this.metrics.spriteSheetsGenerated++;
    }

    /**
     * Record an error
     */
    recordError() {
        if (!this.isActive) return;
        
        this.metrics.errors++;
    }

    /**
     * Report performance metrics
     */
    report() {
        if (!this.isActive) return;
        
        const cacheHitRate = this.metrics.totalRequests > 0 
            ? (this.metrics.cachedRequests / this.metrics.totalRequests * 100).toFixed(2) 
            : 0;
            
        console.group('📊 SVG Performance Report');
        console.log(`⏱️  Total Loading Time: ${this.metrics.loadingTime.toFixed(2)}ms`);
        console.log(`📡 Network Requests: ${this.metrics.networkRequests}`);
        console.log(`💾 Cached Requests: ${this.metrics.cachedRequests}`);
        console.log(`📈 Total Requests: ${this.metrics.totalRequests}`);
        console.log(`🎯 Cache Hit Rate: ${cacheHitRate}%`);
        console.log(`📄 Sprite Sheets Generated: ${this.metrics.spriteSheetsGenerated}`);
        console.log(`❌ Errors: ${this.metrics.errors}`);
        console.groupEnd();
        
        // Also log to a structured format for analytics
        this.logForAnalytics();
    }

    /**
     * Log metrics in a structured format for analytics
     */
    logForAnalytics() {
        const analyticsData = {
            timestamp: new Date().toISOString(),
            metrics: { ...this.metrics },
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        
        // In a real application, you might send this to an analytics service
        console.debug('SVG Performance Analytics:', JSON.stringify(analyticsData));
    }

    /**
     * Reset metrics
     */
    reset() {
        this.metrics = {
            totalRequests: 0,
            cachedRequests: 0,
            networkRequests: 0,
            loadingTime: 0,
            spriteSheetsGenerated: 0,
            errors: 0
        };
        this.startTime = null;
    }

    /**
     * Get current metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
}

// Export singleton instance
export default new SvgPerformanceMonitor();