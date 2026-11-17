import React, { useEffect, useRef, useState } from 'react';
import styles from './Contact.module.css';

type Comment = { id: string; author: string; message: string; avatar: string | null; created_at: string };
const endpoint = 'https://aelagbiyhsblqjxittlw.supabase.co/rest/v1';
const publishableKey = 'sb_publishable_aJQSCHFLcYBActrQd-yJNg_ltsgu9Ed';
const headers = { apikey: publishableKey, 'Content-Type': 'application/json' };

async function makeAvatar(file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG, or WebP image under 5 MB.');
    const bitmap = await createImageBitmap(file);
    try {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not process the photo.');
        const size = Math.min(bitmap.width, bitmap.height);
        ctx.drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, 160, 160);
        return canvas.toDataURL('image/jpeg', 0.8);
    } finally { bitmap.close(); }
}

export const Comments: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        const controller = new AbortController();
        fetch(`${endpoint}/portfolio_comments?select=id,author,message,avatar,created_at&order=created_at.desc&limit=${limit}`, { headers, signal: controller.signal })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => { setComments(data); setLoaded(true); })
            .catch(() => { if (!controller.signal.aborted) setStatus('Could not load comments. Please try again later.'); });
        return () => controller.abort();
    }, [limit]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy || !name.trim() || !message.trim()) return;
        setBusy(true); setStatus('');
        try {
            const avatar = photo ? await makeAvatar(photo) : null;
            const response = await fetch(`${endpoint}/rpc/submit_portfolio_comment`, {
                method: 'POST', headers,
                body: JSON.stringify({ p_author: name.trim(), p_message: message.trim(), p_avatar: avatar }),
            });
            if (!response.ok) throw new Error('Could not send your comment. Please try again later.');
            setName(''); setMessage(''); setPhoto(null);
            if (fileRef.current) fileRef.current.value = '';
            setStatus('Comment sent.');
            const list = await fetch(`${endpoint}/portfolio_comments?select=id,author,message,avatar,created_at&order=created_at.desc&limit=${limit}`, { headers });
            if (!list.ok) throw new Error('Comment sent, but the list could not be refreshed.');
            setComments(await list.json());
        } catch (error) { setStatus(error instanceof Error ? error.message : 'Something went wrong.'); }
        finally { setBusy(false); }
    };
    return <div className={styles.guestbookWrapper}>
        <div className={styles.guestbookHeader}>
            <div className={styles.guestbookEyebrow}>Guestbook</div>
            <h3 className={styles.guestbookTitle}>Leave a comment</h3>
            <p className={styles.guestbookSubtitle}>Your name, comment, and optional photo will be visible to everyone.</p>
        </div>
        <form className={styles.guestbookForm} onSubmit={submit}>
            <div className={styles.formGroup}><label className={styles.inputLabel} htmlFor="comment-name">Name</label><input className={styles.textInput} id="comment-name" value={name} onChange={e => setName(e.target.value)} maxLength={80} required /></div>
            <div className={styles.formGroup}><label className={styles.inputLabel} htmlFor="comment-message">Comment</label><textarea className={styles.textareaInput} id="comment-message" value={message} onChange={e => setMessage(e.target.value)} maxLength={1000} required /></div>
            <div className={styles.formGroup}><label className={styles.inputLabel} htmlFor="comment-photo">Profile photo (optional, max 5 MB)</label><input ref={fileRef} className={styles.textInput} id="comment-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhoto(e.target.files?.[0] || null)} /></div>
            <button className={styles.submitBtn} type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send comment'}</button>
            <p className={styles.statusMsg} role="status">{status}</p>
        </form>
        <div className={styles.entriesList} aria-label="Comments">
            {loaded && comments.length === 0 && <p className={styles.guestbookSubtitle}>No comments yet.</p>}
            {comments.map(comment => <article className={styles.entryCard} key={comment.id}>
                <div className={styles.entryHeader}><div className={styles.commentAuthor}>{comment.avatar ? <img className={styles.commentAvatar} src={comment.avatar} alt="" /> : <span className={styles.commentAvatarPlaceholder} aria-hidden="true">{comment.author.charAt(0).toUpperCase()}</span>}<strong>{comment.author}</strong></div><time className={styles.entryDate} dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString()}</time></div>
                <p className={styles.entryComment}>{comment.message}</p>
            </article>)}
            {comments.length === limit && <button type="button" onClick={() => setLimit(limit + 20)}>Show more comments</button>}
        </div>
        <p className={styles.guestbookSubtitle}><a href="https://github.com/Jokitugasbykay/kayla-universe/discussions" target="_blank" rel="noopener noreferrer">Previous GitHub comments</a></p>
    </div>;
};
