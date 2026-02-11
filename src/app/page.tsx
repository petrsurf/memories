export default function StaticHome() {
  const albums = [
    {
      id: "album-winter-kitchen",
      title: "Winter Kitchen",
      count: "18 photos",
      date: "Jan 2026",
      mood: "Morning light and warm tea.",
      privacy: "Private link",
      src: "/media/album-winter-kitchen.svg",
      alt: "Cozy kitchen scene",
    },
  ];
  return (
    <div>
      <main>
        <h1>Private Frames: Cherry Main</h1>
        <section>
          <h2>Albums</h2>
          <ul>
            {albums.map(album => (
              <li key={album.id}>
                <img src={album.src} alt={album.alt} style={{ width: 120 }} />
                <div>
                  <strong>{album.title}</strong> ({album.count})<br />
                  <em>{album.date}</em><br />
                  {album.mood}<br />
                  {album.privacy}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>About</h2>
          <p>This is a static backup homepage for the Private Frames project, deployed on GitHub Pages.</p>
        </section>
      </main>
    </div>
  );
}
