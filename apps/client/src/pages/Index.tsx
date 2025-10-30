const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
          Welcome
        </h1>
        <p className="text-muted-foreground mb-10">
          A clean boilerplate to get you started. Build fast with a familiar
          stack.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <a
            href="https://turbo.build/pack"
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
          >
            <img
              src="/icons/turbopack.svg"
              alt="Turbopack"
              className="h-10 w-full object-contain opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-muted-foreground">Turbopack</div>
          </a>

          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
          >
            <img
              src="https://cdn.simpleicons.org/react/61DAFB"
              alt="React"
              className="h-10 w-full object-contain opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-muted-foreground">React</div>
          </a>

          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
          >
            <img
              src="https://cdn.simpleicons.org/vite/646CFF"
              alt="Vite"
              className="h-10 w-full object-contain opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-muted-foreground">Vite</div>
          </a>

          <a
            href="https://expressjs.com"
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
          >
            <img
              src="https://cdn.simpleicons.org/express/ffffff"
              alt="Express"
              className="h-10 w-full object-contain opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-muted-foreground">Express</div>
          </a>

          <a
            href="https://www.mongodb.com"
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
          >
            <img
              src="https://cdn.simpleicons.org/mongodb/47A248"
              alt="MongoDB"
              className="h-10 w-full object-contain opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-muted-foreground">MongoDB</div>
          </a>

          <a
            href="https://nodejs.org"
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
          >
            <img
              src="https://cdn.simpleicons.org/nodedotjs/5FA04E"
              alt="Node.js"
              className="h-10 w-full object-contain opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="mt-2 text-xs text-muted-foreground">Node.js</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
