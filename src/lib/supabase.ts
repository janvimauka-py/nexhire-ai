import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          college: string | null
          branch: string | null
          graduation_year: number | null
          skills: string[] | null
          career_interests: string[] | null
          target_companies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      interviews: {
        Row: {
          id: string
          user_id: string
          type: string
          company: string | null
          difficulty: string
          duration_minutes: number | null
          overall_score: number | null
          technical_score: number | null
          communication_score: number | null
          coding_score: number | null
          feedback: string | null
          questions: any[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['interviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['interviews']['Insert']>
      }
      coding_submissions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          language: string
          code: string
          status: string
          runtime: number | null
          memory: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coding_submissions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['coding_submissions']['Insert']>
      }
      resume_analyses: {
        Row: {
          id: string
          user_id: string
          file_name: string
          ats_score: number | null
          feedback: any | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['resume_analyses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['resume_analyses']['Insert']>
      }
    }
  }
}
