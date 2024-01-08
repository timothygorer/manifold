
create table if not exists
    user_seen_markets (
                          id bigint generated always as identity primary key,
                          user_id text not null,
                          contract_id text not null,
                          data jsonb null,
                          created_time timestamptz not null default now(),
                          -- so far we have: 'view market' or 'view market card'
                          type text not null default 'view market',
                          is_promoted boolean null
    );

create or replace function user_seen_market_populate_cols () returns trigger language plpgsql as $$ begin
    if new.data is not null then
        new.is_promoted := ((new.data)->'isPromoted')::boolean;
    end if;
    return new;
end $$;

create trigger user_seen_market_populate before insert or update on user_seen_markets for each row
execute function user_seen_market_populate_cols ();


alter table user_seen_markets enable row level security;

drop policy if exists "self and admin read" on user_seen_markets;

create policy "self and admin read" on user_seen_markets for
    select
    using (user_id = firebase_uid() or is_admin(firebase_uid()));

drop policy if exists "user can insert" on user_seen_markets;

create policy "user can insert" on user_seen_markets for insert
    with
    check (true);

create index if not exists user_seen_markets_created_time_desc_idx on user_seen_markets (user_id, contract_id, created_time desc);

create index if not exists user_seen_markets_type_created_time_desc_idx on user_seen_markets (
                                                                                              contract_id,
                                                                                              type,
                                                                                              created_time desc
    );

create index if not exists user_seen_markets_user_type_created_time_desc_idx on user_seen_markets (
                                                                                                   user_id,
                                                                                                   type,
                                                                                                   created_time desc
    );

alter table user_seen_markets
    cluster on user_seen_markets_created_time_desc_idx;
