import React from 'react';
import { Form, Input, Switch, Select, Slider, Divider } from 'antd';
import { useLanguage } from '../../i18n/LanguageContext';

const { Option } = Select;

function TimeWeatherConfig({ config = {}, onChange }) {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    onChange(newConfig);
  };

  const timeFormats = [
    { value: 'HH:mm', label: '24小时制 (HH:mm)' },
    { value: 'hh:mm A', label: '12小时制 (hh:mm AM/PM)' },
    { value: 'H:mm', label: '24小时制无前导零 (H:mm)' },
    { value: 'h:mm A', label: '12小时制无前导零 (h:mm AM/PM)' },
  ];

  const dateFormats = [
    { value: 'YYYY-MM-DD ddd', label: '2025-01-15 Mon' },
    { value: 'YYYY年MM月DD日 dddd', label: '2025年01月15日 星期一' },
    { value: 'MM/DD/YYYY ddd', label: '01/15/2025 Mon' },
    { value: 'DD/MM/YYYY ddd', label: '15/01/2025 Mon' },
    { value: 'MMM DD, YYYY', label: 'Jan 15, 2025' },
    { value: 'MMMM DD, YYYY', label: 'January 15, 2025' },
  ];

  const layoutOptions = [
    { value: 'vertical', label: t('timeWeather.layout.vertical') },
    { value: 'horizontal', label: t('timeWeather.layout.horizontal') },
    { value: 'compact', label: t('timeWeather.layout.compact') },
  ];

  return (
    <Form layout="vertical">
      <Form.Item label={t('config.basic.title')}>
        <Input
          value={config.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={t('cardTitles.timeWeather')}
        />
      </Form.Item>

      <Form.Item label={t('config.basic.titleVisible')}>
        <Switch
          checked={config.titleVisible !== false}
          onChange={(checked) => handleChange('titleVisible', checked)}
        />
      </Form.Item>

      <Divider>{t('timeWeather.time.title')}</Divider>

      <Form.Item label={t('timeWeather.time.format')}>
        <Select
          value={config.timeFormat || 'HH:mm'}
          onChange={(value) => handleChange('timeFormat', value)}
          placeholder={t('timeWeather.time.formatPlaceholder')}
        >
          {timeFormats.map(format => (
            <Option key={format.value} value={format.value}>
              {format.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('timeWeather.time.dateFormat')}>
        <Select
          value={config.dateFormat || 'YYYY-MM-DD ddd'}
          onChange={(value) => handleChange('dateFormat', value)}
          placeholder={t('timeWeather.time.dateFormatPlaceholder')}
        >
          {dateFormats.map(format => (
            <Option key={format.value} value={format.value}>
              {format.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('timeWeather.time.showLunar')}>
        <Switch
          checked={config.showLunar || false}
          onChange={(checked) => handleChange('showLunar', checked)}
        />
      </Form.Item>

      <Divider>{t('timeWeather.weather.title')}</Divider>

      <Form.Item label={t('timeWeather.weather.entity')}>
        <Input
          value={config.weather_entity_id || ''}
          onChange={(e) => handleChange('weather_entity_id', e.target.value)}
          placeholder="weather.home"
        />
      </Form.Item>

      <Form.Item label={t('timeWeather.weather.iconSize')}>
        <Slider
          min={0.5}
          max={2.0}
          step={0.1}
          value={config.weatherIconSize || 1.2}
          onChange={(value) => handleChange('weatherIconSize', value)}
          marks={{
            0.5: '0.5x',
            1.0: '1.0x',
            1.5: '1.5x',
            2.0: '2.0x'
          }}
        />
      </Form.Item>

      <Form.Item label={t('timeWeather.weather.showHumidity')}>
        <Switch
          checked={config.showHumidity !== false}
          onChange={(checked) => handleChange('showHumidity', checked)}
        />
      </Form.Item>

      <Form.Item label={t('timeWeather.weather.showCondition')}>
        <Switch
          checked={config.showCondition !== false}
          onChange={(checked) => handleChange('showCondition', checked)}
        />
      </Form.Item>

      <Form.Item label={t('timeWeather.weather.showAdditionalInfo')}>
        <Switch
          checked={config.showAdditionalInfo || false}
          onChange={(checked) => handleChange('showAdditionalInfo', checked)}
        />
      </Form.Item>

      {config.showAdditionalInfo && (
        <>
          <Form.Item label={t('timeWeather.weather.showFeelsLike')}>
            <Switch
              checked={config.showFeelsLike !== false}
              onChange={(checked) => handleChange('showFeelsLike', checked)}
            />
          </Form.Item>

          <Form.Item label={t('timeWeather.weather.showWind')}>
            <Switch
              checked={config.showWind !== false}
              onChange={(checked) => handleChange('showWind', checked)}
            />
          </Form.Item>
        </>
      )}

      <Divider>{t('timeWeather.layout.title')}</Divider>

      <Form.Item label={t('timeWeather.layout.style')}>
        <Select
          value={config.layout || 'vertical'}
          onChange={(value) => handleChange('layout', value)}
        >
          {layoutOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}

export default TimeWeatherConfig;