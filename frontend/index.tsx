// root-level index.tsx shim — avoids TSX parse issues in some toolchains
(async () => {
  try {
    await import('./src/main')
  } catch (e) {
    console.error('Failed to import ./src/main:', e)
    throw e
  }
})()
