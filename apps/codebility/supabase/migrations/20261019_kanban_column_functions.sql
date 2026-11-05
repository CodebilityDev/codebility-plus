create or replace function public.delete_kanban_column(p_column_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from tasks where kanban_column_id = p_column_id;

  delete from kanban_columns where id = p_column_id;
end;
$$;

create or replace function public.create_kanban_column(
  p_board_id uuid,
  p_name text,
  p_gap integer
)
returns setof kanban_columns
language plpgsql
security invoker
set search_path = public
as $$
begin
  return query
    insert into kanban_columns (board_id, name, position)
    values (
      p_board_id,
      p_name,
      coalesce(
        (select max(position) from kanban_columns where board_id = p_board_id),
        0
      ) + p_gap
    )
    returning *;
end;
$$;
