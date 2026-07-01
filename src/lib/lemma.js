import { LemmaClient } from 'lemma-sdk'

const rootClient = new LemmaClient({
  apiUrl: import.meta.env.VITE_LEMMA_API_URL,
  authUrl: import.meta.env.VITE_LEMMA_AUTH_URL,
})

/** Lemma client — auth and deployment only. AI inference uses src/services/ai.js */
export const lemmaClient = rootClient.withPod(
  import.meta.env.VITE_LEMMA_POD_ID
)
