import { useState } from 'react';
import styles from './JokiinDetail.module.css';

type Props = { onClose: () => void };

export function JokiinDetail({ onClose }: Props) {
  const [section, setSection] = useState<'services' | 'store'>('services');
  const services = section === 'services';

  return (
    <section className={styles.detail} aria-labelledby="jokiin-detail-title">
      <div className={styles.header}>
        <div><span className={styles.eyebrow}>PROJECT NOTES / 01</span><h2 id="jokiin-detail-title">Inside JOKI.IN</h2></div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close project details">Close <span aria-hidden="true">↑</span></button>
      </div>
      <p className={styles.intro}>One platform, two connected journeys: finding services and exploring digital products.</p>
      <div className={styles.switcher} aria-label="Explore JOKI.IN experiences">
        <button type="button" aria-pressed={services} onClick={() => setSection('services')}>01 <span>Services</span></button>
        <button type="button" aria-pressed={!services} onClick={() => setSection('store')}>02 <span>Digital Store</span></button>
      </div>
      <div className={styles.feature} key={section}>
        <div>
          <span className={styles.eyebrow}>{services ? 'SERVICE PLATFORM' : 'DIGITAL COMMERCE'}</span>
          <h3>{services ? 'Services & orders' : 'Digital products'}</h3>
          <p>{services ? 'Visitors can browse service categories and access the cart, order history and account entry points.' : 'A dedicated store sits within JOKI.IN. Its public route redirects to sign-in before the catalog can be explored.'}</p>
          <a href={services ? 'https://jokiin.my.id/' : 'https://jokiin.my.id/produk-digital/'} target="_blank" rel="noopener noreferrer">{services ? 'Visit Services' : 'Open Digital Store'} <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.facts}>
          <div><span>01 / INTERFACE</span><p>{services ? 'Public service categories, cart and account navigation.' : 'A separate product catalog and checkout interface exist in the repository.'}</p></div>
          <div><span>02 / STATUS</span><p>{services ? 'Public navigation observed; payment and fulfillment were not tested.' : 'Authenticated access, payment and delivery flows were not tested.'}</p></div>
        </div>
      </div>
      <div className={styles.engineering}>
        <span className={styles.eyebrow}>ENGINEERING</span>
        <p>Services and the store use separate routes under the JOKI.IN identity. The published store references a Next.js build; backend integrations and checkout behavior need further verification.</p>
      </div>
    </section>
  );
}
