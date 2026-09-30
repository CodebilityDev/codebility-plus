// Generated from the live schema. Do not edit by hand.
// Regenerate from apps/codebility with:
//   npx supabase gen types typescript --project-id <ref> > types/global/supabase.ts
// The token is read from SUPABASE_ACCESS_TOKEN in .env.
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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          banner_image: string | null
          category: string | null
          content: string | null
          created_at: string
          id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          banner_image?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_image?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      applicant: {
        Row: {
          can_do_mobile: boolean | null
          codev_id: string | null
          commitment_signed_at: string | null
          created_at: string
          fork_url: string | null
          id: string
          joined_discord: boolean
          joined_messenger: boolean
          last_reminded_date: string | null
          quiz_completed_at: string | null
          quiz_passed: boolean | null
          quiz_score: number | null
          quiz_total: number | null
          reminded_count: number | null
          signature_data: string | null
          test_taken: string | null
          updated_at: string
        }
        Insert: {
          can_do_mobile?: boolean | null
          codev_id?: string | null
          commitment_signed_at?: string | null
          created_at?: string
          fork_url?: string | null
          id?: string
          joined_discord?: boolean
          joined_messenger?: boolean
          last_reminded_date?: string | null
          quiz_completed_at?: string | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          quiz_total?: number | null
          reminded_count?: number | null
          signature_data?: string | null
          test_taken?: string | null
          updated_at?: string
        }
        Update: {
          can_do_mobile?: boolean | null
          codev_id?: string | null
          commitment_signed_at?: string | null
          created_at?: string
          fork_url?: string | null
          id?: string
          joined_discord?: boolean
          joined_messenger?: boolean
          last_reminded_date?: string | null
          quiz_completed_at?: string | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          quiz_total?: number | null
          reminded_count?: number | null
          signature_data?: string | null
          test_taken?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicant_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applicant_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applicant_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "applicant_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applicant_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          company_name: string
          created_at: string | null
          email: string
          features_needed: string | null
          first_name: string
          id: string
          industry: string | null
          interest_level: number | null
          last_name: string
          meeting_tool_other: string | null
          meeting_type: string
          other_requirements: string | null
          phone_number: string
          project_type: string | null
          referral_source: string | null
          service_interest: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          company_name: string
          created_at?: string | null
          email: string
          features_needed?: string | null
          first_name: string
          id?: string
          industry?: string | null
          interest_level?: number | null
          last_name: string
          meeting_tool_other?: string | null
          meeting_type: string
          other_requirements?: string | null
          phone_number: string
          project_type?: string | null
          referral_source?: string | null
          service_interest?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          company_name?: string
          created_at?: string | null
          email?: string
          features_needed?: string | null
          first_name?: string
          id?: string
          industry?: string | null
          interest_level?: number | null
          last_name?: string
          meeting_tool_other?: string | null
          meeting_type?: string
          other_requirements?: string | null
          phone_number?: string
          project_type?: string | null
          referral_source?: string | null
          service_interest?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          codev_id: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          project_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          codev_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          project_id?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          codev_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "attendance_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
        ]
      }
      attendance_points: {
        Row: {
          codev_id: string | null
          created_at: string | null
          id: string
          last_updated: string | null
          points: number | null
          updated_at: string | null
        }
        Insert: {
          codev_id?: string | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          points?: number | null
          updated_at?: string | null
        }
        Update: {
          codev_id?: string | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "attendance_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: true
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_notification_preferences_20260220: {
        Row: {
          created_at: string | null
          email_digest: boolean | null
          email_digest_frequency: string | null
          email_enabled: boolean | null
          in_app_enabled: boolean | null
          push_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          type_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_digest?: boolean | null
          email_digest_frequency?: string | null
          email_enabled?: boolean | null
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          type_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_digest?: boolean | null
          email_digest_frequency?: string | null
          email_enabled?: boolean | null
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          type_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges_discord: {
        Row: {
          badge_icon_url: string | null
          badge_name: string
          created_at: string | null
          description: string | null
          id: number
        }
        Insert: {
          badge_icon_url?: string | null
          badge_name: string
          created_at?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          badge_icon_url?: string | null
          badge_name?: string
          created_at?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      client_outreach: {
        Row: {
          admin_id: string
          client_company: string | null
          client_email: string | null
          client_name: string | null
          conversation_image: string | null
          created_at: string
          id: string
          job_link: string | null
          notes: string | null
          outreach_date: string
          updated_at: string
          week_start: string
        }
        Insert: {
          admin_id: string
          client_company?: string | null
          client_email?: string | null
          client_name?: string | null
          conversation_image?: string | null
          created_at?: string
          id?: string
          job_link?: string | null
          notes?: string | null
          outreach_date?: string
          updated_at?: string
          week_start: string
        }
        Update: {
          admin_id?: string
          client_company?: string | null
          client_email?: string | null
          client_name?: string | null
          conversation_image?: string | null
          created_at?: string
          id?: string
          job_link?: string | null
          notes?: string | null
          outreach_date?: string
          updated_at?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_outreach_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_outreach_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_outreach_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "client_outreach_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_outreach_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          client_type: string | null
          company_logo: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          name: string
          phone_number: string | null
          status: string | null
          testimony: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          client_type?: string | null
          company_logo?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          phone_number?: string | null
          status?: string | null
          testimony?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          client_type?: string | null
          company_logo?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          phone_number?: string | null
          status?: string | null
          testimony?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      codev: {
        Row: {
          about: string | null
          address: string | null
          application_status: string | null
          availability_status: boolean | null
          created_at: string | null
          date_applied: string | null
          date_joined: string | null
          date_passed: string | null
          discord: string | null
          display_position: string | null
          email_address: string
          facebook: string | null
          first_name: string
          github: string | null
          headline: string | null
          id: string
          image_url: string | null
          internal_status: string | null
          landing_rank_score: number
          last_name: string
          level: Json | null
          linkedin: string | null
          mentor_id: string | null
          nda_document: string | null
          nda_request_sent: boolean | null
          nda_signature: string | null
          nda_signed_at: string | null
          nda_status: boolean | null
          phone_number: string | null
          portfolio_website: string | null
          positions: string[] | null
          promote_declined: boolean | null
          rejected_count: number | null
          role_id: number | null
          tech_stacks: string[] | null
          updated_at: string | null
          username: string | null
          username_updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          application_status?: string | null
          availability_status?: boolean | null
          created_at?: string | null
          date_applied?: string | null
          date_joined?: string | null
          date_passed?: string | null
          discord?: string | null
          display_position?: string | null
          email_address: string
          facebook?: string | null
          first_name: string
          github?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          internal_status?: string | null
          landing_rank_score?: number
          last_name: string
          level?: Json | null
          linkedin?: string | null
          mentor_id?: string | null
          nda_document?: string | null
          nda_request_sent?: boolean | null
          nda_signature?: string | null
          nda_signed_at?: string | null
          nda_status?: boolean | null
          phone_number?: string | null
          portfolio_website?: string | null
          positions?: string[] | null
          promote_declined?: boolean | null
          rejected_count?: number | null
          role_id?: number | null
          tech_stacks?: string[] | null
          updated_at?: string | null
          username?: string | null
          username_updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          about?: string | null
          address?: string | null
          application_status?: string | null
          availability_status?: boolean | null
          created_at?: string | null
          date_applied?: string | null
          date_joined?: string | null
          date_passed?: string | null
          discord?: string | null
          display_position?: string | null
          email_address?: string
          facebook?: string | null
          first_name?: string
          github?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          internal_status?: string | null
          landing_rank_score?: number
          last_name?: string
          level?: Json | null
          linkedin?: string | null
          mentor_id?: string | null
          nda_document?: string | null
          nda_request_sent?: boolean | null
          nda_signature?: string | null
          nda_signed_at?: string | null
          nda_status?: boolean | null
          phone_number?: string | null
          portfolio_website?: string | null
          positions?: string[] | null
          promote_declined?: boolean | null
          rejected_count?: number | null
          role_id?: number | null
          tech_stacks?: string[] | null
          updated_at?: string | null
          username?: string | null
          username_updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "codev_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "codev_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_codev_roles"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      codev_points: {
        Row: {
          codev_id: string | null
          created_at: string | null
          id: string
          period_type: string | null
          points: number | null
          skill_category_id: string | null
          updated_at: string | null
        }
        Insert: {
          codev_id?: string | null
          created_at?: string | null
          id?: string
          period_type?: string | null
          points?: number | null
          skill_category_id?: string | null
          updated_at?: string | null
        }
        Update: {
          codev_id?: string | null
          created_at?: string | null
          id?: string
          period_type?: string | null
          points?: number | null
          skill_category_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codev_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "codev_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codev_points_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_category"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_mentions: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          mentioned_user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          mentioned_user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          mentioned_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          client_id: string | null
          codev_id: string | null
          contract_type: string | null
          created_at: string | null
          end_date: string | null
          id: string
          payment_amount: number | null
          payment_schedule: string | null
          payment_type: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          codev_id?: string | null
          contract_type?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_amount?: number | null
          payment_schedule?: string | null
          payment_type?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          codev_id?: string | null
          contract_type?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_amount?: number | null
          payment_schedule?: string | null
          payment_type?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "contracts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          achievements: string | null
          codev_id: string | null
          created_at: string | null
          degree: string | null
          description: string | null
          end_date: string | null
          id: string
          institution: string
          major_subject: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string | null
          codev_id?: string | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution: string
          major_subject?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string | null
          codev_id?: string | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string
          major_subject?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "education_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      feature_modals: {
        Row: {
          badge: string | null
          created_at: string | null
          cta_href: string | null
          cta_label: string | null
          dismiss_label: string | null
          features: Json | null
          headline: string
          id: string
          image_url: string | null
          is_active: boolean | null
          subheadline: string | null
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          cta_href?: string | null
          cta_label?: string | null
          dismiss_label?: string | null
          features?: Json | null
          headline: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          cta_href?: string | null
          cta_label?: string | null
          dismiss_label?: string | null
          features?: Json | null
          headline?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      guilds_discord: {
        Row: {
          active: boolean | null
          created_at: string | null
          icon_url: string | null
          id: string
          left_at: string | null
          name: string
          owner_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          icon_url?: string | null
          id: string
          left_at?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          left_at?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      help_ticket_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          ticket_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          ticket_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          ticket_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "help_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "help_ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      help_ticket_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_ticket_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "help_ticket_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "help_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      help_tickets: {
        Row: {
          author_id: string
          created_at: string
          description: string
          id: string
          status: string
          tags: string[]
          ticket_number: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          description: string
          id?: string
          status?: string
          tags?: string[]
          ticket_number: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string
          id?: string
          status?: string
          tags?: string[]
          ticket_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_tickets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_tickets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_tickets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "help_tickets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "help_tickets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          created_at: string | null
          email: string
          experience: string | null
          first_name: string
          github: string | null
          id: string
          job_id: string | null
          last_name: string
          linkedin: string | null
          notes: string | null
          phone: string
          portfolio: string | null
          referred_by: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          created_at?: string | null
          email: string
          experience?: string | null
          first_name: string
          github?: string | null
          id?: string
          job_id?: string | null
          last_name: string
          linkedin?: string | null
          notes?: string | null
          phone: string
          portfolio?: string | null
          referred_by?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          experience?: string | null
          first_name?: string
          github?: string | null
          id?: string
          job_id?: string | null
          last_name?: string
          linkedin?: string | null
          notes?: string | null
          phone?: string
          portfolio?: string | null
          referred_by?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "job_applications_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          created_at: string | null
          created_by: string | null
          department: string
          description: string
          id: string
          level: string | null
          location: string
          posted_date: string | null
          remote: boolean | null
          requirements: string[] | null
          salary_range: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department: string
          description: string
          id?: string
          level?: string | null
          location: string
          posted_date?: string | null
          remote?: boolean | null
          requirements?: string[] | null
          salary_range?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department?: string
          description?: string
          id?: string
          level?: string | null
          location?: string
          posted_date?: string | null
          remote?: boolean | null
          requirements?: string[] | null
          salary_range?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "job_listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_status: {
        Row: {
          codev_id: string | null
          company_name: string
          created_at: string | null
          description: string | null
          employment_type: string
          hours_per_week: number | null
          id: string
          job_title: string
          salary_range: string | null
          shift: string | null
          status: string | null
          updated_at: string | null
          work_setup: string
        }
        Insert: {
          codev_id?: string | null
          company_name: string
          created_at?: string | null
          description?: string | null
          employment_type: string
          hours_per_week?: number | null
          id?: string
          job_title: string
          salary_range?: string | null
          shift?: string | null
          status?: string | null
          updated_at?: string | null
          work_setup: string
        }
        Update: {
          codev_id?: string | null
          company_name?: string
          created_at?: string | null
          description?: string | null
          employment_type?: string
          hours_per_week?: number | null
          id?: string
          job_title?: string
          salary_range?: string | null
          shift?: string | null
          status?: string | null
          updated_at?: string | null
          work_setup?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_job_status_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_job_status_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_job_status_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "fk_job_status_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_job_status_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_boards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kanban_boards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kanban_boards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
        ]
      }
      kanban_columns: {
        Row: {
          board_id: string | null
          created_at: string | null
          id: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          board_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          position: number
          updated_at?: string | null
        }
        Update: {
          board_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kanban_columns_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "kanban_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_sprints: {
        Row: {
          board_id: string | null
          created_at: string
          end_at: string
          id: string
          name: string | null
          project_id: string | null
          start_at: string
          updated_at: string | null
        }
        Insert: {
          board_id?: string | null
          created_at?: string
          end_at: string
          id?: string
          name?: string | null
          project_id?: string | null
          start_at: string
          updated_at?: string | null
        }
        Update: {
          board_id?: string | null
          created_at?: string
          end_at?: string
          id?: string
          name?: string | null
          project_id?: string | null
          start_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kanban_sprints_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: true
            referencedRelation: "kanban_boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kanban_sprints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kanban_sprints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
        ]
      }
      level_rewards_discord: {
        Row: {
          created_at: string | null
          guild_id: string | null
          id: number
          level: number
          reward_type: string | null
          reward_value: string | null
        }
        Insert: {
          created_at?: string | null
          guild_id?: string | null
          id?: number
          level: number
          reward_type?: string | null
          reward_value?: string | null
        }
        Update: {
          created_at?: string | null
          guild_id?: string | null
          id?: number
          level?: number
          reward_type?: string | null
          reward_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "level_rewards_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          id: string
          level: number
          max_points: number | null
          min_points: number
          skill_category_id: string | null
        }
        Insert: {
          id?: string
          level: number
          max_points?: number | null
          min_points: number
          skill_category_id?: string | null
        }
        Update: {
          id?: string
          level?: number
          max_points?: number | null
          min_points?: number
          skill_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "levels_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_category"
            referencedColumns: ["id"]
          },
        ]
      }
      levelup_messages_discord: {
        Row: {
          channel_id: string | null
          created_at: string | null
          guild_id: string | null
          id: number
          is_enabled: boolean | null
          message_template: string
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          guild_id?: string | null
          id?: number
          is_enabled?: boolean | null
          message_template: string
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          guild_id?: string | null
          id?: number
          is_enabled?: boolean | null
          message_template?: string
        }
        Relationships: [
          {
            foreignKeyName: "levelup_messages_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: true
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      member_checklists: {
        Row: {
          completed: boolean
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          member_id: string
          priority: string
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          member_id: string
          priority?: string
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          member_id?: string
          priority?: string
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "member_checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "member_checklists_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_checklists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
        ]
      }
      member_ratings: {
        Row: {
          accountability: number | null
          created_at: string
          feedback: string | null
          id: string
          initiative: number | null
          member_id: string
          project_id: string
          punctuality: number | null
          rated_by: string
          reliability: number | null
          responsiveness: number | null
          updated_at: string
        }
        Insert: {
          accountability?: number | null
          created_at?: string
          feedback?: string | null
          id?: string
          initiative?: number | null
          member_id: string
          project_id: string
          punctuality?: number | null
          rated_by: string
          reliability?: number | null
          responsiveness?: number | null
          updated_at?: string
        }
        Update: {
          accountability?: number | null
          created_at?: string
          feedback?: string | null
          id?: string
          initiative?: number | null
          member_id?: string
          project_id?: string
          punctuality?: number | null
          rated_by?: string
          reliability?: number | null
          responsiveness?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_ratings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "member_ratings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "member_ratings_rated_by_fkey"
            columns: ["rated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_rated_by_fkey"
            columns: ["rated_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_rated_by_fkey"
            columns: ["rated_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "member_ratings_rated_by_fkey"
            columns: ["rated_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_ratings_rated_by_fkey"
            columns: ["rated_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nda_requests: {
        Row: {
          codev_id: string
          completed_at: string | null
          created_at: string | null
          expires_at: string
          id: string
          status: string
          token: string
        }
        Insert: {
          codev_id: string
          completed_at?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          status?: string
          token: string
        }
        Update: {
          codev_id?: string
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "nda_requests_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nda_requests_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nda_requests_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "nda_requests_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nda_requests_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_banners: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          message: string
          priority: number | null
          start_date: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          message: string
          priority?: number | null
          start_date?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          message?: string
          priority?: number | null
          start_date?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "news_banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_digest: boolean | null
          email_digest_frequency: string | null
          email_enabled: boolean | null
          in_app_enabled: boolean | null
          push_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          type_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_digest?: boolean | null
          email_digest_frequency?: string | null
          email_enabled?: boolean | null
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          type_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_digest?: boolean | null
          email_digest_frequency?: string | null
          email_enabled?: boolean | null
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          type_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          attempts: number | null
          body: string | null
          channel: string
          created_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          notification_id: string | null
          recipient_email: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          attempts?: number | null
          body?: string | null
          channel: string
          created_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          notification_id?: string | null
          recipient_email?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          attempts?: number | null
          body?: string | null
          channel?: string
          created_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          notification_id?: string | null
          recipient_email?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          message_template: string
          name: string
          priority: string | null
          title_template: string
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          message_template: string
          name: string
          priority?: string | null
          title_template: string
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          message_template?: string
          name?: string
          priority?: string | null
          title_template?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          archived: boolean | null
          archived_at: string | null
          comment_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          job_id: string | null
          message: string
          metadata: Json | null
          post_id: string | null
          priority: string | null
          project_id: string | null
          read: boolean | null
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          archived?: boolean | null
          archived_at?: string | null
          comment_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          job_id?: string | null
          message: string
          metadata?: Json | null
          post_id?: string | null
          priority?: string | null
          project_id?: string | null
          read?: boolean | null
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          title: string
          type: string
        }
        Update: {
          action_url?: string | null
          archived?: boolean | null
          archived_at?: string | null
          comment_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          job_id?: string | null
          message?: string
          metadata?: Json | null
          post_id?: string | null
          priority?: string | null
          project_id?: string | null
          read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_videos: {
        Row: {
          applicant_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          total_duration: number | null
          updated_at: string | null
          video_number: number
          watched_duration: number | null
        }
        Insert: {
          applicant_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          total_duration?: number | null
          updated_at?: string | null
          video_number: number
          watched_duration?: number | null
        }
        Update: {
          applicant_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          total_duration?: number | null
          updated_at?: string | null
          video_number?: number
          watched_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_applicant"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicant"
            referencedColumns: ["id"]
          },
        ]
      }
      overflow_comments: {
        Row: {
          codev_id: string | null
          comment: string
          created_at: string
          id: number
          likes: number | null
          marked_as_solution: boolean | null
          post_id: number | null
          updated_at: string | null
        }
        Insert: {
          codev_id?: string | null
          comment: string
          created_at?: string
          id?: number
          likes?: number | null
          marked_as_solution?: boolean | null
          post_id?: number | null
          updated_at?: string | null
        }
        Update: {
          codev_id?: string | null
          comment?: string
          created_at?: string
          id?: number
          likes?: number | null
          marked_as_solution?: boolean | null
          post_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "overflow_comments_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_comments_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_comments_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "overflow_comments_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_comments_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "overflow_post"
            referencedColumns: ["id"]
          },
        ]
      }
      overflow_likes: {
        Row: {
          codev_id: string | null
          created_at: string
          id: number
          target_id: number | null
          target_type: string | null
          updated_at: string | null
        }
        Insert: {
          codev_id?: string | null
          created_at?: string
          id?: number
          target_id?: number | null
          target_type?: string | null
          updated_at?: string | null
        }
        Update: {
          codev_id?: string | null
          created_at?: string
          id?: number
          target_id?: number | null
          target_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "overflow_likes_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_likes_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_likes_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "overflow_likes_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_likes_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      overflow_post: {
        Row: {
          codev_id: string | null
          comments: number | null
          created_at: string
          fields: string | null
          id: number
          image_url: string | null
          likes: number | null
          question_details: string | null
          tags: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          codev_id?: string | null
          comments?: number | null
          created_at?: string
          fields?: string | null
          id?: number
          image_url?: string | null
          likes?: number | null
          question_details?: string | null
          tags?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          codev_id?: string | null
          comments?: number | null
          created_at?: string
          fields?: string | null
          id?: number
          image_url?: string | null
          likes?: number | null
          question_details?: string | null
          tags?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "overflow_post_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_post_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_post_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "overflow_post_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overflow_post_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      points_history: {
        Row: {
          awarded_at: string | null
          codev_id: string | null
          created_at: string | null
          id: string
          points: number
          skill_category_id: string | null
          task_id: string | null
          task_title: string | null
          type: string
        }
        Insert: {
          awarded_at?: string | null
          codev_id?: string | null
          created_at?: string | null
          id?: string
          points: number
          skill_category_id?: string | null
          task_id?: string | null
          task_title?: string | null
          type: string
        }
        Update: {
          awarded_at?: string | null
          codev_id?: string | null
          created_at?: string | null
          id?: string
          points?: number
          skill_category_id?: string | null
          task_id?: string | null
          task_title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "points_history_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_category"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          commenter_id: string | null
          content: string | null
          created_at: string
          id: string
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          commenter_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          commenter_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "post_comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_content_images: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          post_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          post_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          tag_id: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          tag_id?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "post_tags_lookup"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags_lookup: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      post_upvotes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          upvoter_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          upvoter_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          upvoter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_upvotes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_upvoter_id_fkey"
            columns: ["upvoter_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_upvoter_id_fkey"
            columns: ["upvoter_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_upvoter_id_fkey"
            columns: ["upvoter_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "post_upvotes_upvoter_id_fkey"
            columns: ["upvoter_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_upvoter_id_fkey"
            columns: ["upvoter_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_points: {
        Row: {
          category: string
          codev_id: string
          created_at: string
          description: string | null
          id: number
          is_one_time: boolean | null
          max_items: number | null
          max_points: number | null
          points: number
          points_per_item: number | null
          updated_at: string
        }
        Insert: {
          category: string
          codev_id: string
          created_at?: string
          description?: string | null
          id?: number
          is_one_time?: boolean | null
          max_items?: number | null
          max_points?: number | null
          points: number
          points_per_item?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          codev_id?: string
          created_at?: string
          description?: string | null
          id?: number
          is_one_time?: boolean | null
          max_items?: number | null
          max_points?: number | null
          points?: number
          points_per_item?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "profile_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_points_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_categories: {
        Row: {
          category_id: number
          created_at: string | null
          id: string
          project_id: string
        }
        Insert: {
          category_id: number
          created_at?: string | null
          id?: string
          project_id: string
        }
        Update: {
          category_id?: number
          created_at?: string | null
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "projects_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_members: {
        Row: {
          codev_id: string | null
          id: string
          joined_at: string | null
          project_id: string | null
          role: string
        }
        Insert: {
          codev_id?: string | null
          id?: string
          joined_at?: string | null
          project_id?: string | null
          role: string
        }
        Update: {
          codev_id?: string | null
          id?: string
          joined_at?: string | null
          project_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "project_members_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          figma_link: string | null
          gallery: Json | null
          github_link: string | null
          id: string
          kanban_display: boolean | null
          key_features: Json | null
          main_image: string | null
          meeting_link: string | null
          meeting_schedule: Json | null
          name: string
          project_code: string | null
          public_display: boolean | null
          secondary_image: string | null
          start_date: string | null
          status: string | null
          tagline: string | null
          team_lead: string | null
          team_members: Json | null
          tech_stack: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          figma_link?: string | null
          gallery?: Json | null
          github_link?: string | null
          id?: string
          kanban_display?: boolean | null
          key_features?: Json | null
          main_image?: string | null
          meeting_link?: string | null
          meeting_schedule?: Json | null
          name: string
          project_code?: string | null
          public_display?: boolean | null
          secondary_image?: string | null
          start_date?: string | null
          status?: string | null
          tagline?: string | null
          team_lead?: string | null
          team_members?: Json | null
          tech_stack?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          figma_link?: string | null
          gallery?: Json | null
          github_link?: string | null
          id?: string
          kanban_display?: boolean | null
          key_features?: Json | null
          main_image?: string | null
          meeting_link?: string | null
          meeting_schedule?: Json | null
          name?: string
          project_code?: string | null
          public_display?: boolean | null
          secondary_image?: string | null
          start_date?: string | null
          status?: string | null
          tagline?: string | null
          team_lead?: string | null
          team_members?: Json | null
          tech_stack?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_category: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          applicants: boolean | null
          clients: boolean | null
          created_at: string | null
          dashboard: boolean | null
          id: number
          inhouse: boolean | null
          interns: boolean | null
          kanban: boolean | null
          name: string
          orgchart: boolean | null
          overflow: boolean | null
          projects: boolean | null
          resume: boolean | null
          settings: boolean | null
          time_tracker: boolean | null
          updated_at: string | null
        }
        Insert: {
          applicants?: boolean | null
          clients?: boolean | null
          created_at?: string | null
          dashboard?: boolean | null
          id?: number
          inhouse?: boolean | null
          interns?: boolean | null
          kanban?: boolean | null
          name: string
          orgchart?: boolean | null
          overflow?: boolean | null
          projects?: boolean | null
          resume?: boolean | null
          settings?: boolean | null
          time_tracker?: boolean | null
          updated_at?: string | null
        }
        Update: {
          applicants?: boolean | null
          clients?: boolean | null
          created_at?: string | null
          dashboard?: boolean | null
          id?: number
          inhouse?: boolean | null
          interns?: boolean | null
          kanban?: boolean | null
          name?: string
          orgchart?: boolean | null
          overflow?: boolean | null
          projects?: boolean | null
          resume?: boolean | null
          settings?: boolean | null
          time_tracker?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings_discord: {
        Row: {
          cooldown_seconds: number | null
          created_at: string | null
          guild_id: string | null
          id: number
          level_up_channel_id: string | null
          prefix: string | null
          updated_at: string | null
          xp_per_message: number | null
        }
        Insert: {
          cooldown_seconds?: number | null
          created_at?: string | null
          guild_id?: string | null
          id?: number
          level_up_channel_id?: string | null
          prefix?: string | null
          updated_at?: string | null
          xp_per_message?: number | null
        }
        Update: {
          cooldown_seconds?: number | null
          created_at?: string | null
          guild_id?: string | null
          id?: number
          level_up_channel_id?: string | null
          prefix?: string | null
          updated_at?: string | null
          xp_per_message?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: true
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_category: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      social_points_categories: {
        Row: {
          id: number
          label: string
          points: number
        }
        Insert: {
          id: number
          label: string
          points?: number
        }
        Update: {
          id?: number
          label?: string
          points?: number
        }
        Relationships: []
      }
      survey_dismissals: {
        Row: {
          dismissed_at: string | null
          id: string
          survey_id: string
          user_id: string
        }
        Insert: {
          dismissed_at?: string | null
          id?: string
          survey_id: string
          user_id: string
        }
        Update: {
          dismissed_at?: string | null
          id?: string
          survey_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_dismissals_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_dismissals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_dismissals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_dismissals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "survey_dismissals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_dismissals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_questions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
          settings: Json | null
          survey_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          question_text: string
          question_type: string
          settings?: Json | null
          survey_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
          settings?: Json | null
          survey_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          answers: Json
          created_at: string | null
          id: string
          ip_address: unknown
          respondent_email: string | null
          respondent_id: string | null
          started_at: string | null
          status: string | null
          submitted_at: string | null
          survey_id: string
          user_agent: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string | null
          id?: string
          ip_address?: unknown
          respondent_email?: string | null
          respondent_id?: string | null
          started_at?: string | null
          status?: string | null
          submitted_at?: string | null
          survey_id: string
          user_agent?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          id?: string
          ip_address?: unknown
          respondent_email?: string | null
          respondent_id?: string | null
          started_at?: string | null
          status?: string | null
          submitted_at?: string | null
          survey_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "survey_responses_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_external: boolean | null
          priority: number | null
          start_date: string | null
          survey_url: string | null
          target_audience: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_external?: boolean | null
          priority?: number | null
          start_date?: string | null
          survey_url?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_external?: boolean | null
          priority?: number | null
          start_date?: string | null
          survey_url?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_drafts: {
        Row: {
          codev_id: string | null
          created_at: string | null
          created_by: string
          deadline: string | null
          description: string | null
          difficulty: string | null
          id: string
          intended_column_id: string
          last_saved_at: string | null
          points: number | null
          pr_link: string | null
          priority: string | null
          project_id: string
          sidekick_ids: string[] | null
          skill_category_id: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          codev_id?: string | null
          created_at?: string | null
          created_by: string
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          intended_column_id: string
          last_saved_at?: string | null
          points?: number | null
          pr_link?: string | null
          priority?: string | null
          project_id: string
          sidekick_ids?: string[] | null
          skill_category_id?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          codev_id?: string | null
          created_at?: string | null
          created_by?: string
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          intended_column_id?: string
          last_saved_at?: string | null
          points?: number | null
          pr_link?: string | null
          priority?: string | null
          project_id?: string
          sidekick_ids?: string[] | null
          skill_category_id?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_drafts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "task_drafts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "task_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_intended_column_id_fkey"
            columns: ["intended_column_id"]
            isOneToOne: false
            referencedRelation: "kanban_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_drafts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "task_drafts_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_category"
            referencedColumns: ["id"]
          },
        ]
      }
      task_ticket_codes: {
        Row: {
          created_at: string
          id: string
          task_id: string | null
          ticket_code: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          task_id?: string | null
          ticket_code?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          task_id?: string | null
          ticket_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_ticket_number_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          approved_at: string | null
          codev_id: string | null
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string | null
          difficulty: string | null
          due_date: string | null
          id: string
          is_archive: boolean
          kanban_column_id: string | null
          points: number | null
          position: number
          pr_link: string | null
          priority: string | null
          sidekick_ids: string[] | null
          skill_category_id: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          codev_id?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          id?: string
          is_archive?: boolean
          kanban_column_id?: string | null
          points?: number | null
          position?: number
          pr_link?: string | null
          priority?: string | null
          sidekick_ids?: string[] | null
          skill_category_id?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          codev_id?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          id?: string
          is_archive?: boolean
          kanban_column_id?: string | null
          points?: number | null
          position?: number
          pr_link?: string | null
          priority?: string | null
          sidekick_ids?: string[] | null
          skill_category_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "tasks_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_kanban_column_id_fkey"
            columns: ["kanban_column_id"]
            isOneToOne: false
            referencedRelation: "kanban_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_category"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_comments: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: number
          parent_comment_id: number | null
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          parent_comment_id?: number | null
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          parent_comment_id?: number | null
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "tasks_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "tasks_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_support: {
        Row: {
          assigned_team: string | null
          assigned_to: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_archived: boolean | null
          message: string
          other_type: string | null
          priority: string
          project_id: string | null
          role_position: string | null
          status: string
          subject: string | null
          ticket_number: string
          ticket_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_team?: string | null
          assigned_to?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_archived?: boolean | null
          message: string
          other_type?: string | null
          priority?: string
          project_id?: string | null
          role_position?: string | null
          status?: string
          subject?: string | null
          ticket_number: string
          ticket_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_team?: string | null
          assigned_to?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_archived?: boolean | null
          message?: string
          other_type?: string | null
          priority?: string
          project_id?: string | null
          role_position?: string | null
          status?: string
          subject?: string | null
          ticket_number?: string
          ticket_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_support_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "ticket_support_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_categories"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ticket_support_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "ticket_support_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_support_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges_discord: {
        Row: {
          awarded_at: string | null
          badge_id: number | null
          id: number
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_id?: number | null
          id?: number
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_id?: number | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_discord_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards_discord: {
        Row: {
          granted_at: string | null
          guild_id: string
          id: number
          level_earned: number
          reward_id: number
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          guild_id: string
          id?: number
          level_earned: number
          reward_id: number
          user_id: string
        }
        Update: {
          granted_at?: string | null
          guild_id?: string
          id?: number
          level_earned?: number
          reward_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_discord_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "level_rewards_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats_discord: {
        Row: {
          active: boolean | null
          guild_id: string | null
          id: number
          last_message_at: string | null
          level: number | null
          total_messages: number | null
          updated_at: string | null
          user_id: string | null
          xp: number | null
        }
        Insert: {
          active?: boolean | null
          guild_id?: string | null
          id?: number
          last_message_at?: string | null
          level?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp?: number | null
        }
        Update: {
          active?: boolean | null
          guild_id?: string | null
          id?: number
          last_message_at?: string | null
          level?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stats_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      users_discord: {
        Row: {
          active: boolean | null
          avatar_url: string | null
          created_at: string | null
          discriminator: string | null
          display_name: string | null
          id: string
          joined_at: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          active?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          discriminator?: string | null
          display_name?: string | null
          id: string
          joined_at?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          active?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          discriminator?: string | null
          display_name?: string | null
          id?: string
          joined_at?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          codev_id: string
          company_name: string
          date_from: string
          date_to: string | null
          description: string | null
          id: string
          is_present: boolean
          location: string
          position: string
          profile_id: string | null
        }
        Insert: {
          codev_id: string
          company_name?: string
          date_from: string
          date_to?: string | null
          description?: string | null
          id?: string
          is_present?: boolean
          location?: string
          position: string
          profile_id?: string | null
        }
        Update: {
          codev_id?: string
          company_name?: string
          date_from?: string
          date_to?: string | null
          description?: string | null
          id?: string
          is_present?: boolean
          location?: string
          position?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "fk_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_codev"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedules: {
        Row: {
          codev_id: string | null
          created_at: string | null
          days_of_week: string[]
          end_time: string
          id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          codev_id?: string | null
          created_at?: string | null
          days_of_week: string[]
          end_time: string
          id?: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          codev_id?: string | null
          created_at?: string | null
          days_of_week?: string[]
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_schedules_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_schedules_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_schedules_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "codev_total_points"
            referencedColumns: ["codev_id"]
          },
          {
            foreignKeyName: "work_schedules_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "mentor_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_schedules_codev_id_fkey"
            columns: ["codev_id"]
            isOneToOne: false
            referencedRelation: "public_codev_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_config_discord: {
        Row: {
          active: boolean | null
          cooldown: number | null
          created_at: string | null
          guild_id: string
          id: number
          levelup_channel: string | null
          levelup_message: string | null
          max_xp: number | null
          min_xp: number | null
          notify_on_xp_gain: boolean | null
          reward_notification_channel: string | null
          reward_notification_message: string | null
          xp_gain_channel: string | null
          xp_gain_message: string | null
        }
        Insert: {
          active?: boolean | null
          cooldown?: number | null
          created_at?: string | null
          guild_id: string
          id?: number
          levelup_channel?: string | null
          levelup_message?: string | null
          max_xp?: number | null
          min_xp?: number | null
          notify_on_xp_gain?: boolean | null
          reward_notification_channel?: string | null
          reward_notification_message?: string | null
          xp_gain_channel?: string | null
          xp_gain_message?: string | null
        }
        Update: {
          active?: boolean | null
          cooldown?: number | null
          created_at?: string | null
          guild_id?: string
          id?: number
          levelup_channel?: string | null
          levelup_message?: string | null
          max_xp?: number | null
          min_xp?: number | null
          notify_on_xp_gain?: boolean | null
          reward_notification_channel?: string | null
          reward_notification_message?: string | null
          xp_gain_channel?: string | null
          xp_gain_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_config_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: true
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_logs_discord: {
        Row: {
          created_at: string | null
          guild_id: string | null
          id: number
          message_id: number | null
          reason: string | null
          user_id: string | null
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          guild_id?: string | null
          id?: number
          message_id?: number | null
          reason?: string | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          guild_id?: string | null
          id?: number
          message_id?: number | null
          reason?: string | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_logs_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_logs_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_users: {
        Row: {
          email_address: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          role_id: number | null
        }
        Insert: {
          email_address?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          role_id?: number | null
        }
        Update: {
          email_address?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_codev_roles"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      codev_total_points: {
        Row: {
          attendance_points: number | null
          codev_id: string | null
          first_name: string | null
          last_name: string | null
          skill_points: number | null
          total_points: number | null
        }
        Relationships: []
      }
      guild_leaderboard_discord: {
        Row: {
          display_name: string | null
          guild_id: string | null
          last_message_at: string | null
          level: number | null
          rank: number | null
          total_messages: number | null
          user_id: string | null
          username: string | null
          xp: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stats_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_discord_view: {
        Row: {
          avatar_url: string | null
          guild_id: string | null
          guild_name: string | null
          level: number | null
          rank: number | null
          total_messages: number | null
          user_id: string | null
          username: string | null
          xp: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stats_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_users: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
      projects_with_categories: {
        Row: {
          categories: Json[] | null
          created_at: string | null
          end_date: string | null
          figma_link: string | null
          github_link: string | null
          kanban_display: boolean | null
          main_image: string | null
          project_description: string | null
          project_id: string | null
          project_name: string | null
          public_display: boolean | null
          start_date: string | null
          status: string | null
          tech_stack: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Relationships: []
      }
      public_codev_profiles: {
        Row: {
          about: string | null
          display_position: string | null
          first_name: string | null
          github: string | null
          id: string | null
          image_url: string | null
          last_name: string | null
          linkedin: string | null
          portfolio_website: string | null
          positions: string[] | null
          tech_stacks: string[] | null
          years_of_experience: number | null
        }
        Insert: {
          about?: string | null
          display_position?: string | null
          first_name?: string | null
          github?: string | null
          id?: string | null
          image_url?: string | null
          last_name?: string | null
          linkedin?: string | null
          portfolio_website?: string | null
          positions?: string[] | null
          tech_stacks?: string[] | null
          years_of_experience?: number | null
        }
        Update: {
          about?: string | null
          display_position?: string | null
          first_name?: string | null
          github?: string | null
          id?: string | null
          image_url?: string | null
          last_name?: string | null
          linkedin?: string | null
          portfolio_website?: string | null
          positions?: string[] | null
          tech_stacks?: string[] | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      user_rewards_summary_discord: {
        Row: {
          guild_id: string | null
          reward_levels: number[] | null
          reward_values: string[] | null
          total_rewards: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_discord_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds_discord"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_discord_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_discord"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      broadcast_announcement_notification: {
        Args: {
          p_action_url?: string
          p_message: string
          p_sender_id: string
          p_title: string
        }
        Returns: undefined
      }
      calculate_member_rating_score: {
        Args: { member_uuid: string }
        Returns: number
      }
      calculate_overflow_social_points: {
        Args: { user_codev_id: string }
        Returns: number
      }
      calculate_social_points: { Args: { codev_id: string }; Returns: number }
      cleanup_old_notifications: { Args: never; Returns: number }
      complete_task: {
        Args: {
          p_skill_category_id: string
          primary_codev_id: string
          sidekick_ids: string[]
          task_id: string
          task_points: number
        }
        Returns: Json
      }
      complete_task_transaction: {
        Args: {
          p_primary_assignee_id: string
          p_sidekick_ids: string[]
          p_skill_category_id: string
          p_task_id: string
          p_task_points: number
        }
        Returns: undefined
      }
      create_notification: {
        Args: {
          p_action_url?: string
          p_job_id?: string
          p_message: string
          p_metadata?: Json
          p_priority?: string
          p_project_id?: string
          p_recipient_id: string
          p_sender_id?: string
          p_title: string
          p_type: string
        }
        Returns: string
      }
      decrement_comment_likes: {
        Args: { comment_id: number }
        Returns: undefined
      }
      decrement_post_likes: { Args: { post_id: number }; Returns: undefined }
      get_project_leaderboard: {
        Args: { result_limit?: number; time_filter?: string }
        Returns: {
          member_count: number
          project_id: string
          project_name: string
          skill_breakdown: Json
          total_points: number
        }[]
      }
      get_question_response_summary: {
        Args: { p_question_id: string; p_survey_id: string }
        Returns: {
          option_value: string
          response_count: number
        }[]
      }
      get_soft_skills_leaderboard: {
        Args: { result_limit?: number }
        Returns: {
          attendance_points: number
          codev_id: string
          first_name: string
          profile_points: number
          total_points: number
        }[]
      }
      get_survey_statistics: {
        Args: { p_survey_id: string }
        Returns: {
          completed_responses: number
          draft_responses: number
          last_response_at: string
          total_responses: number
          unique_respondents: number
        }[]
      }
      get_technical_leaderboard: {
        Args: {
          category_name: string
          result_limit?: number
          time_filter?: string
        }
        Returns: {
          codev_id: string
          first_name: string
          latest_update: string
          total_points: number
        }[]
      }
      get_week_start: { Args: { input_date: string }; Returns: string }
      increase_reminded_count: {
        Args: { applicant_ids: string[] }
        Returns: {
          id: string
          reminded_count: number
        }[]
      }
      increment_comment_likes: {
        Args: { comment_id: number }
        Returns: undefined
      }
      increment_post_likes: { Args: { post_id: number }; Returns: undefined }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      is_team_lead_of_project: {
        Args: { project_id_param: string; user_id?: string }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: { p_user_id: string }
        Returns: number
      }
      mark_notification_read: {
        Args: { p_notification_id: string; p_user_id: string }
        Returns: boolean
      }
      recompute_codev_landing_rank_score: {
        Args: { p_codev_id: string }
        Returns: undefined
      }
      toggle_overflow_comment_like: {
        Args: { comment_id_param: string }
        Returns: boolean
      }
      toggle_overflow_post_like: {
        Args: { post_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      test_status_enum: "pending" | "passed" | "failed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      test_status_enum: ["pending", "passed", "failed"],
    },
  },
} as const
