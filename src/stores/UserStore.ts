import { defineStore } from "pinia"
import { ref, onUnmounted } from "vue"
import { db } from "../firebase/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore"

export interface User {
  id: string
  name: string
  email: string
  dob: Timestamp | null
  gender: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const useUserStore = defineStore("userStore", () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const unsubscribers: (() => void)[] = []

  const fetchUsers = () => {
    loading.value = true
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      users.value = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<User, "id">),
      }))
      loading.value = false
    })
    unsubscribers.push(unsubscribe)
  }

  const addUser = async (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    await addDoc(collection(db, "users"), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  const updateUser = async (id: string, data: Partial<User>) => {
    const docRef = doc(db, "users", id)
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
  }

  const deleteUser = async (id: string) => {
    const docRef = doc(db, "users", id)
    await deleteDoc(docRef)
  }

  const stopListening = () => {
    unsubscribers.forEach((unsub) => unsub())
  }

  onUnmounted(stopListening)

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  }
})
