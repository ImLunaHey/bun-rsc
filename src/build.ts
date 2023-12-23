export const build = async () => {
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
