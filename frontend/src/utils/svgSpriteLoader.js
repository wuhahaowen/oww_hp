/**
 * SVG Sprite Loader
 * This utility creates sprite sheets to minimize HTTP requests for SVG icons
 */
import performanceMonitor from './svgPerformanceMonitor';

class SvgSpriteLoader {
    constructor() {
        this.spriteCache = new Map();
        this.loadingPromises = new Map();
        this.priorityCategories = new Set(['light', 'weather', 'climate']); // High priority categories
        this.lazyCategories = new Set(); // Categories to load lazily
        
        // Start performance monitoring
        performanceMonitor.start();
    }

    /**
     * Generate a sprite sheet for a category of icons
     * @param {string} category - The icon category (e.g., 'light', 'weather')
     * @param {Array} files - Array of file objects with name property
     * @param {boolean} isPriority - Whether this is a high-priority category
     * @returns {Promise<Object>} - Sprite data mapping icon names to path data
     */
    async generateSpriteSheet(category, files, isPriority = true) {
        // Check if already cached
        const cacheKey = `${category}_${files.length}`;
        if (this.spriteCache.has(cacheKey)) {
            performanceMonitor.recordRequest(true); // Cached request
            return this.spriteCache.get(cacheKey);
        }

        // For non-priority categories, we might want to lazy load
        if (!isPriority && !this.priorityCategories.has(category)) {
            // Return a promise that will load when actually needed
            return this._createLazyLoader(category, files);
        }

        // Check if already loading
        if (this.loadingPromises.has(cacheKey)) {
            return this.loadingPromises.get(cacheKey);
        }

        // Create loading promise
        const loadingPromise = this._loadSpriteSheet(category, files);
        this.loadingPromises.set(cacheKey, loadingPromise);

        try {
            const result = await loadingPromise;
            // Cache the result
            this.spriteCache.set(cacheKey, result);
            // Remove from loading promises
            this.loadingPromises.delete(cacheKey);
            return result;
        } catch (error) {
            // Remove from loading promises on error
            this.loadingPromises.delete(cacheKey);
            performanceMonitor.recordError();
            throw error;
        }
    }

    /**
     * Create a lazy loader for non-critical categories
     * @private
     */
    _createLazyLoader(category, files) {
        // Return a proxy that will load the data when accessed
        return new Proxy({}, {
            get: (target, prop) => {
                if (prop === 'then') {
                    // When someone awaits this, actually load the data
                    return (resolve, reject) => {
                        this._loadSpriteSheet(category, files)
                            .then(resolve)
                            .catch(reject);
                    };
                }
                // For other properties, we could implement lazy getters
                return undefined;
            }
        });
    }

    /**
     * Load sprite sheet data
     * @private
     */
    async _loadSpriteSheet(category, files) {
        try {
            console.log(`Loading sprite sheet for category: ${category} (${files.length} icons)`);
            performanceMonitor.recordSpriteGeneration();
            
            // Limit concurrent requests to avoid overwhelming the server
            const concurrencyLimit = 6;
            const results = {};

            // Process files in batches
            for (let i = 0; i < files.length; i += concurrencyLimit) {
                const batch = files.slice(i, i + concurrencyLimit);
                const batchPromises = batch.map(async (file) => {
                    const iconName = this._generateIconName(file.name);
                    const svgPath = `${process.env.PUBLIC_URL}/${category}/${file.name}`;

                    try {
                        const pathData = await this._fetchSvgPathData(svgPath);
                        performanceMonitor.recordRequest(false); // Network request
                        return { iconName, pathData };
                    } catch (error) {
                        console.error(`Error loading SVG ${svgPath}:`, error);
                        performanceMonitor.recordError();
                        return { iconName, pathData: [{ d: '', fill: 'currentColor' }] };
                    }
                });

                // Wait for batch to complete
                const batchResults = await Promise.all(batchPromises);
                
                // Add results to overall collection
                batchResults.forEach(result => {
                    if (result) {
                        results[result.iconName] = result.pathData;
                    }
                });
            }

            console.log(`Completed loading sprite sheet for category: ${category}`);
            return results;
        } catch (error) {
            console.error(`Error generating sprite sheet for ${category}:`, error);
            performanceMonitor.recordError();
            throw error;
        }
    }

    /**
     * Fetch SVG path data
     * @private
     */
    async _fetchSvgPathData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // Check for parsing errors
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('SVG parsing error: ' + parserError.textContent);
        }

        // Extract path data
        const paths = Array.from(svgDoc.querySelectorAll('path'));
        if (paths.length === 0) {
            return [{ d: '', fill: 'currentColor' }];
        }

        return paths.map(path => ({
            d: path.getAttribute('d') || '',
            fill: path.getAttribute('fill') || 'currentColor',
            stroke: path.getAttribute('stroke') || 'none',
            strokeWidth: path.getAttribute('stroke-width') || '0',
            id: path.id || ''
        }));
    }

    /**
     * Generate icon name from file name
     * @private
     */
    _generateIconName(fileName) {
        return fileName.includes('.')
            ? fileName.substring(0, fileName.lastIndexOf('.'))
            : fileName;
    }

    /**
     * Set priority categories
     */
    setPriorityCategories(categories) {
        this.priorityCategories = new Set(categories);
    }

    /**
     * Set lazy categories
     */
    setLazyCategories(categories) {
        this.lazyCategories = new Set(categories);
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.spriteCache.clear();
        this.loadingPromises.clear();
    }

    /**
     * Preload priority categories
     */
    async preloadPriorityCategories(iconConfig) {
        const priorityConfigs = iconConfig.filter(item => 
            this.priorityCategories.has(item.path)
        );

        const promises = priorityConfigs.map(item => 
            this.generateSpriteSheet(item.path, item.files, true)
        );

        return Promise.all(promises);
    }
    
    /**
     * Report performance metrics
     */
    reportPerformance() {
        performanceMonitor.stop();
    }
}

// Export singleton instance
export default new SvgSpriteLoader();