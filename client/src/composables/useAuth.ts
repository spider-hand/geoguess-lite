import { useCurrentUser, useFirebaseAuth, useIsCurrentUserLoaded } from 'vuefire'
import { signInWithPopup } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import { googleAuthProvider } from '@/lib/firebase'

const useAuth = () => {
  const isCurrentUserLoaded = useIsCurrentUserLoaded()
  const currentUser = useCurrentUser()
  const auth = useFirebaseAuth()!

  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider)
    } catch (error) {
      console.error((error as FirebaseError).code, (error as FirebaseError).message)
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('signOut error:', error)
    }
  }

  return {
    isCurrentUserLoaded,
    currentUser,
    signUpWithGoogle,
    signOut,
  }
}

export default useAuth
