import { Composition } from 'remotion';
import { ProjectVideo } from './Composition';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Jokiin" component={ProjectVideo} durationInFrames={240} fps={30} width={960} height={600} defaultProps={{ image: 'jokiin.png', introImage: 'jokiin-home.png', title: 'JOKI.IN', subtitle: 'Academic services', accent: '#67d3ae', headline: 'Tugas lebih tertata.', detail: 'Jelajahi layanan dalam satu tempat', closing: 'Teman tugas mahasiswa.' }} />
    <Composition id="Journalingtrade" component={ProjectVideo} durationInFrames={240} fps={30} width={960} height={600} defaultProps={{ image: 'journal.png', title: 'journalingtrade', subtitle: 'Trading journal', accent: '#c8ad8d', headline: 'Every trade.\nA clearer decision.', detail: 'Plan. Record. Review.', closing: 'A workspace for traders.' }} />
  </>
);
