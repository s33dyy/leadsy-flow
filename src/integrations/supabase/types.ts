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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_id: string | null
          actor_label: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["activity_kind"]
          summary: string
          target_id: string | null
          target_type: string | null
          workspace_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["activity_kind"]
          summary: string
          target_id?: string | null
          target_type?: string | null
          workspace_id: string
        }
        Update: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["activity_kind"]
          summary?: string
          target_id?: string | null
          target_type?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["approval_kind"]
          lead_id: string | null
          payload: Json
          preview: string | null
          priority: Database["public"]["Enums"]["approval_priority"]
          requested_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["approval_status"]
          subject: string
          updated_at: string
          worker_name: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["approval_kind"]
          lead_id?: string | null
          payload?: Json
          preview?: string | null
          priority?: Database["public"]["Enums"]["approval_priority"]
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          subject: string
          updated_at?: string
          worker_name?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["approval_kind"]
          lead_id?: string | null
          payload?: Json
          preview?: string | null
          priority?: Database["public"]["Enums"]["approval_priority"]
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          subject?: string
          updated_at?: string
          worker_name?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          channel: Database["public"]["Enums"]["conversation_channel"]
          contact_name: string | null
          created_at: string
          id: string
          important: boolean
          last_message_at: string | null
          lead_id: string | null
          subject: string | null
          unread_count: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["conversation_channel"]
          contact_name?: string | null
          created_at?: string
          id?: string
          important?: boolean
          last_message_at?: string | null
          lead_id?: string | null
          subject?: string | null
          unread_count?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["conversation_channel"]
          contact_name?: string | null
          created_at?: string
          id?: string
          important?: boolean
          last_message_at?: string | null
          lead_id?: string | null
          subject?: string | null
          unread_count?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["integration_kind"]
          last_sync_at: string | null
          status: Database["public"]["Enums"]["integration_status"]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["integration_kind"]
          last_sync_at?: string | null
          status?: Database["public"]["Enums"]["integration_status"]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["integration_kind"]
          last_sync_at?: string | null
          status?: Database["public"]["Enums"]["integration_status"]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_findings: {
        Row: {
          body: string | null
          confidence: number | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["knowledge_kind"]
          lead_id: string | null
          source: string | null
          title: string
          workspace_id: string
        }
        Insert: {
          body?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["knowledge_kind"]
          lead_id?: string | null
          source?: string | null
          title: string
          workspace_id: string
        }
        Update: {
          body?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["knowledge_kind"]
          lead_id?: string | null
          source?: string | null
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_findings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_findings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          lead_id: string
          workspace_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          lead_id: string
          workspace_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          city: string | null
          code: string | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          last_activity_at: string | null
          name: string
          notes: string | null
          owner_id: string | null
          phone: string | null
          qualification: Database["public"]["Enums"]["lead_qualification"]
          score: number
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[]
          title: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          city?: string | null
          code?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          last_activity_at?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          qualification?: Database["public"]["Enums"]["lead_qualification"]
          score?: number
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[]
          title?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          city?: string | null
          code?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          last_activity_at?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          qualification?: Database["public"]["Enums"]["lead_qualification"]
          score?: number
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[]
          title?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_generated: boolean
          author: string | null
          body: string
          conversation_id: string
          created_at: string
          direction: Database["public"]["Enums"]["message_direction"]
          id: string
          sent_at: string
          workspace_id: string
        }
        Insert: {
          ai_generated?: boolean
          author?: string | null
          body: string
          conversation_id: string
          created_at?: string
          direction: Database["public"]["Enums"]["message_direction"]
          id?: string
          sent_at?: string
          workspace_id: string
        }
        Update: {
          ai_generated?: boolean
          author?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["message_direction"]
          id?: string
          sent_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      tasks: {
        Row: {
          ai_generated: boolean
          approval_state: string | null
          assignee_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_at: string | null
          id: string
          lead_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          ai_generated?: boolean
          approval_state?: string | null
          assignee_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          ai_generated?: boolean
          approval_state?: string | null
          assignee_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_executions: {
        Row: {
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          id: string
          started_at: string
          status: Database["public"]["Enums"]["execution_status"]
          worker_id: string
          workspace_id: string
        }
        Insert: {
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["execution_status"]
          worker_id: string
          workspace_id: string
        }
        Update: {
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["execution_status"]
          worker_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_executions_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_executions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          approval_mode: Database["public"]["Enums"]["worker_approval_mode"]
          config: Json
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["worker_kind"]
          last_run_at: string | null
          name: string
          output_count: number
          queue_count: number
          status: Database["public"]["Enums"]["worker_status"]
          success_rate: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          approval_mode?: Database["public"]["Enums"]["worker_approval_mode"]
          config?: Json
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["worker_kind"]
          last_run_at?: string | null
          name: string
          output_count?: number
          queue_count?: number
          status?: Database["public"]["Enums"]["worker_status"]
          success_rate?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          approval_mode?: Database["public"]["Enums"]["worker_approval_mode"]
          config?: Json
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["worker_kind"]
          last_run_at?: string | null
          name?: string
          output_count?: number
          queue_count?: number
          status?: Database["public"]["Enums"]["worker_status"]
          success_rate?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_workspace_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
          _workspace_id: string
        }
        Returns: boolean
      }
      is_workspace_admin: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_kind:
        | "research"
        | "qualify"
        | "message"
        | "approval"
        | "task"
        | "convert"
        | "create"
        | "update"
        | "delete"
      app_role: "owner" | "admin" | "member"
      approval_kind:
        | "research"
        | "task"
        | "note"
        | "draft"
        | "outreach"
        | "action"
      approval_priority: "p0" | "p1" | "p2"
      approval_status: "pending" | "approved" | "rejected"
      conversation_channel:
        | "whatsapp"
        | "instagram"
        | "messenger"
        | "email"
        | "sms"
      execution_status: "running" | "success" | "failure"
      integration_kind:
        | "meta"
        | "whatsapp"
        | "openrouter"
        | "n8n"
        | "extension"
        | "other"
      integration_status: "connected" | "disconnected" | "error"
      knowledge_kind: "finding" | "note" | "summary" | "signal" | "change"
      lead_qualification: "hot" | "warm" | "cold" | "unqualified"
      lead_source:
        | "instagram"
        | "whatsapp"
        | "meta_ads"
        | "extension"
        | "manual"
        | "referral"
        | "other"
      lead_status:
        | "new"
        | "researching"
        | "qualified"
        | "engaged"
        | "converted"
        | "lost"
      message_direction: "in" | "out"
      task_priority: "urgent" | "high" | "medium" | "low"
      task_status: "todo" | "in_progress" | "blocked" | "done"
      worker_approval_mode: "auto" | "required" | "manual"
      worker_kind:
        | "research"
        | "qualifier"
        | "outreach"
        | "summarizer"
        | "enricher"
        | "custom"
      worker_status: "running" | "idle" | "failed" | "paused"
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
    Enums: {
      activity_kind: [
        "research",
        "qualify",
        "message",
        "approval",
        "task",
        "convert",
        "create",
        "update",
        "delete",
      ],
      app_role: ["owner", "admin", "member"],
      approval_kind: [
        "research",
        "task",
        "note",
        "draft",
        "outreach",
        "action",
      ],
      approval_priority: ["p0", "p1", "p2"],
      approval_status: ["pending", "approved", "rejected"],
      conversation_channel: [
        "whatsapp",
        "instagram",
        "messenger",
        "email",
        "sms",
      ],
      execution_status: ["running", "success", "failure"],
      integration_kind: [
        "meta",
        "whatsapp",
        "openrouter",
        "n8n",
        "extension",
        "other",
      ],
      integration_status: ["connected", "disconnected", "error"],
      knowledge_kind: ["finding", "note", "summary", "signal", "change"],
      lead_qualification: ["hot", "warm", "cold", "unqualified"],
      lead_source: [
        "instagram",
        "whatsapp",
        "meta_ads",
        "extension",
        "manual",
        "referral",
        "other",
      ],
      lead_status: [
        "new",
        "researching",
        "qualified",
        "engaged",
        "converted",
        "lost",
      ],
      message_direction: ["in", "out"],
      task_priority: ["urgent", "high", "medium", "low"],
      task_status: ["todo", "in_progress", "blocked", "done"],
      worker_approval_mode: ["auto", "required", "manual"],
      worker_kind: [
        "research",
        "qualifier",
        "outreach",
        "summarizer",
        "enricher",
        "custom",
      ],
      worker_status: ["running", "idle", "failed", "paused"],
    },
  },
} as const
