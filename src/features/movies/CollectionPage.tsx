import { Seo } from "@/lib/seo/Seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MediaGrid } from "@/components/media/MediaGrid";
import { SubPageHeader } from "@/components/media/SubPageHeader";
import { ErrorState, PageLoading } from "@/components/ui/states";
import NotFoundPage from "@/features/NotFoundPage";
import { useCollectionQuery, useMovieQuery } from "@/lib/tmdb/api";
import { useNumericParam } from "@/hooks/useNumericParam";
import { moviePath } from "@/lib/slug";
import { posterUrl } from "@/lib/tmdb/images";
import { truncate } from "@/lib/format";

export default function CollectionPage() {
  const movieId = useNumericParam("id");
  const collectionId = useNumericParam("collectionId");

  const collection = useCollectionQuery(collectionId!, {
    skip: collectionId == null,
  });
  const movie = useMovieQuery(movieId!, { skip: movieId == null });

  if (collectionId == null) return <NotFoundPage />;
  if (collection.isLoading) return <PageLoading label="Loading collection" />;
  if (collection.isError || !collection.data) {
    return (
      <Container className="py-16">
        <ErrorState
          title="Collection not found"
          onRetry={collection.refetch}
        />
      </Container>
    );
  }

  const data = collection.data;
  const canonicalPath = movieId
    ? `/movie/${movieId}/collection/${data.id}`
    : `/movie/${data.parts[0]?.id ?? 0}/collection/${data.id}`;

  const parentPath = movie.data
    ? moviePath(movie.data.id, movie.data.title)
    : "/movies";
  const parentLabel = movie.data?.title ?? "Movies";

  const description =
    data.overview ||
    `${data.name} is a collection of ${data.parts.length} films: ${data.parts
      .map((part) => part.title)
      .join(", ")}.`;

  return (
    <>
      <Seo
        title={data.name}
        description={truncate(description, 155)}
        canonicalPath={canonicalPath}
        image={posterUrl(data.poster_path, 780)}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Movies", path: "/movies" },
            { name: data.name, path: canonicalPath },
          ]),
          itemListJsonLd(
            data.name,
            data.parts.map((part) => ({
              id: part.id,
              title: part.title,
              path: moviePath(part.id, part.title),
              image: posterUrl(part.poster_path, 342),
            })),
          ),
        ]}
      />

      <SubPageHeader
        title={data.name}
        subtitle={`Collection - ${data.parts.length} films`}
        posterPath={data.poster_path}
        parentPath={parentPath}
        parentLabel={parentLabel}
      />

      <Container width="full" className="pb-12">
        {data.overview && (
          <p className="mx-auto mb-10 max-w-prose text-center text-sm leading-relaxed text-gray-300 sm:text-base">
            {data.overview}
          </p>
        )}

        <section aria-labelledby="films-heading">
          <SectionHeader
            id="films-heading"
            title="Films in this collection"
            count={data.parts.length}
          />
          <MediaGrid
            label={`Films in ${data.name}`}
            items={data.parts}
            mediaType="movie"
            showOverview
            emptyTitle="This collection has no films listed"
          />
        </section>
      </Container>
    </>
  );
}
