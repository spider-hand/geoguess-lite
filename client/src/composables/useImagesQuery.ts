import { ImagesApi } from '@/services'
import usePublicApi from './usePublicApi'
import { useQuery } from '@tanstack/vue-query'

const useImagesQuery = () => {
  const { apiConfig } = usePublicApi()
  const imagesApi = new ImagesApi(apiConfig)

  const {
    data: images,
    isPending: isPendingOnFetchImages,
    isSuccess: isSuccessOnFetchImages,
    isError: isErrorOnFetchImages,
    refetch: refetchImages,
  } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const resp = await imagesApi.getImages()
      return resp.images
    },
    staleTime: 0,
  })

  return {
    images,
    isPendingOnFetchImages,
    isSuccessOnFetchImages,
    isErrorOnFetchImages,
    refetchImages,
  }
}

export default useImagesQuery
