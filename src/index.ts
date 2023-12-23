import { renderToReadableStream } from 'react-dom/server';
import { createElement } from 'react';
import { type Server } from 'bun';
import serveStatic from 'serve-static-bun';

const serve = serveStatic('.');

const build = async () => {
  try {
    console.info('Building...');
    await Bun.build({
      format: 'esm',
      entrypoints: ['src/app/page.jsx'],
      external: ['*'],
      outdir: 'build',
    });
    await Bun.build({
      format: 'esm',
      entrypoints: ['src/app/_client.jsx'],
      splitting: true,
      outdir: 'build',
    });
    console.info('Build complete!');
  } catch (error: unknown) {
    console.error('Failed building', error);
  }
};

const fetch = async (request: Request, server: Server) => {
  const url = new URL(request.url);
  switch (true) {
    case url.pathname === '/':
      return new Response(
        `
                <!doctype>
                <html>
                <head>
                    <title>React Server Component from Scratch</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                    <body>
                        <div id="root"></div>
                        <script type="module" src="/build/_client.js"></script>
                    </body>
                </html>
            `,
        {
          headers: {
            'Content-Type': 'text/html charset=utf-8',
          },
        },
      );

    case url.pathname === '/rsc':
      const Page = await import('../build/page.js');
      const html = await renderToReadableStream(createElement(Page.default));
      return new Response(html);
    case url.pathname.startsWith('/build'):
      return serve(request);
  }

  return new Response('404', {
    status: 404,
  });
};

const startServer = () => {
  const server = Bun.serve({
    fetch,
  });

  console.info(`Server running at ${server.url}`);
};

const main = async () => {
  await build();
  startServer();
};

main();
