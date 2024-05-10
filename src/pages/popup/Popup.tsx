import React from "react";
import withSuspense from "@src/shared/hoc/withSuspense";
import withErrorBoundary from "@src/shared/hoc/withErrorBoundary";
import byt from "@assets/img/icons/logo.png";

const Popup = () => {
  return (
    <div className="">
      It works
      <img alt="d" src={byt} />
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>
);
