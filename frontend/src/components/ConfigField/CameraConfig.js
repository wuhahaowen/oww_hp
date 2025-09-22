import { useLanguage } from '../../i18n/LanguageContext';   
import { Input, AutoComplete, Radio, Button, Checkbox, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { cameraApi } from '../../utils/api';
import { InfoCircleOutlined } from '@ant-design/icons';

function CameraConfig({ field, value, onChange, getFilteredEntities }) {
    const { t } = useLanguage();
    const cameraEntities = getFilteredEntities('camera.*');
    const [onvifSources, setOnvifSources] = useState([]);
    
    useEffect(() => {
      const fetchOnvifSources = async () => {
        try {
          const sources = await cameraApi.getOnvifSources();
          setOnvifSources(sources);
        } catch (error) {
          console.error('获取ONVIF源失败:', error);
        }
      };
      
      fetchOnvifSources();
    }, []);

    const handleStreamUrlChange = (selectedUrl, index, camera) => {
      if (!selectedUrl) {
        const newCameras = [...value];
        newCameras[index] = {
          ...camera,
          stream_url: '',
          onvif_username: '',
          onvif_password: '',
          url_type: 'auto',
          supports_ptz: false
        };
        onChange(newCameras);
        return;
      }

      const newCameras = [...value];
      newCameras[index] = {
        ...camera,
        stream_url: selectedUrl,
      };
      onChange(newCameras);
    };

    const handleOnvifCredentialsChange = (index, camera, field, newValue) => {
      const newCameras = [...value];
      newCameras[index] = {
        ...camera,
        [field]: newValue
      };
      
      if (camera.stream_url && camera.stream_url.startsWith('onvif://')) {
        let urlStr = camera.stream_url;
        
        // 移除所有现有的认证信息
        const urlParts = urlStr.split('://');
        const hostPath = urlParts[1].split('/');
        const hostPart = hostPath[0];
        
        // 移除主机部分中可能存在的所有认证信息
        const cleanHost = hostPart.split('@').pop();
        
        // 只有当用户名和密码都存在时才添加认证信息
        if (newCameras[index].onvif_username && newCameras[index].onvif_password) {
          newCameras[index].stream_url = `onvif://${newCameras[index].onvif_username}:${newCameras[index].onvif_password}@${cleanHost}/onvif/device_service`;
        } else {
          newCameras[index].stream_url = `onvif://${cleanHost}/onvif/device_service`;
        }
      }
      
      onChange(newCameras);
    };

    return (
      <div className="config-field">
        <label>{field.label}</label>
        <div className="cameras-config">
          {(value || []).map((camera, index) => (
            <div key={index} className="camera-item">
              <Input
                type="text"
                value={camera.name || null}
                onChange={(e) => {
                  const newCameras = [...value];
                  newCameras[index] = {
                    ...camera,
                    name: e.target.value
                  };
                  onChange(newCameras);
                }}
                placeholder={t('configField.cameraName')}
              />
              <AutoComplete
                allowClear
                value={camera.entity_id || null}
                onChange={(selectedValue) => {
                  const newCameras = [...value];
                  newCameras[index] = {
                    ...camera,
                    entity_id: selectedValue
                  };
                  onChange(newCameras);
                }}
                showSearch
                placeholder={t('configField.selectEntity')}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={cameraEntities.map(entity => ({
                  value: entity.id,
                  label: entity.name + ' (' + entity.id + ')'
                }))}
              />

              <Radio.Group 
                value={camera.url_type || 'auto'} 
                onChange={(e) => {
                  const newCameras = [...value];
                  newCameras[index] = {
                    ...camera,
                    url_type: e.target.value,
                    stream_url: '',
                    onvif_username: '',
                    onvif_password: '',
                    supports_ptz: false
                  };
                  onChange(newCameras);
                }}
              >
                <Radio value="auto">{t('configField.autoDiscover')}</Radio>
                <Radio value="manual">{t('configField.manualInput')}</Radio>
              </Radio.Group>

              {camera.url_type === 'auto' ? (
                <AutoComplete
                  allowClear
                  value={camera.stream_url || null}
                  onChange={(selectedValue) => handleStreamUrlChange(selectedValue, index, camera)}
                  showSearch
                  placeholder={t('configField.streamUrl')}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={onvifSources.map(source => ({
                    value: source.url,
                    label: source.url
                  }))}
                />
              ) : (
                <Input
                  type="text"
                  value={camera.stream_url || null}
                  onChange={(e) => {
                    const newCameras = [...value];
                    newCameras[index] = {
                      ...camera,
                      stream_url: e.target.value
                    };
                    onChange(newCameras);
                  }}
                  placeholder={t('configField.manualStreamUrl')}
                />
              )}
              
              {camera.stream_url?.startsWith('onvif://') && (
                <>
                  <Input
                    type="text"
                    value={camera.onvif_username || null}
                    onChange={(e) => handleOnvifCredentialsChange(index, camera, 'onvif_username', e.target.value)}
                    placeholder={t('configField.onvifUsername')}
                  />
                  <Input
                    type="password"
                    value={camera.onvif_password || null}
                    onChange={(e) => handleOnvifCredentialsChange(index, camera, 'onvif_password', e.target.value)}
                    placeholder={t('configField.onvifPassword')}
                  />
                    <Checkbox
                      checked={camera.supports_ptz || false}
                      onChange={(e) => {
                        const newCameras = [...value];
                        newCameras[index] = {
                          ...camera,
                          supports_ptz: e.target.checked
                        };
                        onChange(newCameras);
                      }}
                    >
                      {t('configField.supportsPTZ') || '支持云台控制'}
                      <Tooltip title={t('configField.ptzTooltip') || '启用此选项将显示云台控制按钮，仅适用于支持PTZ功能的ONVIF摄像头'}>
                        <InfoCircleOutlined style={{ marginLeft: '5px' }} />
                      </Tooltip>
                    </Checkbox>
                </>
              )}
              
              <Button
                style={{ width: '100px' }}
                type="primary"
                danger
                onClick={() => {
                  const newCameras = [...value];
                  newCameras.splice(index, 1);
                  onChange(newCameras);
                }}
              >
                {t('configField.deleteButton')}
              </Button>
            </div>
          ))}
          <Button
            type="primary"
            style={{ width: '100px' }}
            onClick={() => {
              onChange([
                ...(value || []),
                {
                  entity_id: '',
                  name: '',
                  stream_url: '',
                  onvif_username: '',
                  onvif_password: '',
                  url_type: 'auto',
                  room: '',
                  supports_ptz: false
                }
              ]);
            }}
          >
            {t('configField.addButton')}
          </Button>
        </div>
      </div>
    );
}

export default CameraConfig;

