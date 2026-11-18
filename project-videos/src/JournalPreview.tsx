import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease };
export function JournalPreview() {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 18, 48, 70], [0, 1, 1, 0], clamp);
  const middle = interpolate(frame, [55, 78, 166, 188], [0, 1, 1, 0], clamp);
  const end = interpolate(frame, [177, 198, 225, 239], [0, 1, 1, 0], clamp);
  const reveal = interpolate(frame, [65, 150], [0, 1], clamp);
  const candles = [0.28, 0.38, 0.33, 0.51, 0.44, 0.58, 0.49, 0.68, 0.62, 0.75, 0.69, 0.88];
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
      <AbsoluteFill style={{ opacity: middle, padding: '105px 70px 85px', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 39, fontWeight: 700 }}>Plan. Record. Review.</div>
        <div style={{ display: 'flex', alignItems: 'end', gap: 14, height: 220, borderBottom: '1px solid #c8ad8d55' }}>
          {candles.map((h,i) => <div key={i} style={{ flex: 1, height: h * 190 * reveal, background: i % 3 === 2 ? '#9b7770' : '#c8ad8d', borderRadius: '3px 3px 0 0', opacity: 0.8 }} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d9c1a4', fontSize: 19, fontWeight: 700 }}><span>Journal</span><span>Analytics</span><span>Risk</span></div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: end, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#c8ad8d', fontSize: 13, letterSpacing: 3, marginBottom: 20 }}>A WORKSPACE FOR TRADERS</div>
        <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: -2 }}>journalingtrade</div>
        <div style={{ width: interpolate(frame,[190,220],[0,90],clamp), height: 3, background: '#c8ad8d', marginTop: 30 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
