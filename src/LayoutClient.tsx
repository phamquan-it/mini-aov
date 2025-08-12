'use client';

import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';

import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    // NProgress loading bar on route change

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        headerBg: 'white',
                        siderBg: 'white',
                        headerPadding: 0,
                        bodyBg: 'white',
                    },
                },
            }}
        >
            <AntdRegistry>
                {children}
            </AntdRegistry>
        </ConfigProvider>
    );
}

