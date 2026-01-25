import { Configuration } from '@/services'

const usePublicApi = () => {
  const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_PUBLIC_API_BASE_URL,
    headers: {
      'x-api-key': import.meta.env.VITE_PUBLIC_API_KEY,
    },
  })

  return { apiConfig }
}

export default usePublicApi
