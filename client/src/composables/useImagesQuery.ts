import { ImagesApi } from '@/services'
import usePublicApi from './usePublicApi'
import { useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

const useImagesQuery = (onlyPanorama: MaybeRefOrGetter<boolean>) => {
  const { apiConfig } = usePublicApi()
  const imagesApi = new ImagesApi(apiConfig)

  const {
    data: images,
    isPending: isPendingOnFetchImages,
    isSuccess: isSuccessOnFetchImages,
    isError: isErrorOnFetchImages,
    isFetching: isFetchingOnFetchImages,
    refetch: refetchImages,
  } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const resp = await imagesApi.getImages({ isPano: toValue(onlyPanorama) })
      return resp.images
    },
    staleTime: 0,
  })

  return {
    images,
    isPendingOnFetchImages,
    isSuccessOnFetchImages,
    isErrorOnFetchImages,
    isFetchingOnFetchImages,
    refetchImages,
  }
}

export default useImagesQuery
