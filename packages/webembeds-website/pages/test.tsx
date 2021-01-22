/* eslint-disable no-console */
import React, { useRef, useState } from "react";
import axios from "axios";

function Index() {
  const urlRef = useRef<HTMLInputElement>(null);
  const [isEmbedVisible, setEmbedVisible] = useState(false);
  const [embedData, setEmbedData] = useState({} as any);
  const [currentURL, setURL] = useState("");

  const onSubmit = () => {
    const url = urlRef?.current?.value || "";

    setURL(url);

    // axios.get(`/api/embed/?url=${encodeURIComponent(url)}`)
    //   .then((res) => {
    //     console.log(res.data.data.output);
    //     setEmbedVisible(true);
    //     if (res.data.data.output && res.data.data.output.html) {
    //       setEmbedData(res.data.data.output.html);
    //     } else {
    //       setEmbedData(res.data.data.output);
    //     }
    //   })
    //   .catch(console.log);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
      <input ref={urlRef} type="url" style={{ width: "1000px" }}/>
      <button type="button" onClick={onSubmit}>Submit</button>
      {/* {
        isEmbedVisible
        && <div dangerouslySetInnerHTML={{ __html: embedData || "None" }} />
      } */}
      </form>
      {
        currentURL ? (
            <div style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              paddingTop: "56.25%",
              height: "100%",
            }}>
              <iframe style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              src={`/api/html?url=${currentURL}`}/>
            </div>
        ) : "Enter url"
      }
    </>
  );
}

export default Index;
