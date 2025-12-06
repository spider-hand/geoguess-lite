import { MultiplayerRoundsApi } from '@/services'
import useApi from './useApi'

const useMultiplayerRoundsApi = () => {
  const { apiConfig } = useApi()
  const multiplayerRoundsApi = new MultiplayerRoundsApi(apiConfig)

  return { multiplayerRoundsApi }
}

export default useMultiplayerRoundsApi
