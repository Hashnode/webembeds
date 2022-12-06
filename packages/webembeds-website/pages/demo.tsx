/* eslint-disable no-console */
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";

const links: any = {
	spotify: "https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ",
	gist: "https://gist.github.com/theevilhead/908d9f761a82809a33fcede797d06334",
	// canva1: "https://www.canva.com/design/DAEWSa9kfIs/view",
	// canva2: "https://www.canva.com/design/DAEWRhUKdvg/view",
	twitter: "https://twitter.com/hashnode/status/1352525138659430400",
	expo: "https://snack.expo.io/@girishhashnode/unnamed-snack",
	runkit: "https://runkit.com/runkit/welcome",
	canva: "https://www.canva.com/design/DAET1m0_11c/jFBlYrKc8CQCb2boU9KC-A/view",
	codepen: "https://codepen.io/bsehovac/pen/EMyWVv",
	youtube: "https://www.youtube.com/watch?v=32I0Qso4sDg",
	glitch: "https://glitch.com/edit/#!/remote-hands",
	twitch: "https://www.twitch.tv/fresh",
	giphy: "https://giphy.com/gifs/cbsnews-inauguration-2021-XEMbxm9vl9JIIMcE7M",
	metascraper: "https://metascraper.js.org/",
	repl: "https://repl.it/@GirishPatil4/AdvancedRespectfulGigahertz",
	soundcloud: "https://soundcloud.com/hit-jatt/jatt-disde-arjan-dhillon",
	anchor: "https://anchor.fm/startapodcast/episodes/Whats-your-podcast-about-e17krq/a-a2q3ft",
	loom: "https://www.loom.com/share/0281766fa2d04bb788eaf19e65135184",
	vimeo: "https://vimeo.com/485593347",
    snappify: "https://snappify.com/view/bcc54061-6e8f-44c5-a4f4-1abcad520108",
	fallback: "https://github.com",
};

function Demo() {
	const urlRef = useRef<HTMLInputElement>(null);
	const [result, setResult] = useState<{ output?: { html?: string }; error: boolean } | null>();
	const [isLoading, setLoading] = useState<boolean>(false);
	let parentNode: HTMLElement | null = null;

	useEffect(() => {
		parentNode = document.getElementById("embed-platform");

		if (!window) {
			return;
		}
		
		(window as any).adjustIframeSize = function(id: string, newHeight: string) {
			const ele = document.getElementById(id);
			if (!ele) return;
			ele.style.height = parseInt(newHeight) + "px";
		}

		// Can be ported to others too
		window.addEventListener("message", function(e) {
			if (e.origin !== "https://runkit.com") return;
		
			try {
				var data = JSON.parse(e.data);
			} catch (e) {
				return false;
			}
		
			if (data.context !== "iframe.resize") {
				return false;
			}
		
			const iframe: HTMLIFrameElement | null = document.querySelector("iframe[src=\"" + data.src + "\"]");
		
			if (!iframe) {
				return false;
			}
		
			iframe.setAttribute("width", "100%");
			
			if (data.height) {
				iframe.setAttribute("height", data.height);
			}
		});

		handleURL(links.vimeo);
	}, []);

	const handleURL = async (incomingURL?: string) => {
		if (null === urlRef) {
			return;
		}
		
		if (null === urlRef.current) {
			return;
		}

		parentNode = document.getElementById("embed-platform");
		if (!parentNode) {
			return;
		}
		
		const url = incomingURL || (urlRef !== null ? urlRef.current.value : null);

		if (!url) {
			return;
		}

		setLoading(true);
		setResult(null);
		parentNode.innerHTML = "";

		const requestURL = `/api/embed?url=${encodeURIComponent(url)}&customHost=${encodeURIComponent(window.location.hostname)}`;
		const response = await fetch(requestURL, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		const json = await response.json();

		setLoading(false);

		if(parentNode && !url.includes("gist.github.com")) {
			parentNode.innerHTML = json.data.output.html;
			Array.from(parentNode.querySelectorAll("script")).forEach( async oldScript => {
					const newScript = document.createElement("script");
					Array.from(oldScript.attributes).forEach( attr => newScript.setAttribute(attr.name, attr.value) );
					
					if (oldScript.innerHTML) {
							newScript.appendChild(document.createTextNode(oldScript.innerHTML));
					}

					if (oldScript && oldScript.parentNode) {
						oldScript.parentNode.replaceChild(newScript, oldScript);
					}
			});
		} else {
			 
			const gistFrame = document.createElement("iframe");
			gistFrame.setAttribute("width", "100%");
			gistFrame.setAttribute("frameBorder", "0");
			gistFrame.setAttribute("scrolling", "no");
			gistFrame.id = `gist-${new Date().getTime()}`;
			
			parentNode.innerHTML = "";
			parentNode.appendChild(gistFrame);
			
			// Create the iframe's document
			const gistFrameHTML = `<html><body onload="parent.adjustIframeSize('${gistFrame.id}', document.body.scrollHeight)">${json.data.output.html}</body></html>`;
			
			// Set iframe's document with a trigger for this document to adjust the height
			let gistFrameDoc = gistFrame.contentWindow?.document;
			
			if (gistFrame.contentDocument) {
					gistFrameDoc = gistFrame.contentDocument;
			} else if (gistFrame.contentWindow) {
					gistFrameDoc = gistFrame.contentWindow.document;
			}

			if (!gistFrameDoc) {
					return;
			}
			gistFrameDoc.open();
			gistFrameDoc.writeln(gistFrameHTML);
			gistFrameDoc.close();
		}

		// setResult(json ? json.data : null);
		setLoading(false);
	};

	return (
		<div className="w-full mx-auto max-w-4xl">
			<div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between">
				<a href="/" className="text-xl font-semibold py-6 px-3">Webembeds</a>
				<div>
					{/* <a className="github-button" href="https://github.com/hashnode" data-size="large" aria-label="Follow @hashnode on GitHub">Follow @hashnode</a>
					&nbsp; */}
					<a className="github-button" href="https://github.com/hashnode/webembeds" data-color-scheme="no-preference: light; light: dark; dark: dark;" data-icon="octicon-star" data-size="large" aria-label="Star hashnode/webembeds on GitHub">Star us on Github</a>
				</div>
			</div>

			<div className="flex flex-col">
				{/* <div>
          {result ? <div className="h-72 overflow-y-scroll leading-relaxed">{JSON.stringify(result)}</div> : "No result"}
        </div> */}
				{isLoading ? <Loader /> : null}
				{/* {result && !result.error && !isLoading ? ( */}
					<div
						id="embed-platform"
						className="shadow-2xl p-2 bg-white rounded-sm border border-gray-200"
						// dangerouslySetInnerHTML={{ __html: (result.output && result.output.html) ? result.output.html : "" }}
					/>
				{/* ) : null} */}
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

				<div className="text-center">
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
				<a href="https://hashnode.com?source=webembeds" className="text-blue-700">
					Hashnode
				</a>
			</div>
		</div>
	);
}

export default Demo;
