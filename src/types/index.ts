export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  title: string
  description: string
  author: string
  price: number
  chapters: Chapter[]
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  story_id: string
  title: string
  content: string
  order: number
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  story_id: string
  status: 'active' | 'cancelled' | 'completed'
  current_chapter: number
  created_at: string
  updated_at: string
}
