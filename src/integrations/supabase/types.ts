export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      career_conversations: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      career_insights: {
        Row: {
          content: string
          created_at: string
          id: string
          insight_type: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          insight_type: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      career_paths: {
        Row: {
          created_at: string
          id: string
          path_data: Json
          steps: Json
          target_career: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          path_data: Json
          steps: Json
          target_career: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path_data?: Json
          steps?: Json
          target_career?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_readiness_metrics: {
        Row: {
          calculated_at: string
          experience_score: number
          id: string
          improvement_areas: Json | null
          market_alignment_score: number
          network_score: number
          overall_score: number
          skills_score: number
          user_id: string
        }
        Insert: {
          calculated_at?: string
          experience_score: number
          id?: string
          improvement_areas?: Json | null
          market_alignment_score: number
          network_score: number
          overall_score: number
          skills_score: number
          user_id: string
        }
        Update: {
          calculated_at?: string
          experience_score?: number
          id?: string
          improvement_areas?: Json | null
          market_alignment_score?: number
          network_score?: number
          overall_score?: number
          skills_score?: number
          user_id?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          created_at: string
          id: string
          path_data: Json
          resources: Json
          target_skill: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          path_data: Json
          resources: Json
          target_skill: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path_data?: Json
          resources?: Json
          target_skill?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      market_trends: {
        Row: {
          created_at: string
          data_source: string | null
          id: string
          industry: string
          job_title: string
          trend_data: Json
          trend_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          id?: string
          industry: string
          job_title: string
          trend_data: Json
          trend_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_source?: string | null
          id?: string
          industry?: string
          job_title?: string
          trend_data?: Json
          trend_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      network_connections: {
        Row: {
          company: string | null
          connection_name: string
          connection_title: string | null
          connection_type: string | null
          created_at: string
          id: string
          industry: string | null
          interaction_frequency: string | null
          last_interaction_date: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          connection_name: string
          connection_title?: string | null
          connection_type?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          interaction_frequency?: string | null
          last_interaction_date?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          connection_name?: string
          connection_title?: string | null
          connection_type?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          interaction_frequency?: string | null
          last_interaction_date?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_assessments: {
        Row: {
          assessment_results: Json | null
          created_at: string
          id: string
          recommended_jobs: Json | null
          skill_gaps: Json | null
          skills: Json
          target_job_title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_results?: Json | null
          created_at?: string
          id?: string
          recommended_jobs?: Json | null
          skill_gaps?: Json | null
          skills: Json
          target_job_title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_results?: Json | null
          created_at?: string
          id?: string
          recommended_jobs?: Json | null
          skill_gaps?: Json | null
          skills?: Json
          target_job_title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          ai_response: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          status: string
          task_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_response?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          career_goals: string[] | null
          created_at: string
          experience_level: string | null
          id: string
          location: string | null
          preferred_industries: string[] | null
          remote_preference: boolean | null
          salary_range: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          career_goals?: string[] | null
          created_at?: string
          experience_level?: string | null
          id: string
          location?: string | null
          preferred_industries?: string[] | null
          remote_preference?: boolean | null
          salary_range?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          career_goals?: string[] | null
          created_at?: string
          experience_level?: string | null
          id?: string
          location?: string | null
          preferred_industries?: string[] | null
          remote_preference?: boolean | null
          salary_range?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
