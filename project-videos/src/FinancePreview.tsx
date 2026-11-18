import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease };

export function FinancePreview() {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 18, 48, 70], [0, 1, 1, 0], clamp);
  const middle = interpolate(frame, [55, 78, 166, 188], [0, 1, 1, 0], clamp);
  const end = interpolate(frame, [177, 198, 225, 239], [0, 1, 1, 0], clamp);
  const reveal = interpolate(frame, [65, 145], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: '#090c0e', color: '#f6f3ed', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: '40px 52px auto', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
        <span>Kayla Finance</span><span style={{ color: '#c8ad8d', letterSpacing: 2, fontSize: 12 }}>PERSONAL FINANCE</span>
      </div>
      <div style={{ position: 'absolute', top: 75, left: 52, right: 52, height: 1, background: '#ffffff20' }} />
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 80px', opacity: intro }}>
        <div style={{ fontSize: 15, letterSpacing: 3, color: '#c8ad8d', marginBottom: 24 }}>KAYLA FINANCE</div>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, translate: `0 ${interpolate(frame,[0,25],[35,0],clamp)}px` }}>Your money.<br />In motion.</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: middle, padding: '105px 70px 85px', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 39, fontWeight: 700 }}>See the bigger picture.</div>
        <div style={{ display: 'flex', alignItems: 'end', gap: 18, height: 220, borderBottom: '1px solid #c8ad8d55' }}>
          {[0.31,0.49,0.43,0.68,0.57,0.8,0.72,0.94,0.85].map((h,i) => <div key={i} style={{ flex: 1, height: h * 190 * reveal, background: i===7 ? '#e4c5a0' : '#806e5c', borderRadius: '4px 4px 0 0' }} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d9c1a4', fontSize: 19, fontWeight: 700 }}><span>Transactions</span><span>Accounts</span><span>Trading</span></div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: end, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#c8ad8d', fontSize: 13, letterSpacing: 3, marginBottom: 20 }}>PERSONAL FINANCE & TRADING</div>
        <div style={{ fontSize: 75, fontWeight: 800, letterSpacing: -2 }}>Kayla Finance</div>
        <div style={{ width: interpolate(frame,[190,220],[0,90],clamp), height: 3, background: '#c8ad8d', marginTop: 30 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
