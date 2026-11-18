import { useState } from 'react';
import styles from './JokiinDetail.module.css';

type Props = { onClose: () => void };

export function JokiinDetail({ onClose }: Props) {
  const [section, setSection] = useState<'services' | 'store'>('services');

  const services = section === 'services';

  return (
    <section className={styles.detail} aria-labelledby="jokiin-detail-title">
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <span>PROJECT / JOKI.IN</span>
          <button type="button" onClick={onClose} aria-label="Close project details">Close <span aria-hidden="true">×</span></button>
        </div>
        <div className={styles.hero}>
          <div>
            <p className={styles.kicker}>DIGITAL SERVICES & COMMERCE PLATFORM</p>
            <h2 id="jokiin-detail-title">One ecosystem.<br /><em>Two experiences.</em></h2>
            <p className={styles.lead}>JOKI.IN brings service discovery and a digital store into one connected web platform. This case study explores the structure behind both experiences.</p>
          </div>
          <div className={styles.brand} aria-hidden="true">
            <img src="./assets/jokiin-brand.png" alt="" />
            <span>SERVICES <i>↗</i> DIGITAL STORE</span>
          </div>
        </div>
        <div className={styles.explore}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.kicker}>EXPLORE THE PLATFORM</p><h3>Two sides of JOKI.IN</h3></div>
            <p>Select an experience to explore its role and current visibility.</p>
          </div>
          <div className={styles.switcher} aria-label="Explore JOKI.IN experiences">
            <button type="button" aria-pressed={services} onClick={() => setSection('services')}><span>01</span> Services <span aria-hidden="true">↗</span></button>
            <button type="button" aria-pressed={!services} onClick={() => setSection('store')}><span>02</span> Digital Store <span aria-hidden="true">↗</span></button>
          </div>
          <div className={styles.feature} key={section}>
            <div className={styles.featureIntro}>
              <p className={styles.kicker}>{services ? 'SERVICE EXPERIENCE' : 'DIGITAL COMMERCE'}</p>
              <h3>{services ? 'From discovery to an order.' : 'A home for digital products.'}</h3>
              <p>{services ? 'Visitors can browse service categories, explore offerings, and reach the order and account entry points from the public website.' : 'The Digital Store is a distinct area within JOKI.IN. Its public route currently redirects to sign-in before the store can be explored.'}</p>
              <a href={services ? 'https://jokiin.my.id/' : 'https://jokiin.my.id/produk-digital/'} target="_blank" rel="noopener noreferrer">{services ? 'Visit JOKI.IN Services' : 'Open Digital Store'} <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.detailList}>
              {services ? <>
                <div><strong>Discovery</strong><p>Public service categories and offerings are visible on the homepage.</p></div>
                <div><strong>Order access</strong><p>Cart, order history and sign-in entry points are present in the interface.</p></div>
                <div><strong>Verification</strong><p>Public navigation observed. Payment and fulfillment were not tested.</p></div>
              </> : <>
                <div><strong>Store route</strong><p>The public store address redirects to the JOKI.IN login page.</p></div>
                <div><strong>Implementation</strong><p>Repository files include a digital catalog page and a checkout interface.</p></div>
                <div><strong>Verification</strong><p>Authenticated access, payment and delivery flows were not tested.</p></div>
              </>}
            </div>
          </div>
        </div>
        <section className={styles.engineering}>
          <div><p className={styles.kicker}>ENGINEERING NOTES</p><h3>Built as an ecosystem.</h3><p>The project connects two distinct customer journeys through the JOKI.IN identity and account entry points. The portfolio describes what can be observed, with deeper operational behavior left unverified.</p></div>
          <div className={styles.notes}>
            <div><span>01 / INTERFACE</span><h4>Responsive web experience</h4><p>Service categories, navigation and account entry points organize the public journey across screen sizes.</p></div>
            <div><span>02 / ARCHITECTURE</span><h4>Shared platform, separate journeys</h4><p>Services and digital products have their own routes within the wider JOKI.IN web ecosystem.</p></div>
            <div><span>03 / TECHNOLOGY</span><h4>Next.js web build</h4><p>The published Digital Store page references Next.js-generated assets. Backend and integrations are not independently verified here.</p></div>
            <div><span>04 / DEVELOPMENT</span><h4>Interface to integration</h4><p>The repository includes catalog and checkout interfaces. Their runtime behavior requires authenticated end-to-end validation.</p></div>
          </div>
        </section>
        <div className={styles.bottom}><span>JOKI.IN / CASE STUDY</span><button type="button" onClick={onClose}>Close case study ↑</button></div>
      </div>
    </section>
  );
}
