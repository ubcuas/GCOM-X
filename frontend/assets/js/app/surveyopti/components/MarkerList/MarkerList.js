import React from "react";
import { useGlobalContext } from "../../contex";
// import { FaTrashAlt } from "react-icons/fa";
import "./style.scss";

const MarkerList = () => {
  const { markers, setMarkers } = useGlobalContext();

  const deleteMarker = (markerId) => {
    let newMarkers = markers.filter(({ id, position }) => id != markerId);
    newMarkers = newMarkers.map(({ id, position }, i) => ({ id: i, position }));
    setMarkers(newMarkers);
  };

  const handleCalc = () => {};

  return (
    <section className="marker-list">
      <div>
        <div className="marker-element">
          <p className="marker-num">Marker ID</p>
          <p className="marker-coord">Marker Coord</p>
        </div>
        {markers.map(({ id, position }) => (
          <div className="marker-element" key={id}>
            <p className="marker-num">{id}</p>
            <p className="marker-coord">{`[${
              Math.round(position.lat * 100) / 100
            }, ${Math.round(position.lng * 100) / 100}]`}</p>
            <div onClick={() => deleteMarker(id)}>x</div>
            {/* <FaTrashAlt /> */}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button className="clear-calc" onClick={() => setMarkers([])}>
          Clear
        </button>
        <button className="clear-calc" onClick={handleCalc}>
          Calculate
        </button>
      </div>
    </section>
  );
};

export default MarkerList;
