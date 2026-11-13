import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_GUESTBOOK } from '../../data/portfolio';
import { GuestbookEntry } from '../../types/portfolio';
import styles from './Contact.module.css';

export const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK);
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kayla_portfolio_guestbook');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setStatusMessage('Please enter both your name and message.');
      return;
    }

    const newEntry: GuestbookEntry = {
      id: `entry-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Visitor',
      comment: comment.trim(),
      timestamp: new Date().toISOString().split('T')[0]
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem('kayla_portfolio_guestbook', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setName('');
    setRole('');
    setComment('');
    setStatusMessage('Note recorded. Thank you for visiting.');

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#60a5fa', '#a78bfa', '#cbd5e1']
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      setStatusMessage('');
    }, 4000);
  };

  return (
    <div className={styles.guestbookWrapper}>
      <div className={styles.guestbookHeader}>
        <div className={styles.guestbookEyebrow}>INTERACTIVE GUESTBOOK</div>
        <h3 className={styles.guestbookTitle}>Leave a note or reflection</h3>
        <p className={styles.guestbookSubtitle}>
          Say hello, leave feedback on the 3D physics lanyard, or propose a collaboration.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.guestbookForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="gb-name" className={styles.inputLabel}>
              Your Name *
            </label>
            <input
              id="gb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Tan"
              className={styles.textInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gb-role" className={styles.inputLabel}>
              Role / Affiliation
            </label>
            <input
              id="gb-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Student / Engineer"
              className={styles.textInput}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gb-comment" className={styles.inputLabel}>
            Message *
          </label>
          <textarea
            id="gb-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a brief note..."
            className={styles.textareaInput}
            required
          />
        </div>

        <div className={styles.formSubmitRow}>
          <button type="submit" className={styles.submitBtn}>
            Post Note
          </button>
          {statusMessage && <span className={styles.statusMsg}>{statusMessage}</span>}
        </div>
      </form>

      {/* Entries List */}
      <div className={styles.entriesList}>
        {entries.slice(0, 5).map((entry) => (
          <div key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div className={styles.entryAuthor}>
                <span className={styles.authorName}>{entry.name}</span>
                <span className={styles.authorRole}>/ {entry.role}</span>
              </div>
              <span className={styles.entryDate}>{entry.timestamp}</span>
            </div>
            <p className={styles.entryComment}>{entry.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
