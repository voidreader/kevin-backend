export const OLD_Q_COPY_LIST_BG = `
SELECT bg_id id
, project_id 
, image_name
, image_url
, image_key
, bucket
, game_scale
, sortkey
, 0 is_public
, NULL speaker
, 'bg' image_type
FROM pier.list_bg
WHERE project_id = ?
ORDER BY bg_id;`;

// 피어 데이터 복사 - 미니컷
export const OLD_Q_COPY_LIST_MINICUT = `
SELECT minicut_id id
, 'minicut' image_type 
, project_id
, image_name
, image_url
, image_key
, bucket
, sortkey
, offset_x
, offset_y
, game_scale
, is_public
, speaker
FROM pier.list_minicut
WHERE project_id = ?
ORDER BY minicut_id;
`;

// 피어 데이터 복사 - 미니컷 로컬라이제이션
export const OLD_Q_COPY_LIST_MINICUT_LANG = `
SELECT a.minicut_id resource_id
     , a.minicut_type resource_type
     , a.lang
     , a.public_name
     , a.summary 
  FROM pier.list_minicut_lang a
WHERE a.minicut_id = ?
  AND a.minicut_type = ?;
`;

// 피어 데이터 복사 - 미니컷 썸네일 정보
export const OLD_Q_COPY_LIST_MINICUT_THUMBNAIL = `
SELECT pier.fn_get_design_info(lm.thumbnail_id, 'url') thumbnail_url
, pier.fn_get_design_info(lm.thumbnail_id, 'key') thumbnail_key
, 'carpestore' bucket
, appear_episode 
, lm.minicut_id 
FROM pier.list_minicut lm 
WHERE lm.minicut_id = ?;
`;
