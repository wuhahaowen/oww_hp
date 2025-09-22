

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based Home Assistant dashboard panel ("hass-panel") that provides a customizable interface for managing smart home devices. It uses Craco for configuration, Ant Design as the UI component library, and integrates with Home Assistant through WebSocket connections and REST APIs.

## Development Commands

- **Start development server**: `npm start` or `craco start`
- **Production build**: `npm run build` or `craco build`  
- **Run tests**: `npm test` or `craco test`
- **Eject configuration (not recommended)**: `npm run eject`

The project uses Craco instead of standard Create React App scripts to support custom webpack configuration and proxy settings.

## Architecture

### Core Structure

- **App Component**: Main application entry with routing, authentication, and theme/language providers
- **Pages**: Home dashboard, configuration page, login page, and initialization page
- **Components**: Modular card components for different device types (lights, cameras, sensors, etc.)
- **Context Providers**: Theme management (light/dark/system) and internationalization (Chinese/English)

### Key Patterns

#### Component Architecture
Each card component follows a consistent pattern:
- Located in `src/components/[ComponentName]/` directory
- Contains `SvgIndex.js` (component logic) and `style.css` (component styles)
- Uses global configuration system for settings
- Integrates with Home Assistant entities via `@hakit/core`

#### Configuration System
- Global configuration stored via `configApi.getConfig()` and `configApi.saveConfig()`
- Component-specific configurations in `src/components/ConfigField/`
- Background and theme settings dynamically applied to document body
- Configuration versioning with rollback capability

#### Authentication Flow
- Token-based authentication with automatic refresh
- Three-phase initialization: system init check → authentication → Home Assistant connection
- Automatic redirects to login/initialization pages when needed

### State Management

- **React Context** for theme and language management
- **Local Storage** for user preference persistence
- **Zustand** available for complex state management (imported but usage varies by component)
- **Home Assistant State** managed via `@hakit/core` WebSocket connections

### API Integration

#### Home Assistant Integration
- Real-time entity state via `@hakit/core` WebSocket connections
- REST API proxy through backend `/api` endpoints
- ONVIF camera integration via go2rtc at `/go2rtc/api/onvif`

#### Backend API (in `src/utils/api.js`)
- `configApi`: User configuration management, image uploads, versioning
- `cameraApi`: ONVIF camera control (PTZ, presets, info)
- `systemApi`: System initialization, HASS configuration, logging
- `updateApi`: Application update management
- `hassApi`: Home Assistant energy statistics

### Grid Layout System

Uses `react-grid-layout` for responsive dashboard layout:
- Drag-and-drop card positioning
- Responsive breakpoints for different screen sizes
- Layout persistence through configuration system
- Cards have configurable size and position

### Theme and Internationalization

#### Theme System
- Three modes: light, dark, system (follows OS preference)
- Dynamic background image support with separate images for light/dark modes
- Ant Design theme integration with custom token configuration
- Theme variables using CSS custom properties

#### Internationalization  
- Supports Chinese (zh) and English (en)
- Nested translation keys with dot notation (`t('path.to.key')`)
- Language preference persisted in localStorage

## Development Guidelines

### Adding New Card Components

1. Create component directory in `src/components/[CardName]/`
2. Follow existing card patterns (SvgIndex.js + style.css)
3. Add configuration component in `src/components/ConfigField/`
4. Register in main component imports and card type mapping
5. Use Home Assistant entities via `@hakit/core`'s `useEntity()`

### API Integration

- Use existing API instances from `src/utils/api.js`
- Authenticated requests use `axiosInstance`, public requests use `publicAxiosInstance`
- Handle 401 responses - they trigger automatic redirect to login
- All API calls should include proper error handling

### Component Configuration

- Configuration components should export config schema and defaults
- Use Ant Design form components for consistency
- Save/load via `configApi.getConfig()` and `configApi.saveConfig()`
- Support validation and error messaging

### Responsive Design

- Use Ant Design's responsive utilities and `useMediaQuery` hooks
- Mobile-first approach with desktop enhancements
- Bottom navigation for mobile, sidebar for desktop
- Grid layout adapts automatically to screen size

## Proxy Configuration

Development proxy settings in `craco.config.js`:
- `/api` → Backend API server (localhost:5124)
- `/go2rtc/api/onvif` → Camera service (localhost:5123)
- `/config/hass-panel/upload` → File upload service (localhost:80)

## Key Dependencies

- **React 19** with React Router for navigation
- **Ant Design 5** for UI components with React 19 compatibility patch
- **@hakit/core** for Home Assistant WebSocket integration
- **react-grid-layout** for dashboard layout management
- **@iconify/react** and **@mdi/react** for icons
- **axios** for HTTP requests
- **echarts-for-react** for data visualization
- **zustand** for state management (when needed)