import { Link } from "react-router-dom";
import { Image } from "@/components/ui/Image";
import { profileSrcSet, profileUrl } from "@/lib/tmdb/images";
import { personPath } from "@/lib/slug";

export function PersonRow({
  id,
  name,
  role,
  profilePath,
}: {
  id: number;
  name: string;
  role?: string | null;
  profilePath: string | null;
}) {
  return (
    <li>
      <Link
        to={personPath(id, name)}
        className="flex items-center gap-4 rounded-lg bg-gray-800 p-3 transition hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
      >
        <Image
          src={profileUrl(profilePath, 185)}
          srcSet={profileSrcSet(profilePath)}
          sizes="80px"
          alt={`Photo of ${name}`}
          aspect="profile"
          className="w-20 shrink-0 rounded-md"
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{name}</p>
          {role && <p className="truncate text-sm text-gray-400">{role}</p>}
        </div>
      </Link>
    </li>
  );
}
