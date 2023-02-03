export default function Video() {
  return (
    <div className="app">
      <header>
        <h1>Video Chat with Hooks</h1>
      </header>
      <main>
        <VideoChat />
      </main>
      <footer>
        <p>
          Made with{" "}
          <span role="img" aria-label="React">
            ⚛️
          </span>{" "}
          by <a href="https://twitter.com/philnash">philnash</a>
        </p>
      </footer>
    </div>
  );
}
