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

export const getVehicleNotMovedQuery = `WITH NTMV AS (
    SELECT DISTINCT devid
    FROM NT
    WHERE TrackTime >= @dateFrom
      AND TrackTime <= @dateTo
      AND acc = 1
),

-- Get distinct device IDs that match the conditions in ntrec
NTREC AS (
    SELECT DISTINCT devid
    FROM NT
    WHERE TrackTime >= @dateFrom
      AND TrackTime <= @dateTo
),
-- Fetch vehicle details with employee and department information
VEHS AS (
    SELECT 
        im.Devid,
        im.VehicleNo,
        im.ItemName,
        im.VehicleTypeId,
        im.VZoneID,
        em.EmpName,
        em.EmpMobileNo,
        d.DepartmentName
    FROM ItemMaster im
    LEFT JOIN EmpMaster em ON im.EmpId = em.Empid
    LEFT JOIN Department d ON em.EmpDeptId = d.DepartmentId
    WHERE UPPER(im.ItemFlag) = 'V' 
      AND im.Devid IS NOT NULL
),

-- Fetch vehicle types
VT AS (
    SELECT VehicleTypeId, VehicleTypename
    FROM VehicleTypeMaster
),
-- Fetch zone information
ZN AS (
    SELECT ZoneID, ZoneName
    FROM ZoneMaster
)

-- Combine results
SELECT
    ROW_NUMBER() OVER (ORDER BY v.Devid) AS SrNo,
    v.DepartmentName,
    v.Devid,
    v.VehicleNo,
    vt.VehicleTypename,
    v.EmpName,
    v.EmpMobileNo,
    zn.ZoneName,
    CASE 
        WHEN nr.devid IS NULL THEN 0
        ELSE 1
    END AS NTRecord
FROM VEHS v
LEFT JOIN VT vt ON vt.VehicleTypeId = v.VehicleTypeId
LEFT JOIN ZN zn ON zn.ZoneID = v.VZoneID
LEFT JOIN NTREC nr ON nr.devid = v.Devid
LEFT JOIN NTMV nm ON nm.devid = v.Devid
WHERE nr.devid IS NULL OR nm.devid IS NULL;
`;
export const getVehicleDistanceQuery = {
  distanceQuery: `SELECT devid, vehicleno, vehicletypeid, VehicleTypename, TrackDate, Distance
FROM vDistanceTravelled
WHERE vehicleno = @vehicleno
  AND trackdate >= @datef
  AND trackdate <= @datet
ORDER BY trackdate;`,
  idleQuery: `SELECT devid, vehicleno, vehicletypeid, VehicleTypename, TrackDate, SecondsIdle
            FROM vVehicleIdle
             WHERE vehicleno = 'UP78GT8446'
              AND trackdate >= '2024-01-12 12:44:09.637'
              AND trackdate <= '2024-01-12 10:39:45.130'
            ORDER BY trackdate;`,
};
