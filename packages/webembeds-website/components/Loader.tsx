import React from "react";

interface Props {}

function Loader(props: Props) {
  const {} = props

  return <div className="flex flex-col justify-center items-center" style={{ minHeight: "475px" }}>
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
}

export default Loader
