import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
type Props = { image: string; introImage?: string; title: string; subtitle: string; accent: string; headline: string; detail: string; closing: string };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: ease };
export const ProjectVideo: React.FC<Props> = ({ image, introImage, title, subtitle, accent, headline, detail, closing }) => {
  const frame = useCurrentFrame();
  const opening = interpolate(frame, [0, 8, 44, 60], [0, 1, 1, 0], clamp);
  const showcase = interpolate(frame, [44, 65, 171, 190], [0, 1, 1, 0], clamp);
  const ending = interpolate(frame, [177, 197, 229, 239], [0, 1, 1, 0], clamp);
  const slide = interpolate(frame, [44, 75], [65, 0], clamp);
  const headlineSlide = interpolate(frame, [4, 23], [32, 0], clamp);
  const zoom = interpolate(frame, [55, 190], [1, 1.055], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0e10', fontFamily: 'Arial, sans-serif', color: '#f7f5f0', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 52, right: 52, top: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, fontWeight: 700, color: '#e8e4df' }}>
        <span>{title}</span><span style={{ color: accent, fontSize: 12, letterSpacing: 2 }}>{subtitle.toUpperCase()}</span>
      </div>
      <div style={{ position: 'absolute', top: 74, left: 52, right: 52, height: 1, backgroundColor: '#ffffff22' }} />
      {introImage ? <div style={{ position: 'absolute', inset: '96px 52px 94px', opacity: opening, overflow: 'hidden', borderRadius: 12, backgroundColor: '#f6faf8' }}>
        <Img src={staticFile(introImage)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div> : <AbsoluteFill style={{ justifyContent: 'center', padding: '80px', opacity: opening }}>
        <div style={{ color: accent, fontSize: 15, letterSpacing: 3, fontWeight: 700, marginBottom: 20 }}>INTRODUCING</div>
        <div style={{ fontSize: 75, lineHeight: 1.06, maxWidth: 800, fontWeight: 800, letterSpacing: -3, whiteSpace: 'pre-line', translate: `0 ${headlineSlide}px` }}>{headline}</div>
        <div style={{ width: 110, height: 4, backgroundColor: accent, marginTop: 28 }} />
      </AbsoluteFill>}
      <div style={{ position: 'absolute', inset: '96px 52px 94px', opacity: showcase, translate: `0 ${slide}px` }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #ffffff26', boxShadow: '0 20px 50px #0009', backgroundColor: '#16191c' }}>
          <Img src={staticFile(image)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', scale: `${zoom}` }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 56, right: 56, bottom: 39, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: showcase }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>{detail}</span><span style={{ color: accent, fontSize: 24 }}>↗</span>
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: ending }}>
        <div style={{ color: accent, fontSize: 14, fontWeight: 700, letterSpacing: 3, marginBottom: 20 }}>{subtitle.toUpperCase()}</div>
        <div style={{ fontSize: title.length > 10 ? 66 : 82, fontWeight: 800, letterSpacing: -2 }}>{title}</div>
        <div style={{ marginTop: 18, fontSize: 21, color: '#c4c5c3' }}>{closing}</div>
        <div style={{ marginTop: 28, height: 3, width: 74, backgroundColor: accent }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
