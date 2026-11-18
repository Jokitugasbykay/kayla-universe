import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const easing = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const logoFrames = 126;
const footageFrames = 122;
const outroFrames = 66;
export const jokiinPromoFrames = logoFrames + footageFrames + outroFrames;

export function JokiinPromo() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#080b0a' }}>
      <Sequence durationInFrames={logoFrames}>
        <LogoReveal />
      </Sequence>
      <Sequence from={logoFrames} durationInFrames={footageFrames}>
        <AbsoluteFill style={{ opacity: interpolate(frame, [logoFrames, logoFrames + 18, logoFrames + footageFrames - 18, logoFrames + footageFrames], [0, 1, 1, 0], clamp) }}>
          <OffthreadVideo src={staticFile('1118.mp4')} playbackRate={1.5} muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={logoFrames + footageFrames} durationInFrames={outroFrames}>
        <AbsoluteFill style={{ opacity: interpolate(frame, [logoFrames + footageFrames, logoFrames + footageFrames + 18], [0, 1], clamp) }}>
          <JokiinEndCard />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

function LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const iconX = interpolate(time, [0.8, 2], [0, -212], { ...clamp, easing });
  const textX = interpolate(time, [2.02, 2.68], [148, 112], { ...clamp, easing });

  return (
    <AbsoluteFill style={{ background: '#080b0a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'absolute', zIndex: 1, width: 290, height: 290,
        translate: `${iconX}px 0`,
        scale: interpolate(time, [0, 0.65], [0.88, 1], { ...clamp, easing }),
        opacity: interpolate(time, [0, 0.7, 3.65, 4.18], [0, 1, 1, 0], clamp),
      }}>
        <Img src={staticFile('jokiin-mark.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{
        position: 'absolute', color: '#fff', font: '900 88px Arial, sans-serif',
        letterSpacing: -3, translate: `${textX}px 0`,
        opacity: interpolate(time, [1.1, 2, 3.65, 4.18], [0, 1, 1, 0], clamp),
      }}>
        JOKI<span style={{ color: '#28c9a2' }}>.IN</span>
      </div>
    </AbsoluteFill>
  );
}

function JokiinEndCard() {
  const accent = '#67d3ae';
  return (
    <AbsoluteFill style={{ background: '#000', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'absolute', top: 34, left: 44, right: 44, paddingBottom: 23, borderBottom: '1px solid #ffffff22', display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
        <span>JOKI.IN</span>
        <span style={{ color: accent, fontSize: 12, letterSpacing: 2 }}>ACADEMIC SERVICES</span>
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: accent, fontSize: 14, fontWeight: 700, letterSpacing: 3, marginBottom: 25 }}>ACADEMIC SERVICES</div>
        <div style={{ fontSize: 82, fontWeight: 900, letterSpacing: -2 }}>JOKI.IN</div>
        <div style={{ marginTop: 23, fontSize: 21, color: '#d6d6d6' }}>Teman tugas mahasiswa.</div>
        <div style={{ marginTop: 28, height: 3, width: 74, background: accent }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
