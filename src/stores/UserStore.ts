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

export interface QueryOptions {
  sortField?: string
  sortOrder?: "asc" | "desc"
  genderFilter?: string | null
  dobStart?: number | null
  dobEnd?: number | null
  createdAtStart?: number | null
  createdAtEnd?: number | null
  updatedAtStart?: number | null
  updatedAtEnd?: number | null
  namePrefix?: string | null
  emailPrefix?: string | null
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
    
    const constraints: any[] = []
    
    if (options.genderFilter) {
      constraints.push(where("gender", "==", options.genderFilter))
    }
    
    const sortField = options.sortField || "createdAt"
    const sortOrder = options.sortOrder || "desc"
    
    if (options.dobStart || options.dobEnd) {
      if (options.dobStart) {
        constraints.push(where("dob", ">=", Timestamp.fromMillis(options.dobStart)))
      }
      if (options.dobEnd) {
        constraints.push(where("dob", "<=", Timestamp.fromMillis(options.dobEnd)))
      }
      constraints.push(orderBy("dob", sortOrder))
      if (sortField !== "dob") {
        constraints.push(orderBy(sortField, sortOrder))
      }
    } else if (options.createdAtStart || options.createdAtEnd) {
      if (options.createdAtStart) {
        constraints.push(where("createdAt", ">=", Timestamp.fromMillis(options.createdAtStart)))
      }
      if (options.createdAtEnd) {
        constraints.push(where("createdAt", "<=", Timestamp.fromMillis(options.createdAtEnd)))
      }
      constraints.push(orderBy("createdAt", sortOrder))
      if (sortField !== "createdAt") {
        constraints.push(orderBy(sortField, sortOrder))
      }
    } else if (options.updatedAtStart || options.updatedAtEnd) {
      if (options.updatedAtStart) {
        constraints.push(where("updatedAt", ">=", Timestamp.fromMillis(options.updatedAtStart)))
      }
      if (options.updatedAtEnd) {
        constraints.push(where("updatedAt", "<=", Timestamp.fromMillis(options.updatedAtEnd)))
      }
      constraints.push(orderBy("updatedAt", sortOrder))
      if (sortField !== "updatedAt") {
        constraints.push(orderBy(sortField, sortOrder))
      }
    } else {
      constraints.push(orderBy(sortField, sortOrder))
    }
    
    const q = query(collection(db, "users"), ...constraints)
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedUsers = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<User, "id">),
      }))
      
      if (options.namePrefix) {
        const searchLower = options.namePrefix.toLowerCase()
        fetchedUsers = fetchedUsers.filter(user => 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      }
      
      users.value = fetchedUsers
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
