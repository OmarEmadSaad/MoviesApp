import { memo } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/Image";
import { profileSrcSet, profileUrl } from "@/lib/tmdb/images";
import { personPath } from "@/lib/slug";

export const PersonCard = memo(function PersonCard({
  id,
  name,
  role,
  profilePath,
  size = "md",
}: {
  id: number;
  name: string;

  role?: string | null;
  profilePath: string | null;
  size?: "sm" | "md";
}) {
  return (
    <article className="group h-full overflow-hidden rounded-lg bg-gray-800 shadow-sm transition hover:shadow-md">
      <Link
        to={personPath(id, name)}
        className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
      >
        <Image
          src={profileUrl(profilePath, 185)}
          srcSet={profileSrcSet(profilePath)}
          sizes={size === "sm" ? "120px" : "185px"}
          alt={`Photo of ${name}`}
          aspect="profile"
          imgClassName="transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
        />
        <div className="p-2 text-center">
          <h3 className="truncate text-sm font-medium text-white">{name}</h3>
          {role && <p className="truncate text-xs text-gray-400">{role}</p>}
        </div>
      </Link>
    </article>
  );
});
