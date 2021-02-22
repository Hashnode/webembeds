/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";

const links: any = {
	spotify: "https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ",
	gist: "https://gist.github.com/theevilhead/7ac2fbc3cda897ebd87dbe9aeac130d6",
	canva: "https://www.canva.com/design/DAET1m0_11c/jFBlYrKc8CQCb2boU9KC-A/view",
	canva1: "https://www.canva.com/design/DAEWSa9kfIs/view",
	canva2: "https://www.canva.com/design/DAEWRhUKdvg/view",
	codepen: "https://codepen.io/bsehovac/pen/EMyWVv",
	youtube: "https://www.youtube.com/watch?v=32I0Qso4sDg",
	twitter: "https://twitter.com/hashnode/status/1352525138659430400",
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
	fallback: "https://hashnode.com",
};

function Demo() {
	const urlRef = useRef<HTMLInputElement>(null);
	const embedRef = useRef<HTMLInputElement>(null);
	const [result, setResult] = useState<{ output: { html?: string }; error: boolean }>();
	const [isLoading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		handleURL(links.anchor);
	}, []);

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

		setLoading(true);

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

		setLoading(false);
		setResult(json ? json.data : null);
		setLoading(false);
	};

	return (
		<div className="w-full mx-auto max-w-4xl">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-xl font-semibold py-6 px-3">Webembeds</h1>
			</div>

			<div className="flex flex-col">
				{/* <div>
          {result ? <div className="h-72 overflow-y-scroll leading-relaxed">{JSON.stringify(result)}</div> : "No result"}
        </div> */}
				{isLoading ? <Loader /> : null}
				{result && !result.error && !isLoading ? (
					<div
						className="shadow-2xl p-2 bg-white rounded-sm border border-gray-200"
						dangerouslySetInnerHTML={{ __html: result.output.html || "" }}
						// ref={embedRef}
					/>
				) : null}
				{result && result.error ? "Something went wrong" : ""}
			</div>

			<br />

			<div className="max-w-3xl mx-auto">
				<div className="flex items-center">
					<input
						className="border border-gray-500 rounded-sm w-full p-3 px-6 text-lg mr-2 cursor-pointer"
						placeholder={"Enter url"}
						type="url"
						ref={urlRef}
					/>
					<button
						className="p-3 bg-blue-700 text-white w-1/6 border-2 border-transparent text-lg rounded-sm"
						type="button"
						onClick={() => {
							handleURL();
						}}
					>
						Submit
					</button>
				</div>

				<p className="py-4 text-center">Or select from below</p>

				<div>
					{Object.keys(links).map((key, index) => {
						return (
							<button
								className="mx-1 my-1 p-1 px-4 bg-gray-700 text-white rounded-sm capitalize"
								key={index}
								onClick={() => handleURL(links[key])}
							>
								{key}
							</button>
						);
					})}
				</div>
			</div>
			<div className="max-w-3xl mx-auto pt-32 pb-4 text-center">
				Made with ❤️ &nbsp; by{" "}
				<a href="https://hashnode.com" className="text-blue-700">
					Hashnode
				</a>
			</div>
		</div>
	);
}

export default Demo;
