# Interop Mission Generator

See `test-mission.json` for an example

### Notes

* all elements in `test-mission.json` must exist
* `odlcs` is currently not supported and will be ignored
* All 2-element lists represent GPS data in the form of `lat, lon`, except for `altitudes`, which is in the form `alt_min, alt_max`
* All 3-element lists represent `AerialPosition` data in the form of `lat, lon, alt`
* All 4-element lists represent `Obstacle` data in the form of `cylinder_height, cylinder_radius, lat, lon`

### Example Usage

```bash
rm mission-1.json (if the mission already exists)
./mission_generator.py test-mission.json mission-1.json
docker cp mission-1.json interop-server:/interop/server
docker exec interop-server python3 manage.py loaddata mission-1.json
```