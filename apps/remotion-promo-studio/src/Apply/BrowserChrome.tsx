import React from 'react';
import {teaserFont} from '../Teaser/fonts';

export const BrowserChrome: React.FC<{
  url: string;
  accentColor: string;
  children: React.ReactNode;
}> = ({url, accentColor, children}) => {
  return (
    <div
      style={{
        width: 1280,
        height: 780,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#120a14',
        border: `1px solid ${accentColor}55`,
        boxShadow: `0 40px 100px -40px ${accentColor}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 52,
          background: '#1a0f1f',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{display: 'flex', gap: 8}}>
          <span style={{width: 12, height: 12, borderRadius: '50%', background: '#ff5f57'}} />
          <span style={{width: 12, height: 12, borderRadius: '50%', background: '#febc2e'}} />
          <span style={{width: 12, height: 12, borderRadius: '50%', background: '#28c840'}} />
        </div>
        <div
          style={{
            flex: 1,
            height: 32,
            borderRadius: 8,
            background: '#0d0810',
            color: 'rgba(253,246,255,0.7)',
            fontFamily: teaserFont,
            fontSize: 16,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
          }}
        >
          https://{url}
        </div>
      </div>
      <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>
    </div>
  );
};
