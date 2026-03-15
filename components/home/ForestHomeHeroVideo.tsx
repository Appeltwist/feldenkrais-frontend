type ForestHomeHeroVideoProps = {
  videoId: string;
  title: string;
  posterImage: string;
};

export default function ForestHomeHeroVideo({
  videoId,
  title,
  posterImage,
}: ForestHomeHeroVideoProps) {
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;

  return (
    <div aria-hidden="true" className="fh-home-hero__media">
      <div
        className="fh-home-hero__poster"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2, 13, 14, 0.08), rgba(2, 13, 14, 0.45)), url(${posterImage})`,
        }}
      />
      <div className="fh-home-hero__video-frame">
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          className="fh-home-hero__iframe"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embedUrl}
          tabIndex={-1}
          title={title}
        />
      </div>
    </div>
  );
}
