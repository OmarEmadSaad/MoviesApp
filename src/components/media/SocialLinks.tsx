import {
  FaFacebook,
  FaImdb,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsWikipedia } from "react-icons/bs";
import type { IconType } from "react-icons";
import type { ExternalIds } from "@/types/tmdb";

type Kind = "movie" | "tv" | "person";

export function SocialLinks({
  ids,
  homepage,
  name,
  kind = "movie",
}: {
  ids: ExternalIds | undefined;
  homepage?: string | null;
  name: string;
  kind?: Kind;
}) {
  const imdbPath =
    kind === "person" ? "name" : kind === "tv" ? "title" : "title";

  const links: { href: string; label: string; Icon: IconType; hover: string }[] =
    [];

  const push = (
    id: string | null | undefined,
    build: (id: string) => string,
    label: string,
    Icon: IconType,
    hover: string,
  ) => {
    if (id) links.push({ href: build(id), label, Icon, hover });
  };

  push(
    ids?.facebook_id,
    (id) => `https://www.facebook.com/${id}`,
    `${name} on Facebook`,
    FaFacebook,
    "hover:text-blue-500",
  );
  push(
    ids?.twitter_id,
    (id) => `https://twitter.com/${id}`,
    `${name} on X (Twitter)`,
    FaTwitter,
    "hover:text-blue-400",
  );
  push(
    ids?.instagram_id,
    (id) => `https://www.instagram.com/${id}`,
    `${name} on Instagram`,
    FaInstagram,
    "hover:text-pink-500",
  );
  push(
    ids?.youtube_id,
    (id) => `https://www.youtube.com/${id}`,
    `${name} on YouTube`,
    FaYoutube,
    "hover:text-red-500",
  );
  push(
    ids?.tiktok_id,
    (id) => `https://www.tiktok.com/@${id}`,
    `${name} on TikTok`,
    FaTiktok,
    "hover:text-white",
  );
  push(
    ids?.imdb_id,
    (id) => `https://www.imdb.com/${imdbPath}/${id}`,
    `${name} on IMDb`,
    FaImdb,
    "hover:text-yellow-500",
  );
  push(
    ids?.wikidata_id,
    (id) => `https://www.wikidata.org/wiki/${id}`,
    `${name} on Wikidata`,
    BsWikipedia,
    "hover:text-white",
  );
  push(
    homepage,
    (url) => url,
    `Official website for ${name}`,
    AiFillHome,
    "hover:text-light-blue-400",
  );

  if (!links.length) return null;

  return (
    <ul className="flex flex-wrap items-center gap-4">
      {links.map(({ href, label, Icon, hover }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={`block rounded text-gray-300 transition ${hover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400`}
          >
            <Icon aria-hidden="true" className="h-6 w-6" />
          </a>
        </li>
      ))}
    </ul>
  );
}
