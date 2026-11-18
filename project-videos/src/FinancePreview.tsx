import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.bezier(0.22, 1, 0.36, 1) };
export function FinancePreview() {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15, 220, 239], [0, 1, 1, 0], clamp);
  const chart = interpolate(frame, [30, 120], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: '#0c0e10', color: '#f2efea', fontFamily: 'Arial, sans-serif', padding: 45, opacity: fade }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Kayla Finance</div>
        <div style={{ color: '#c8ad8d', fontSize: 13, letterSpacing: 2 }}>PERSONAL FINANCE</div>
      </div>
      <div style={{ display: 'flex', flex: 1, gap: 24 }}>
        <div style={{ width: 155, borderRight: '1px solid #ffffff22', color: '#9c9e9e', fontSize: 17, lineHeight: '52px' }}>
          <div style={{ color: '#d6b996' }}>Overview</div><div>Accounts</div><div>Transactions</div><div>Trading</div><div>Reports</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>Financial overview</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {['Accounts', 'Transactions', 'Trading'].map(label => <div key={label} style={{ flex: 1, background: '#1b1e20', border: '1px solid #ffffff18', borderRadius: 10, padding: '18px 17px' }}><div style={{ fontSize: 14, color: '#c8ad8d' }}>{label}</div><div style={{ height: 7, width: '60%', borderRadius: 8, background: '#72716d', marginTop: 20 }} /></div>)}
          </div>
          <div style={{ flex: 1, background: '#171a1c', border: '1px solid #ffffff18', borderRadius: 10, padding: 22 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Cash flow</div>
            <div style={{ height: 140, display: 'flex', gap: 24, alignItems: 'end', paddingTop: 20, borderBottom: '1px solid #ffffff30' }}>
              {[52, 80, 60, 105, 74, 112, 90].map((h, i) => <div key={i} style={{ flex: 1, height: h * chart, background: '#c8ad8d', borderRadius: '4px 4px 0 0', opacity: 0.75 }} />)}
            </div>
            <div style={{ fontSize: 13, color: '#999', marginTop: 13 }}>Transactions · Accounts · Trading</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
