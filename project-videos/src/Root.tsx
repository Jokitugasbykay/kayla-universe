import { Composition } from 'remotion';
import { JournalPreview } from './JournalPreview';
import { JokiinPromo, jokiinPromoFrames } from './JokiinLogo';
import { FinancePreview } from './FinancePreview';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Jokiin" component={JokiinPromo} durationInFrames={jokiinPromoFrames} fps={30} width={960} height={600} />
    <Composition id="Journalingtrade" component={JournalPreview} durationInFrames={240} fps={30} width={960} height={600} />
    <Composition id="KaylaFinance" component={FinancePreview} durationInFrames={240} fps={30} width={960} height={600} />
  </>
);
