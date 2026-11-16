import React, { useState, useEffect } from 'react';
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
            const stored = localStorage.getItem('kayla_portfolio_local_notes_v2');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setEntries(parsed.filter((v: unknown): v is GuestbookEntry => {
                        if (!v || typeof v !== 'object')
                            return false;
                        const e = v as Record<string, unknown>;
                        return ['id', 'name', 'role', 'comment', 'timestamp'].every(k => typeof e[k] === 'string') && String(e.name).length <= 80 && String(e.comment).length <= 1000;
                    }).slice(0, 20));
                }
            }
        }
        catch {
            // Fallback to initial
        }
    }, []);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim() || name.length > 80 || role.length > 120 || comment.length > 1000) {
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
        const updated = [newEntry, ...entries].slice(0, 20);
        setEntries(updated);
        try {
            localStorage.setItem('kayla_portfolio_local_notes_v2', JSON.stringify(updated));
        }
        catch {
            setStatusMessage('Storage is unavailable. This note will last only until the page closes.');
            return;
        }
        setName('');
        setRole('');
        setComment('');
        setStatusMessage('Saved on this browser only.');
    };
    return (<div className={styles.guestbookWrapper}>
      <div className={styles.guestbookHeader}>
        <div className={styles.guestbookEyebrow}>Local notes demo</div>
        <h3 className={styles.guestbookTitle}>Try a note on this browser</h3>
        <p className={styles.guestbookSubtitle}>
          Notes stay in this browser only. They are not sent to Kayla or shared with other visitors.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.guestbookForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="gb-name" className={styles.inputLabel}>
              Your Name *
            </label>
            <input id="gb-name" maxLength={80} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Tan" className={styles.textInput} required/>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gb-role" className={styles.inputLabel}>
              Role / Affiliation
            </label>
            <input id="gb-role" maxLength={120} type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Student / Engineer" className={styles.textInput}/>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gb-comment" className={styles.inputLabel}>
            Message *
          </label>
          <textarea id="gb-comment" maxLength={1000} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a brief note..." className={styles.textareaInput} required/>
        </div>

        <div className={styles.formSubmitRow}>
          <button type="submit" className={styles.submitBtn}>
            Save locally
          </button>
          {statusMessage && <span role="status" className={styles.statusMsg}>{statusMessage}</span>}
        </div>
      </form>

      {/* Entries List */}
      <div className={styles.entriesList}>
        {entries.length === 0 && <p>No local notes yet.</p>}
        {entries.slice(0, 5).map((entry) => (<div key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div className={styles.entryAuthor}>
                <span className={styles.authorName}>{entry.name}</span>
                <span className={styles.authorRole}>/ {entry.role}</span>
              </div>
              <span className={styles.entryDate}>{entry.timestamp}</span>
            </div>
            <p className={styles.entryComment}>{entry.comment}</p>
          </div>))}
      </div>
    </div>);
};
