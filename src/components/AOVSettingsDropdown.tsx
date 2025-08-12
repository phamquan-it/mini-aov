import React from 'react';
import { Card, Slider, Dropdown, FloatButton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { SettingOutlined } from '@ant-design/icons';
import { setFOV, setScale, setZoom, updateAOVSettings } from '@/lib/redux/features/aov/aovSlice';

const AOVSettingsDropdown: React.FC = () => {
    const dispatch = useDispatch();
    const { scale, fov, zoom, minScale, maxScale } = useSelector(
        (state: RootState) => state.aov.settings
    );

    const handleScaleChange = (value: number) => {
        dispatch(setScale(value));
    };

    const handleFOVChange = (value: number) => {
        dispatch(setFOV(value));
    };

    const handleZoomChange = (value: number) => {
        dispatch(setZoom(value));
    };

    const handleReset = () => {
        dispatch(updateAOVSettings({
            scale: 0.2,
            fov: 60,
            zoom: 1.0
        }));
    };

    return (
        <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            popupRender={() => (
                <Card
                    title="AOV Settings"
                    style={{ width: 320 }}
                    extra={<a onClick={handleReset}>Reset</a>}
                >
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Scale:</strong> {scale.toFixed(2)}x
                        </div>
                        <Slider
                            min={minScale}
                            max={maxScale}
                            step={0.01}
                            value={scale}
                            onChange={handleScaleChange}
                            tooltip={{ formatter: (val) => `${val?.toFixed(2)}x` }}
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Field of View:</strong> {fov}°
                        </div>
                        <Slider
                            min={30}
                            max={120}
                            step={1}
                            value={fov}
                            onChange={handleFOVChange}
                            tooltip={{ formatter: (val) => `${val}°` }}
                        />
                    </div>

                    <div style={{ marginBottom: 8 }}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Zoom:</strong> {zoom?.toFixed(1)}x
                        </div>
                        <Slider
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={handleZoomChange}
                            tooltip={{ formatter: (val) => `${val?.toFixed(1)}x` }}
                        />
                    </div>
                </Card>
            )}
        >
            <FloatButton
                shape="circle"
                type="primary"
                tooltip="AOV Settings"
                icon={<SettingOutlined />}
            />
        </Dropdown>
    );
};

export default AOVSettingsDropdown;
