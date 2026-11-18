import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const easing = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export function JokiinPromo() {
  return (
    <AbsoluteFill style={{ background: '#080b0a' }}>
      <Sequence durationInFrames={180}>
        <LogoReveal />
      </Sequence>
      <Sequence from={180} durationInFrames={183}>
        <OffthreadVideo src={staticFile('1118.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Sequence>
    </AbsoluteFill>
  );
}

function LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const iconX = interpolate(time, [0.7, 1.45, 2.25, 3.35], [0, 170, 170, -212], { ...clamp, easing });
  const textX = interpolate(time, [2.25, 3.35], [-102, 112], { ...clamp, easing });
  const ending = interpolate(time, [5.2, 5.95], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: '#080b0a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'absolute', zIndex: 1, width: 290, height: 290,
        translate: `${iconX}px 0`,
        scale: interpolate(time, [0, 0.65], [0.88, 1], { ...clamp, easing }),
        opacity: interpolate(time, [0, 0.4], [0, 1], clamp) * ending,
      }}>
        <Img src={staticFile('jokiin-mark.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{
        position: 'absolute', color: '#fff', font: '900 88px Arial, sans-serif',
        letterSpacing: -3, translate: `${textX}px 0`,
        opacity: interpolate(time, [1.45, 2.1], [0, 1], clamp) * ending,
      }}>
        JOKI<span style={{ color: '#28c9a2' }}>.IN</span>
      </div>
    </AbsoluteFill>
  );
}
