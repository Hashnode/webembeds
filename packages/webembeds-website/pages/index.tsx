/* eslint-disable no-console */
import React, { useState, useEffect, useRef, ReactNode } from "react";

const links: any = {
	spotify: "https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ",
	gist: "https://gist.github.com/theevilhead/7ac2fbc3cda897ebd87dbe9aeac130d6",
	canva: "https://www.canva.com/design/DAET1m0_11c/jFBlYrKc8CQCb2boU9KC-A/view",
	codepen: "https://codepen.io/bsehovac/pen/EMyWVv",
	youtube: "https://www.youtube.com/watch?v=32I0Qso4sDg",
	twitter: "https://twitter.com/hashnode/status/1352525138659430400",
	instagram: "https://www.instagram.com/p/CJ2ja7Tl3S5/",
	glitch: "https://glitch.com/edit/#!/remote-hands",
	expo: "https://snack.expo.io/@girishhashnode/unnamed-snack",
	twitch: "https://www.twitch.tv/fresh",
	giphy: "https://giphy.com/gifs/cbsnews-inauguration-2021-XEMbxm9vl9JIIMcE7M",
	metascraper: "https://metascraper.js.org/",
	runkit: "https://runkit.com/runkit/welcome",
	repl: "https://repl.it/@GirishPatil4/AdvancedRespectfulGigahertz",
	soundcloud: "https://soundcloud.com/hit-jatt/jatt-disde-arjan-dhillon",
	anchor: "https://anchor.fm/startapodcast/episodes/Whats-your-podcast-about-e17krq/a-a2q3ft",
	loom: "https://www.loom.com/share/0281766fa2d04bb788eaf19e65135184",
	vimeo: "https://vimeo.com/336812660",
	// facebook: "https://www.facebook.com/MoHFWIndia/posts/1757090964450303",
	fallback: "https://hashnode.com",
};

function Index() {
	const urlRef = useRef<HTMLInputElement>(null);
	const [result, setResult] = useState<{ output: { html?: string }, error: boolean }>();

	const handleURL = async (incomingURL?: string) => {
    if (null === urlRef) {
      return;
    }
    if (null === urlRef.current) {
      return;
    }

		const url = incomingURL || (urlRef !== null ? urlRef.current.value : null);

		if (!url) {
			return;
		}

		// https://webembeds.com
		const requestURL = `/api/embed?url=${encodeURIComponent(url)}`;
		const response = await fetch(requestURL, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
    const json = await response.json();
		setResult(json ? json.data : null);
	};

	return (
		<div className="w-full mx-auto max-w-4xl">
			<h1 className="text-4xl font-semibold text-center py-12">Webembeds</h1>
			<div className="flex items-center">
        <input className="border border-black w-full p-4 text-lg" placeholder={"Enter url"} type="url" ref={urlRef} />
        <button className="p-4 bg-green-300 w-1/6 border-2 border-transparent text-lg" type="button" onClick={() => { handleURL(); }}>
          Submit
        </button>
      </div>

      <p className="py-4 text-center">Or select from below</p>

			<div>
				{Object.keys(links).map((key, index) => {
					return (
						<button
							className="m-2 p-2 bg-gray-700 text-white"
							key={index}
							onClick={() => handleURL(links[key])}
						>
							{key}
						</button>
					);
				})}
			</div>

			<br />

      <div className="grid grid-cols-3">
        <div>
          {result ? <div className="h-72 overflow-y-scroll leading-relaxed">{JSON.stringify(result)}</div> : "No result"}
        </div>
        <div className="col-span-2">
          {result && !result.error ? (
            <div className="px-2" dangerouslySetInnerHTML={{ __html: result.output.html || "" }} />
          ) : null}
          {
            result && result.error ? "Something went wrong" : ""
          }
        </div>
      </div>
		</div>
	);
}

export default Index;
