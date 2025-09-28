/**
 * Simple SVG Sprite Generator
 * This script generates SVG sprites without external dependencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public/sprites');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Hardcoded icon configuration based on what we know about the project
const iconConfig = [
    {
        path: 'light',
        files: [
            { name: 'track-light.svg' },
            { name: 'ceiling-light.svg' },
            { name: 'chandelier.svg' },
            { name: 'coach-lamp.svg' },
            { name: 'desk-lamp.svg' },
            { name: 'floor-lamp.svg' },
            { name: 'lamp.svg' },
            { name: 'lightbulb.svg' },
            { name: 'outdoor-lamp.svg' },
            { name: 'spotlight.svg' },
            { name: 'wall-sconce.svg' }
        ]
    },
    {
        path: 'weather',
        files: [
            { name: 'mdiWeatherCloudy.svg' },
            { name: 'mdiWeatherSunny.svg' },
            { name: 'mdiWeatherNight.svg' },
            { name: 'mdiWeatherFog.svg' },
            { name: 'mdiWeatherLightning.svg' },
            { name: 'mdiWeatherWindy.svg' }
        ]
    },
    {
        path: 'climate',
        files: [
            { name: 'mdiLeaf.svg' },
            { name: 'mdiSnowflake.svg' },
            { name: 'mdiThermometer.svg' },
            { name: 'mdiAirConditioner.svg' },
            { name: 'mdiHeatingCoil.svg' },
            { name: 'mdiWaterPercent.svg' }
        ]
    }
];

console.log('Generating SVG sprites...');

/**
 * Extract paths from SVG content using regex (simpler approach)
 */
function extractSvgPaths(svgContent) {
    // Extract viewBox
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']*)["']/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    
    // Extract all path elements
    const pathRegex = /<path\s+([^>]+)\/?>/g;
    const paths = [];
    let match;
    
    while ((match = pathRegex.exec(svgContent)) !== null) {
        const attrsString = match[1];
        const attrs = {};
        
        // Extract attributes
        const attrRegex = /(\w+)=(["'])([^"']+)\2/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
            attrs[attrMatch[1]] = attrMatch[3];
        }
        
        paths.push(attrs);
    }
    
    return { viewBox, paths };
}

/**
 * Generate SVG symbol sprite for a category
 */
async function generateSymbolSprite(category, files) {
    console.log(`Generating symbol sprite for ${category} with ${files.length} icons...`);
    
    const symbols = [];
    const metadata = {
        generated: new Date().toISOString(),
        category: category,
        iconCount: files.length,
        icons: {}
    };
    
    // Process each file
    for (const file of files) {
        const fileName = file.name;
        const iconName = fileName.includes('.') 
            ? fileName.substring(0, fileName.lastIndexOf('.')) 
            : fileName;
            
        const filePath = path.join(PUBLIC_DIR, category, fileName);
        
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filePath}`);
                continue;
            }
            
            // Read SVG file
            const svgContent = fs.readFileSync(filePath, 'utf8');
            
            // Extract paths and viewBox
            const { viewBox, paths } = extractSvgPaths(svgContent);
            
            if (paths.length === 0) {
                console.warn(`No paths found in SVG: ${filePath}`);
                continue;
            }
            
            // Create symbol element
            const symbolAttrs = {
                id: iconName,
                viewBox: viewBox
            };
            
            const symbolAttrsString = Object.entries(symbolAttrs)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            
            const symbolContent = [`<symbol ${symbolAttrsString}>`];
            
            // Add all paths
            paths.forEach(pathAttrs => {
                const attrsString = Object.entries(pathAttrs)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ');
                symbolContent.push(`<path ${attrsString}/>`);
            });
            
            symbolContent.push('</symbol>');
            symbols.push(symbolContent.join(''));
            
            // Add to metadata
            metadata.icons[iconName] = {
                fileName: fileName,
                pathCount: paths.length
            };
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
        }
    }
    
    // Create complete SVG sprite
    const spriteContent = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        '<defs>',
        ...symbols,
        '</defs>',
        '</svg>'
    ].join('\n');
    
    // Write sprite file
    const spritePath = path.join(OUTPUT_DIR, `${category}-symbols.svg`);
    fs.writeFileSync(spritePath, spriteContent);
    
    // Write metadata
    const metadataPath = path.join(OUTPUT_DIR, `${category}-metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log(`Generated symbol sprite for ${category}: ${spritePath}`);
    return { spritePath, metadataPath };
}

/**
 * Generate inline SVG data for direct embedding
 */
async function generateInlineData(category, files) {
    console.log(`Generating inline data for ${category}...`);
    
    const inlineData = {};
    
    // Process each file
    for (const file of files) {
        const fileName = file.name;
        const iconName = fileName.includes('.') 
            ? fileName.substring(0, fileName.lastIndexOf('.')) 
            : fileName;
            
        const filePath = path.join(PUBLIC_DIR, category, fileName);
        
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filePath}`);
                continue;
            }
            
            // Read SVG file
            const svgContent = fs.readFileSync(filePath, 'utf8');
            
            // Extract paths and viewBox
            const { viewBox, paths } = extractSvgPaths(svgContent);
            
            if (paths.length === 0) {
                console.warn(`No paths found in SVG: ${filePath}`);
                continue;
            }
            
            inlineData[iconName] = {
                viewBox: viewBox,
                paths: paths
            };
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
        }
    }
    
    // Write inline data
    const dataPath = path.join(OUTPUT_DIR, `${category}-inline.json`);
    fs.writeFileSync(dataPath, JSON.stringify(inlineData, null, 2));
    
    console.log(`Generated inline data for ${category}: ${dataPath}`);
    return dataPath;
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('Starting SVG sprite generation...');
        console.log('Found icon config with', iconConfig.length, 'categories');
        
        const results = [];
        
        // Process each category
        for (const category of iconConfig) {
            console.log(`\nProcessing category: ${category.path}`);
            
            // Generate symbol sprite
            const spriteResult = await generateSymbolSprite(category.path, category.files);
            results.push(spriteResult);
            
            // Generate inline data
            const dataPath = await generateInlineData(category.path, category.files);
            results.push({ dataPath });
        }
        
        // Generate manifest
        const manifest = {
            generated: new Date().toISOString(),
            categories: iconConfig.map(cat => cat.path),
            files: results
        };
        
        const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        console.log('\nSVG sprite generation completed!');
        console.log(`Manifest: ${manifestPath}`);
    } catch (error) {
        console.error('Error generating SVG sprites:', error);
        process.exit(1);
    }
}

// Run the script
main();