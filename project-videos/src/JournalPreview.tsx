import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease };
export function JournalPreview() {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 18, 48, 70], [0, 1, 1, 0], clamp);
  const middle = interpolate(frame, [55, 78, 166, 188], [0, 1, 1, 0], clamp);
  const end = interpolate(frame, [177, 198, 225, 239], [0, 1, 1, 0], clamp);
  const candles = [130, 118, 122, 102, 110, 86, 96, 76, 83, 62, 70, 48];
  return (
    <AbsoluteFill style={{ background: '#090c0e', color: '#f6f3ed', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: '40px 52px auto', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
        <span>journalingtrade</span><span style={{ color: '#c8ad8d', letterSpacing: 2, fontSize: 12 }}>TRADING JOURNAL</span>
      </div>
      <div style={{ position: 'absolute', top: 75, left: 52, right: 52, height: 1, background: '#ffffff20' }} />
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 80px', opacity: intro }}>
        <div style={{ fontSize: 15, letterSpacing: 3, color: '#c8ad8d', marginBottom: 24 }}>TRADING JOURNAL</div>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, translate: `0 ${interpolate(frame,[0,25],[35,0],clamp)}px` }}>Every trade.<br />A clearer decision.</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: middle, padding: '112px 64px 70px' }}>
        <div style={{ fontSize: 37, fontWeight: 700 }}>Plan. Record. Review.</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 30, flex: 1 }}>
          <div style={{ flex: 1.3, border: '1px solid #ffffff24', borderRadius: 12, padding: 22, background: '#111719' }}>
            <div style={{ color: '#c8ad8d', fontSize: 13, letterSpacing: 2 }}>MARKET REVIEW</div>
            <div style={{ height: 205, position: 'relative', marginTop: 20, display: 'flex', gap: 12, alignItems: 'stretch' }}>
              {candles.map((y, i) => {
                const visible = interpolate(frame, [70 + i * 5, 76 + i * 5], [0, 1], clamp);
                const color = i % 3 === 2 ? '#ce857d' : '#65c9a4';
                return <div key={i} style={{ position: 'relative', flex: 1, opacity: visible }}>
                  <div style={{ position: 'absolute', left: '50%', top: y - 10, height: 52, width: 2, background: color }} />
                  <div style={{ position: 'absolute', left: '22%', right: '22%', top: y, height: 30, background: color, borderRadius: 2 }} />
                </div>;
              })}
            </div>
          </div>
          <div style={{ flex: 0.8, border: '1px solid #ffffff24', borderRadius: 12, padding: 24, background: '#131719', translate: `0 ${interpolate(frame,[75,105],[24,0],clamp)}px` }}>
            <div style={{ color: '#c8ad8d', fontSize: 13, letterSpacing: 2 }}>TRADE JOURNAL</div>
            <div style={{ fontSize: 25, fontWeight: 700, marginTop: 28 }}>Review your plan</div>
            {['Setup', 'Risk', 'Reflection'].map((label,i) => <div key={label} style={{ borderTop: '1px solid #ffffff1a', paddingTop: 16, marginTop: 18, fontSize: 17, color: '#d4d0c9', opacity: interpolate(frame,[85+i*9,100+i*9],[0,1],clamp) }}>{label}</div>)}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: end, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#c8ad8d', fontSize: 13, letterSpacing: 3, marginBottom: 20 }}>A WORKSPACE FOR TRADERS</div>
        <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: -2 }}>journalingtrade</div>
        <div style={{ width: interpolate(frame,[190,220],[0,90],clamp), height: 3, background: '#c8ad8d', marginTop: 30 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
