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
      ast_leaderboard: {
        Row: {
          google_user_id: string
          points: number
        }
        Insert: {
          google_user_id?: string
          points?: number
        }
        Update: {
          google_user_id?: string
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "ast_leaderboard_google_user_id_fkey"
            columns: ["google_user_id"]
            isOneToOne: true
            referencedRelation: "public_user_data"
            referencedColumns: ["google_user_id"]
          },
        ]
      }
      ast_location_logs: {
        Row: {
          did_type_purpose: boolean
          did_use_custom_time: boolean
          google_user_id: string
          location: string
          log_id: string
          purpose: string
          timestamp: string
        }
        Insert: {
          did_type_purpose?: boolean
          did_use_custom_time?: boolean
          google_user_id?: string
          location?: string
          log_id?: string
          purpose?: string
          timestamp?: string
        }
        Update: {
          did_type_purpose?: boolean
          did_use_custom_time?: boolean
          google_user_id?: string
          location?: string
          log_id?: string
          purpose?: string
          timestamp?: string
        }
        Relationships: []
      }
      maint_leaderboard: {
        Row: {
          google_user_id: string
          points: number
        }
        Insert: {
          google_user_id?: string
          points?: number
        }
        Update: {
          google_user_id?: string
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "maint_leaderboard_google_user_id_fkey"
            columns: ["google_user_id"]
            isOneToOne: true
            referencedRelation: "public_user_data"
            referencedColumns: ["google_user_id"]
          },
        ]
      }
      maint_location_logs: {
        Row: {
          did_type_purpose: boolean
          did_use_custom_time: boolean
          google_user_id: string
          location: string
          log_id: string
          purpose: string
          timestamp: string
        }
        Insert: {
          did_type_purpose?: boolean
          did_use_custom_time?: boolean
          google_user_id?: string
          location?: string
          log_id?: string
          purpose?: string
          timestamp?: string
        }
        Update: {
          did_type_purpose?: boolean
          did_use_custom_time?: boolean
          google_user_id?: string
          location?: string
          log_id?: string
          purpose?: string
          timestamp?: string
        }
        Relationships: []
      }
      public_user_data: {
        Row: {
          avatar_url: string | null
          full_name: string
          google_user_id: string
          profile: Database["public"]["Enums"]["Profiles"]
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string
          google_user_id?: string
          profile?: Database["public"]["Enums"]["Profiles"]
        }
        Update: {
          avatar_url?: string | null
          full_name?: string
          google_user_id?: string
          profile?: Database["public"]["Enums"]["Profiles"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_user_points: {
        Args: {
          google_user_id: string
          profile: string
          amount: number
        }
        Returns: number
      }
    }
    Enums: {
      Profiles: "ast" | "maint"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
