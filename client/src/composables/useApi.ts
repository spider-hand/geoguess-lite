import { Configuration } from '@/services'
import { useCurrentUser } from 'vuefire'

const useApi = () => {
  const currentUser = useCurrentUser()

  const customFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const token = await currentUser.value?.getIdToken()

    const initWithToken = {
      ...init,
      headers: new Headers({
        Authorization: `${token}`,
      }),
    }
    return await fetch(input, initWithToken)
  }

  const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_API_BASE_URL,
    fetchApi: customFetch,
  })

  return { apiConfig }
}

export default useApi
