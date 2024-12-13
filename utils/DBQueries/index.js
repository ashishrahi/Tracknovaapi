export const probWireTampQuery = `WITH FilteredNT AS (
  SELECT  devid, MAX(TrackTime) AS LatestTrackTime
  FROM NT
  WHERE cast(TrackTime as date) = @date
    AND acc = 0
    AND speed > 10 group by devid
),
JoinedData AS (
  SELECT 
    im.Devid,
    im.ItemMasterId,
    ISNULL(im.VehicleNo, '') AS VehicleNo,
    im.EmpId,
    ISNULL(em.EmpDeptId, 0) AS EmpDeptId,
    ISNULL(dm.DepartmentName, '') AS DepartmentName
  FROM ItemMaster im
  INNER JOIN FilteredNT fn ON im.Devid = fn.devid
  LEFT JOIN EmpMaster em ON im.EmpId = em.Empid
  LEFT JOIN Department dm ON em.EmpDeptId = dm.DepartmentId
)

SELECT
  ROW_NUMBER() OVER (ORDER BY jd.Devid) AS srno,
  lt.LatestTrackTime AS date,
  jd.ItemMasterId,
  jd.VehicleNo,
  jd.Devid,
  jd.EmpDeptId AS DeptId,
  jd.DepartmentName
FROM JoinedData jd
LEFT JOIN FilteredNT lt ON jd.Devid = lt.devid
`;
