import React from "react";

type Props = {};

export default function PlaceholderTransaction({}: Props) {
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ height: "36px", width: "100%" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>

      <div style={{ maxWidth: "260px", margin: "20px 30px ", height: "30px" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>
      <div style={{ maxWidth: "260px", margin: "20px 30px  ", height: "30px" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>
      <div style={{ maxWidth: "260px", margin: "20px 30px  ", height: "30px" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>
      <div style={{ height: "36px", margin: "20px 0px  ", width: "100%" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>

      <div style={{ height: "36px", margin: "10px 0px  ", width: "100%" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>

      <div style={{ height: "36px", margin: "20px 0px  ", width: "100%" }}>
        <div className="load-wraper">
          <div className="activity"></div>
        </div>
      </div>
    </div>
  );
}
