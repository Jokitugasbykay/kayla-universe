import { Composition } from 'remotion';
import { ProjectVideo } from './Composition';
import { JokiinPromo, jokiinPromoFrames } from './JokiinLogo';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Jokiin" component={JokiinPromo} durationInFrames={jokiinPromoFrames} fps={30} width={960} height={600} />
    <Composition id="Journalingtrade" component={ProjectVideo} durationInFrames={240} fps={30} width={960} height={600} defaultProps={{ image: 'journal.png', title: 'journalingtrade', subtitle: 'Trading journal', accent: '#c8ad8d', headline: 'Every trade.\nA clearer decision.', detail: 'Plan. Record. Review.', closing: 'A workspace for traders.' }} />
    <Composition id="KaylaFinance" component={ProjectVideo} durationInFrames={240} fps={30} width={960} height={600} defaultProps={{ image: 'kayla-finance.png', title: 'Kayla Finance', subtitle: 'Personal finance', accent: '#c8ad8d', headline: 'Your finances.\nOne clearer view.', detail: 'Transactions · Accounts · Trading', closing: 'Personal finance & trading.' }} />
  </>
);
