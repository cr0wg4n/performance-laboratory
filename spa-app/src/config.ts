function defineConfig() {
  return {
    apiHost: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    pagination: {
      defaultPage: 1,
      defaultLimit: 1000,
    },
  } as const
}

export const config = defineConfig()
