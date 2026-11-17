create table public.portfolio_comments (
  id uuid primary key default gen_random_uuid(),
  author text not null check (char_length(author) between 1 and 80),
  message text not null check (char_length(message) between 1 and 1000),
  avatar text check (avatar is null or (octet_length(avatar) <= 150000 and avatar ~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$')),
  created_at timestamptz not null default now()
);

alter table public.portfolio_comments enable row level security;
revoke all on public.portfolio_comments from anon, authenticated;
grant select on public.portfolio_comments to anon, authenticated;
create policy "Public can read comments" on public.portfolio_comments for select to anon, authenticated using (true);
create index portfolio_comments_created_at_idx on public.portfolio_comments (created_at desc);

create function public.submit_portfolio_comment(p_author text, p_message text, p_avatar text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_author is null or char_length(btrim(p_author)) not between 1 and 80
     or p_message is null or char_length(btrim(p_message)) not between 1 and 1000
     or (p_avatar is not null and (octet_length(p_avatar) > 150000 or p_avatar !~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$')) then
    raise exception 'Invalid comment';
  end if;
  -- ponytail: global daily cap limits anonymous abuse; use CAPTCHA and per-client limits if volume grows.
  perform pg_catalog.pg_advisory_xact_lock(7719021);
  if (select count(*) from public.portfolio_comments where created_at >= now() - interval '24 hours') >= 100 then
    raise exception 'Comment limit reached. Please try again later.';
  end if;
  insert into public.portfolio_comments(author, message, avatar) values (btrim(p_author), btrim(p_message), p_avatar);
end;
$$;
revoke all on function public.submit_portfolio_comment(text,text,text) from public;
grant execute on function public.submit_portfolio_comment(text,text,text) to anon, authenticated;
