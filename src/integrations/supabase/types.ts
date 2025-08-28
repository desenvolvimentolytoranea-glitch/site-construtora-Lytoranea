export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          revoked: boolean
          token: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at?: string
          id?: string
          revoked?: boolean
          token?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          revoked?: boolean
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      portfolio_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_main: boolean | null
          project_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_main?: boolean | null
          project_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_main?: boolean | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category_id: string
          client: string | null
          created_at: string
          description: string | null
          id: string
          location: string
          main_image_url: string | null
          slug: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          category_id: string
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location: string
          main_image_url?: string | null
          slug: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          category_id?: string
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          main_image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "portfolio_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          display_order: number
          full_description: string | null
          icon: string | null
          id: string
          image_url: string | null
          short_description: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          full_description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          short_description: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          full_description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          short_description?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_portfolio_image: {
        Args: {
          p_alt_text: string
          p_display_order: number
          p_image_url: string
          p_is_main: boolean
          p_project_id: string
          p_token: string
        }
        Returns: string
      }
      admin_create_session: {
        Args: { admin_email: string; admin_password: string }
        Returns: Json
      }
      admin_delete_client: {
        Args: { p_id: string; p_token: string }
        Returns: undefined
      }
      admin_delete_portfolio_category: {
        Args: { p_id: string; p_token: string }
        Returns: undefined
      }
      admin_delete_portfolio_image: {
        Args: { p_image_id: string; p_token: string }
        Returns: undefined
      }
      admin_delete_portfolio_project: {
        Args: { p_id: string; p_token: string }
        Returns: undefined
      }
      admin_logout: {
        Args: { p_token: string }
        Returns: undefined
      }
      admin_remove_client_logo: {
        Args: { p_client_id: string; p_token: string }
        Returns: undefined
      }
      admin_remove_service_image: {
        Args: { p_service_id: string; p_token: string }
        Returns: undefined
      }
      admin_set_main_portfolio_image: {
        Args: { p_image_id: string; p_token: string }
        Returns: undefined
      }
      admin_update_client_logo: {
        Args: { p_client_id: string; p_logo_url: string; p_token: string }
        Returns: undefined
      }
      admin_update_service_image: {
        Args: { p_image_url: string; p_service_id: string; p_token: string }
        Returns: undefined
      }
      admin_upsert_client: {
        Args: {
          p_display_order: number
          p_id: string
          p_is_active: boolean
          p_logo_url: string
          p_name: string
          p_slug: string
          p_token: string
          p_website: string
        }
        Returns: string
      }
      admin_upsert_portfolio_category: {
        Args: { p_id: string; p_name: string; p_slug: string; p_token: string }
        Returns: string
      }
      admin_upsert_portfolio_project: {
        Args: {
          p_category_id: string
          p_client: string
          p_description: string
          p_id: string
          p_location: string
          p_main_image_url: string
          p_slug: string
          p_title: string
          p_token: string
          p_year: string
        }
        Returns: string
      }
      admin_upsert_service: {
        Args: {
          p_display_order: number
          p_full_description: string
          p_icon: string
          p_id: string
          p_image_url: string
          p_short_description: string
          p_slug: string
          p_title: string
          p_token: string
        }
        Returns: string
      }
      authenticate_admin: {
        Args: { admin_email: string; admin_password: string }
        Returns: Json
      }
      get_admin_id_from_token: {
        Args: { p_token: string }
        Returns: string
      }
      is_admin_session: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
