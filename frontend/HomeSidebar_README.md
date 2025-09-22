# HomeSidebar Component

## Overview

The `HomeSidebar` component is a modern, glassmorphism-style sidebar designed for home automation control panels. It provides an elegant interface for displaying time, weather information, and quick controls for smart home devices.

## Features

- **Modern Glassmorphism Design**: Translucent background with blur effects
- **Time & Weather Display**: Real-time time, date, temperature, and humidity
- **Quick Device Controls**: Toggle switches for lights, air conditioning, and curtains
- **Navigation Buttons**: Easy access to overview and control panel views
- **Responsive Design**: Adapts to different screen sizes
- **Theme Support**: Works with light and dark themes
- **Internationalization**: Supports multiple languages

## Installation

The component is already integrated into the project structure. Make sure you have the following dependencies:

```bash
npm install @hakit/core react-router-dom dayjs lunar-javascript
```

## Basic Usage

```jsx
import React from 'react';
import { HomeSidebar } from '../components';
import dayjs from 'dayjs';

function MyComponent() {
  const currentTime = dayjs();
  
  const timeCardConfig = {
    timeFormat: 'HH:mm',
    dateFormat: 'YYYY-MM-DD'
  };
  
  const allLights = [
    { id: 'light1', state: 'on' },
    { id: 'light2', state: 'off' },
    // ... more lights
  ];

  const handleNavigateToOverview = () => {
    console.log('Navigate to overview');
  };

  const handleNavigateToControl = () => {
    console.log('Navigate to control panel');
  };

  return (
    <div>
      <HomeSidebar
        currentTime={currentTime}
        timeCardConfig={timeCardConfig}
        allLights={allLights}
        onNavigateToOverview={handleNavigateToOverview}
        onNavigateToControl={handleNavigateToControl}
        activeButton="全屋总览"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentTime` | dayjs object | Yes | Current time object for display |
| `timeCardConfig` | Object | Yes | Configuration for time formatting |
| `allLights` | Array | Yes | Array of light entities for status display |
| `onNavigateToOverview` | Function | Yes | Callback for overview navigation |
| `onNavigateToControl` | Function | Yes | Callback for control panel navigation |
| `activeButton` | String | No | Currently active button ("全屋总览" or "控制面板") |

### timeCardConfig Structure

```javascript
{
  timeFormat: 'HH:mm',      // Time display format
  dateFormat: 'YYYY-MM-DD'  // Date display format
}
```

### allLights Structure

```javascript
[
  {
    id: 'light_entity_id',
    state: 'on' | 'off',
    // ... other light properties
  }
]
```

## Home Page Integration

The component is already integrated into the home page at `src/pages/home/SvgIndex.js`. It replaces the previous sidebar implementation with the modern design shown in the reference image.

### Integration Example

```jsx
// In home page component
<HomeSidebar 
  currentTime={currentTime}
  timeCardConfig={timeCardConfig}
  allLights={allLights}
  onNavigateToOverview={() => handleClick('homeOverview')}
  onNavigateToControl={() => setActives("控制面板")}
  activeButton={actives}
/>
```

## Styling

The component uses CSS custom properties for theming and includes:

- Glassmorphism effects with `backdrop-filter`
- Responsive design with media queries
- Theme-aware styling for light/dark modes
- Smooth animations and transitions

### Key CSS Classes

- `.home-sidebar` - Main container
- `.sidebar-header` - Header section with logo and title
- `.time-weather-section` - Time and weather display area
- `.control-sections` - Device control area
- `.bottom-navigation` - Navigation buttons

## Customization

### Theme Customization

The component automatically adapts to your theme context. You can customize colors by modifying CSS custom properties:

```css
:root {
  --color-primary: #your-color;
  --color-background: #your-background;
  /* ... other custom properties */}
```

### Adding New Control Sections

To add new device control sections, modify the `control-sections` area in the component:

```jsx
// Add new control section
<div className="control-section">
  <div className="section-header">
    <span className="section-title">新设备</span>
    <div className="section-icon">
      {/* Your icon */}
    </div>
  </div>
  <div className="section-content">
    {/* Your controls */}
  </div>
</div>
```

## Dependencies

- **@hakit/core**: For Home Assistant integration and weather data
- **react-router-dom**: For navigation functionality
- **dayjs**: For time formatting and manipulation
- **lunar-javascript**: For lunar calendar calculations

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Fallback styles for older browsers
- Mobile-first responsive design

## Performance Considerations

- Component uses React hooks efficiently
- CSS animations use transform properties for performance
- Responsive images with optimized loading
- Minimal re-renders through proper prop handling

## Troubleshooting

### Common Issues

1. **Weather data not loading**: Ensure `@hakit/core` is properly configured
2. **Time not updating**: Verify `currentTime` prop is being updated
3. **Styling issues**: Check CSS custom properties and theme context
4. **Navigation not working**: Verify callback functions are provided

### Debug Mode

Enable debug mode by adding console logs to callback functions:

```jsx
const handleNavigateToOverview = () => {
  console.log('Overview navigation triggered');
  // Your navigation logic
};
```

## Future Enhancements

Potential improvements for the component:

- Add drag-and-drop reordering for control sections
- Implement custom device type support
- Add animation presets for different themes
- Support for custom icon sets
- Voice control integration
- Advanced weather forecast display

## Contributing

When modifying the component:

1. Follow the existing code style and structure
2. Update this documentation for any new features
3. Test with both light and dark themes
4. Ensure responsive design works on all screen sizes
5. Validate with Home Assistant data structures