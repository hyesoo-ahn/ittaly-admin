import React from "react";
import logo from "../images/logo.png";

export default function ErrorPage() {
  return (
    <div className="error-body">
      <div>
        <img src={logo} style={{ width: 180, height: "auto" }} />
      </div>
      <h1 className="mt-20 mb-10">404.</h1>
      <h2 className="margin-0 mb-10">Page Not Found</h2>
      <p>The resouce requested could not be found on this server.</p>
    </div>
  );
}
