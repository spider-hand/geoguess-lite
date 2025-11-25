import { UsersApi } from '@/services'
import useApi from './useApi'
import { useQuery } from '@tanstack/vue-query'
import { useCurrentUser } from 'vuefire'

const useUserQuery = () => {
  const currentUser = useCurrentUser()
  const { apiConfig } = useApi()
  const userApi = new UsersApi(apiConfig)
  
  const {
    data: user,
    isPending: isPendingOnFetchUser,
    isSuccess: isSuccessOnFetchUser,
    isError: isErrorOnFetchUser,
  } = useQuery({
    queryKey: ['user', currentUser.value?.uid],
    queryFn: async () => {
      const resp = await userApi.getMe({
        getMeRequest: {
          name: currentUser.value?.displayName ?? 'New User',
        },
      })
      return resp
    },
    enabled: () => !!currentUser.value,
  })

  return {
    user,
    isPendingOnFetchUser,
    isSuccessOnFetchUser,
    isErrorOnFetchUser,
  }
}

export default useUserQuery
