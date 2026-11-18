import { Composition } from 'remotion';
import { ProjectVideo } from './Composition';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Jokiin" component={ProjectVideo} durationInFrames={180} fps={30} width={960} height={600} defaultProps={{ image: 'jokiin.png', title: 'JOKI.IN', subtitle: 'Academic services', accent: '#80d0b7' }} />
    <Composition id="Journalingtrade" component={ProjectVideo} durationInFrames={180} fps={30} width={960} height={600} defaultProps={{ image: 'journal.png', title: 'journalingtrade', subtitle: 'Trading journal', accent: '#c8ad8d' }} />
  </>
);
