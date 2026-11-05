create or replace view public.codev_total_points as
 SELECT c.id AS codev_id,
    c.first_name,
    c.last_name,
    COALESCE(sum(cp.points), 0::bigint) AS skill_points,
    COALESCE(ap.points, 0) AS attendance_points,
    COALESCE(sum(cp.points), 0::bigint) + COALESCE(ap.points, 0) AS total_points
   FROM codev c
     LEFT JOIN codev_points cp ON c.id = cp.codev_id
     LEFT JOIN attendance_points ap ON c.id = ap.codev_id
  GROUP BY c.id, c.first_name, c.last_name, ap.points;

grant select on public.codev_total_points to anon, authenticated;

create or replace view public.mentor_users as
 SELECT codev.id
   FROM codev
  WHERE codev.internal_status = 'MENTOR'::text;

grant select on public.mentor_users to anon, authenticated;

create or replace view public.public_codev_profiles as
 SELECT codev.id,
    codev.first_name,
    codev.last_name,
    codev.image_url,
    codev.display_position,
    codev.portfolio_website,
    codev.years_of_experience,
    codev.about,
    codev.positions,
    codev.tech_stacks,
    codev.linkedin,
    codev.github
   FROM codev
  WHERE codev.availability_status = true;

grant select on public.public_codev_profiles to anon, authenticated;
