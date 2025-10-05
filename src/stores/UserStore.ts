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
  where,
  Timestamp,
  type Query,
  type DocumentData
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

export interface QueryOptions {
  sortField?: string
  sortOrder?: "asc" | "desc"
  genderFilter?: string | null
}

export const useUserStore = defineStore("userStore", () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const unsubscribers: (() => void)[] = []

  const fetchUsers = (options: QueryOptions = {}) => {
    if (unsubscribers.length > 0) {
      unsubscribers.forEach(unsub => unsub())
      unsubscribers.length = 0
    }

    loading.value = true
    
    let q: Query<DocumentData> = collection(db, "users")
    
    if (options.genderFilter) {
      q = query(q, where("gender", "==", options.genderFilter))
    }
    
    const sortField = options.sortField || "createdAt"
    const sortOrder = options.sortOrder || "desc"
    q = query(q, orderBy(sortField, sortOrder))
    
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
