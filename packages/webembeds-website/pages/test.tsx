/* eslint-disable no-console */
import React, { useRef, useState } from "react";
import axios from "axios";

function Index() {
  const urlRef = useRef<HTMLInputElement>(null);
  const [isEmbedVisible, setEmbedVisible] = useState(false);
  const [embedData, setEmbedData] = useState({} as any);

  const onSubmit = () => {
    const url = urlRef?.current?.value || "";

    axios.get(`/api/embed/?url=${encodeURIComponent(url)}`)
      .then((res) => {
        console.log(res);
        setEmbedVisible(true);
        setEmbedData(res.data.data.oEmbed);
      })
      .catch(console.log);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
      <input ref={urlRef} type="url" style={{ width: "1000px" }}/>
      <button type="button" onClick={onSubmit}>Submit</button>
      {
        isEmbedVisible
        && <div dangerouslySetInnerHTML={{ __html: embedData ? embedData.html : "" }} />
      }
      </form>
    </>
  );
}

export default Index;
