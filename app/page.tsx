"use client"

import Hls from "hls.js";
import { useEffect } from "react";
import {
  makeProviders,
  makeStandardFetcher,
  targets,
} from "xstormtv-providers";

export default function Home() {
  useEffect(() => {
    const myFetcher = makeStandardFetcher(fetch);
    // make an instance of the providers library
    const providers = makeProviders({
      fetcher: myFetcher,
      // will be played on a native video player
      target: targets.NATIVE,
    });

    const media = {
      type: "movie" as const,
      title: "The Book of Eli",
      releaseYear: 2010,
      tmdbId: "20504",
    };

    // const media = {
    //   type: "movie" as const,
    //   title: "Captain America: Brave New World",
    //   releaseYear: 2025,
    //   tmdbId: "822119",
    // };

    const scrape = async () => {
      const res = await providers.runAll({
        media: media,
      });
      if (!res?.stream) {
        return console.log("no stream found!!");
      }
      const stream = res.stream;
      if (stream?.type === "file") {
        const qualityEntries = stream?.qualities;
        const qualityKey = Object.keys(
          qualityEntries
        )[0] as keyof typeof qualityEntries;
        const qualityList = qualityEntries[qualityKey];
        console.log("url", qualityList?.url);
      } else {
        const qualityEntries = stream?.playlist;
        console.log("hlsURL", qualityEntries);
        if (Hls.isSupported()) {
          var video = document.getElementById("video") as HTMLMediaElement;
          if (video) {
            var hls = new Hls();
            hls.loadSource(stream.playlist);
            hls.attachMedia(video);
          }
        } else {
          console.log("hls not supported");
        }
      }
    };

    scrape();
  }, []);

  return (
    <>
      <video id="video" width="640" height="360" controls></video>
    </>
  );
}
