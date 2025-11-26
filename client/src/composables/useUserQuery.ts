import { UsersApi, type UpdateMeRequest } from '@/services'
import useApi from './useApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentUser } from 'vuefire'
import useAuth from './useAuth'

const useUserQuery = () => {
  const currentUser = useCurrentUser()
  const { apiConfig } = useApi()
  const userApi = new UsersApi(apiConfig)
  const { signOut } = useAuth()
  const queryClient = useQueryClient()

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

  const {
    mutate: mutateUserUpdate,
    mutateAsync: mutateUserUpdateAsync,
    isSuccess: isSuccessOnUpdateUser,
    isError: isErrorOnUpdateUser,
    isPending: isPendingOnUpdateUser,
  } = useMutation({
    mutationFn: async (params: UpdateMeRequest) => {
      if (!currentUser.value) {
        throw new Error('No current user')
      }
      const resp = await userApi.updateMe({
        updateMeRequest: params,
      })
      return resp
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['user', currentUser.value?.uid], updatedData)
    },
    onError: (error) => {
      console.error('Error updating user:', error)
    },
  })

  const {
    mutate: mutateUserDelete,
    mutateAsync: mutateUserDeleteAsync,
    isSuccess: isSuccessOnDeleteUser,
    isError: isErrorOnDeleteUser,
    isPending: isPendingOnDeleteUser,
  } = useMutation({
    mutationFn: async () => {
      if (!currentUser.value) {
        throw new Error('No current user')
      }
      await userApi.deleteMe()
    },
    onSuccess: () => {
      queryClient.clear()
      signOut()
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
    },
  })

  return {
    user,
    isPendingOnFetchUser,
    isSuccessOnFetchUser,
    isErrorOnFetchUser,
    mutateUserUpdate,
    mutateUserUpdateAsync,
    isSuccessOnUpdateUser,
    isErrorOnUpdateUser,
    isPendingOnUpdateUser,
    mutateUserDelete,
    mutateUserDeleteAsync,
    isSuccessOnDeleteUser,
    isErrorOnDeleteUser,
    isPendingOnDeleteUser,
  }
}

export default useUserQuery
