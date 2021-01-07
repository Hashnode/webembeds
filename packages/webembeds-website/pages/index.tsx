import React from "react";

interface Props {}

function Index(props: Props) {
  const { temp } = props;

  return (
    <h1>Webembed {temp || ""}</h1>
  );
}

export default Index;
