import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

type Props = { image: string; title: string; subtitle: string; accent: string };

export const ProjectVideo: React.FC<Props> = ({ image, title, subtitle, accent }) => {
  const frame = useCurrentFrame();
  const progress = Math.sin(Math.PI * frame / 180);
  const fade = interpolate(frame, [0, 12, 168, 179], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: '#111315', fontFamily: 'Arial, sans-serif', color: '#f8f6f2', overflow: 'hidden' }}>
      <AbsoluteFill style={{ padding: '60px 52px 90px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #34383b', boxShadow: '0 20px 60px #0008' }}>
          <Img src={staticFile(image)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', scale: `${1 + 0.04 * progress}` }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', bottom: 24, left: 54, right: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: fade }}>
        <span style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</span>
        <span style={{ fontSize: 15, color: accent, letterSpacing: '1px', textTransform: 'uppercase' }}>{subtitle}</span>
      </div>
    </AbsoluteFill>
  );
};
