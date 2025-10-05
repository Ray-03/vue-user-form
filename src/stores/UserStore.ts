import { defineStore } from 'pinia'

export interface User {
  id: string
  name: string
  email: string
  dob: Date
  gender: string
  createdAt: Date
  updatedAt: Date
}

export const useUserStore = defineStore('user', {
  state: (): { users: User[] } => ({
    users: [] 
  }),

  actions: {
    addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
      const now = new Date()
      this.users.push({
        ...user,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      })
    },

    deleteUser(id: string) {
      this.users = this.users.filter(u => u.id !== id)
    },

    updateUser(id: string, data: User) {
      const idx = this.users.findIndex(u => u.id === id)
      if (idx !== -1) {
        this.users[idx] = { ...this.users[idx], ...data, updatedAt: new Date() }
      }
    }
  }
})
