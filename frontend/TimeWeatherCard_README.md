# TimeWeatherCard Documentation

## Overview
The TimeWeatherCard is a compact component that combines time display and weather information in a single card, similar to the design shown in the reference image. It provides a clean, modern interface for displaying current time, date, and weather conditions.

## Features

### Time Display
- Customizable time format (12/24 hour)
- Configurable date format
- Optional lunar calendar display (Chinese calendar)
- Real-time updates

### Weather Integration
- Home Assistant weather entity integration
- Temperature display with weather icons
- Optional humidity display
- Weather condition text
- Additional weather information (feels like temperature, wind speed)

### Layout Options
- **Vertical Layout**: Traditional stacked layout (default)
- **Horizontal Layout**: Time and weather side by side
- **Compact Layout**: Minimal space usage

## Configuration

### Basic Configuration
```javascript
{
  title: "时间天气",
  titleVisible: true,
  timeFormat: "HH:mm",
  dateFormat: "YYYY-MM-DD ddd",
  showLunar: true,
  weather_entity_id: "weather.home",
  layout: "vertical"
}
```

### Advanced Configuration
```javascript
{
  title: "Time & Weather",
  titleVisible: true,
  timeFormat: "hh:mm A",
  dateFormat: "MMM DD, YYYY",
  showLunar: false,
  weather_entity_id: "weather.forecast_home",
  weatherIconSize: 1.5,
  showHumidity: true,
  showCondition: true,
  showAdditionalInfo: true,
  showFeelsLike: true,
  showWind: true,
  layout: "horizontal"
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "时间天气" | Card title |
| `titleVisible` | boolean | true | Show/hide card title |
| `timeFormat` | string | "HH:mm" | Time display format |
| `dateFormat` | string | "YYYY-MM-DD ddd" | Date display format |
| `showLunar` | boolean | false | Show lunar calendar |
| `weather_entity_id` | string | "" | Home Assistant weather entity |
| `weatherIconSize` | number | 1.2 | Weather icon size multiplier |
| `showHumidity` | boolean | true | Show humidity percentage |
| `showCondition` | boolean | true | Show weather condition text |
| `showAdditionalInfo` | boolean | false | Show additional weather info |
| `showFeelsLike` | boolean | true | Show feels-like temperature |
| `showWind` | boolean | true | Show wind speed |
| `layout` | string | "vertical" | Layout style: vertical, horizontal, compact |

## Time Format Options

- `HH:mm` - 24-hour format (14:30)
- `hh:mm A` - 12-hour format with AM/PM (2:30 PM)
- `H:mm` - 24-hour format without leading zero (14:30)
- `h:mm A` - 12-hour format without leading zero (2:30 PM)

## Date Format Options

- `YYYY-MM-DD ddd` - 2025-01-15 Mon
- `YYYY年MM月DD日 dddd` - 2025年01月15日 星期一
- `MM/DD/YYYY ddd` - 01/15/2025 Mon
- `DD/MM/YYYY ddd` - 15/01/2025 Mon
- `MMM DD, YYYY` - Jan 15, 2025
- `MMMM DD, YYYY` - January 15, 2025

## Usage in Dashboard

1. **Add Card**: Go to configuration page and click "Add Card"
2. **Select Type**: Choose "TimeWeatherCard" from the list
3. **Configure**: Set up time format, date format, and weather entity
4. **Save**: Apply the configuration to add the card to your dashboard

## Styling

The card automatically adapts to the current theme (light/dark mode) and is fully responsive for mobile and desktop layouts.

### Layout Examples

**Vertical Layout** (Default):
```
┌─────────────────┐
│ 09:20           │
│ 2025-08-13 Wed  │
│ ☀️ 32°          │
│ 💧 70%          │
└─────────────────┘
```

**Horizontal Layout**:
```
┌─────────────────────────┐
│ 09:20           ☀️ 32° │
│ 2025-08-13 Wed  💧 70%  │
└─────────────────────────┘
```

**Compact Layout**:
```
┌─────────────┐
│ 09:20  ☀️32°│
│ 08-13   70% │
└─────────────┘
```

## Integration Notes

- Requires a valid Home Assistant weather entity for weather functionality
- Time display works independently of weather entity
- Lunar calendar calculation uses the `lunar-javascript` library
- Updates time every second for real-time display
- Weather data updates based on Home Assistant's refresh rate

## Error Handling

- If weather entity is unavailable, only time is displayed
- Invalid time/date formats fall back to defaults
- Missing lunar calendar data is handled gracefully
- Network errors are logged in debug mode