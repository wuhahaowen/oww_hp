/**
 * SVG Sprite Manager
 * Utility to manage pre-generated SVG sprites and inline data
 */

class SvgSpriteManager {
    constructor() {
        this.spriteCache = new Map();
        this.inlineDataCache = new Map();
        this.loadedSprites = new Set();
        this.baseUrl = `${process.env.PUBLIC_URL}/sprites`;
    }

    /**
     * Load a pre-generated SVG sprite
     */
    async loadSprite(category) {
        // Check if already loaded
        if (this.loadedSprites.has(category)) {
            return this.spriteCache.get(category);
        }

        try {
           
            // Load sprite
            const spriteUrl = `${this.baseUrl}/${category}-symbols.svg`;
            const response = await fetch(spriteUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to load sprite: ${response.status}`);
            }
            
            const spriteContent = await response.text();
            
            // Load metadata
            const metadataUrl = `${this.baseUrl}/${category}-metadata.json`;
            const metadataResponse = await fetch(metadataUrl);
            const metadata = metadataResponse.ok ? await metadataResponse.json() : {};
            
            // Store in cache
            const spriteData = {
                content: spriteContent,
                metadata: metadata
            };
            
            this.spriteCache.set(category, spriteData);
            this.loadedSprites.add(category);
            
            return spriteData;
        } catch (error) {
            console.error(`Error loading sprite for ${category}:`, error);
            throw error;
        }
    }

    /**
     * Load pre-generated inline data
     */
    async loadInlineData(category) {
        // Check if already loaded
        if (this.inlineDataCache.has(category)) {
            return this.inlineDataCache.get(category);
        }

        try {
            // Load inline data
            const dataUrl = `${this.baseUrl}/${category}-inline.json`;
            const response = await fetch(dataUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to load inline data: ${response.status}`);
            }
            
            const inlineData = await response.json();
            
            // Store in cache
            this.inlineDataCache.set(category, inlineData);
            
            return inlineData;
        } catch (error) {
            console.error(`Error loading inline data for ${category}:`, error);
            throw error;
        }
    }

    /**
     * Get icon data from inline data
     */
    getIconData(category, iconName) {
        if (!this.inlineDataCache.has(category)) {
            return null;
        }
        
        const categoryData = this.inlineDataCache.get(category);
        return categoryData[iconName] || null;
    }

    /**
     * Generate icon body from path data
     */
    generateIconBody(pathData) {
        if (!pathData || !Array.isArray(pathData.paths)) {
            return '';
        }
        
        return pathData.paths.map(path => {
            const attrs = Object.entries(path)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            return `<path ${attrs}/>`;
        }).join('');
    }

    /**
     * Preload all sprites and inline data
     */
    async preloadAll(categories) {
        console.log('Preloading all SVG sprites and data...');
        
        const loadPromises = [];
        
        for (const category of categories) {
            // Load sprite
            loadPromises.push(
                this.loadSprite(category)
                    .catch(error => {
                        console.warn(`Failed to preload sprite for ${category}:`, error);
                        return null;
                    })
            );
            
            // Load inline data
            loadPromises.push(
                this.loadInlineData(category)
                    .catch(error => {
                        console.warn(`Failed to preload inline data for ${category}:`, error);
                        return null;
                    })
            );
        }
        
        await Promise.all(loadPromises);
        console.log('Completed preloading SVG assets');
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.spriteCache.clear();
        this.inlineDataCache.clear();
        this.loadedSprites.clear();
    }

    /**
     * Check if a category is loaded
     */
    isCategoryLoaded(category) {
        return this.loadedSprites.has(category) && this.inlineDataCache.has(category);
    }
}

// Export singleton instance
export default new SvgSpriteManager();