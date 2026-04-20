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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      aga_detectors: {
        Row: {
          abb_tagname: string | null
          accuracy: string | null
          area: string | null
          calibration_date: string | null
          calibration_due_date: string | null
          calibration_gas: string | null
          created_at: string
          description: string | null
          field_status: string | null
          id: string
          iq_reprogrammed: string | null
          location: string | null
          media: string | null
          nne_remarks: string | null
          o_adjust: string | null
          range_max: number | null
          range_min: number | null
          recipe: string | null
          remarks: string | null
          rgu: string | null
          sensor_change: string | null
          serial_no_detector: string | null
          serial_no_sensor: string | null
          span_adjust: string | null
          span_gas_cert: string | null
          system_status: string | null
          tag: string | null
          trip_point_h: string | null
          trip_point_hh: string | null
          unit: string | null
          unit_serial: string | null
          updated_at: string
          user_id: string | null
          zero_gas_cert: string | null
        }
        Insert: {
          abb_tagname?: string | null
          accuracy?: string | null
          area?: string | null
          calibration_date?: string | null
          calibration_due_date?: string | null
          calibration_gas?: string | null
          created_at?: string
          description?: string | null
          field_status?: string | null
          id?: string
          iq_reprogrammed?: string | null
          location?: string | null
          media?: string | null
          nne_remarks?: string | null
          o_adjust?: string | null
          range_max?: number | null
          range_min?: number | null
          recipe?: string | null
          remarks?: string | null
          rgu?: string | null
          sensor_change?: string | null
          serial_no_detector?: string | null
          serial_no_sensor?: string | null
          span_adjust?: string | null
          span_gas_cert?: string | null
          system_status?: string | null
          tag?: string | null
          trip_point_h?: string | null
          trip_point_hh?: string | null
          unit?: string | null
          unit_serial?: string | null
          updated_at?: string
          user_id?: string | null
          zero_gas_cert?: string | null
        }
        Update: {
          abb_tagname?: string | null
          accuracy?: string | null
          area?: string | null
          calibration_date?: string | null
          calibration_due_date?: string | null
          calibration_gas?: string | null
          created_at?: string
          description?: string | null
          field_status?: string | null
          id?: string
          iq_reprogrammed?: string | null
          location?: string | null
          media?: string | null
          nne_remarks?: string | null
          o_adjust?: string | null
          range_max?: number | null
          range_min?: number | null
          recipe?: string | null
          remarks?: string | null
          rgu?: string | null
          sensor_change?: string | null
          serial_no_detector?: string | null
          serial_no_sensor?: string | null
          span_adjust?: string | null
          span_gas_cert?: string | null
          system_status?: string | null
          tag?: string | null
          trip_point_h?: string | null
          trip_point_hh?: string | null
          unit?: string | null
          unit_serial?: string | null
          updated_at?: string
          user_id?: string | null
          zero_gas_cert?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sensor_changes: {
        Row: {
          change_date: string
          comment: string | null
          created_at: string
          detector_id: string
          id: string
          new_serial_no_sensor: string
          old_serial_no_sensor: string | null
          user_id: string | null
        }
        Insert: {
          change_date?: string
          comment?: string | null
          created_at?: string
          detector_id: string
          id?: string
          new_serial_no_sensor: string
          old_serial_no_sensor?: string | null
          user_id?: string | null
        }
        Update: {
          change_date?: string
          comment?: string | null
          created_at?: string
          detector_id?: string
          id?: string
          new_serial_no_sensor?: string
          old_serial_no_sensor?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_changes_detector_id_fkey"
            columns: ["detector_id"]
            isOneToOne: false
            referencedRelation: "aga_detectors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_logs: {
        Row: {
          created_at: string
          detector_id: string
          id: string
          new_calibration_date: string | null
          problem_description: string | null
          service_date: string
          span_gas_cert: string | null
          user_id: string | null
          work_performed: string | null
          zero_gas_cert: string | null
        }
        Insert: {
          created_at?: string
          detector_id: string
          id?: string
          new_calibration_date?: string | null
          problem_description?: string | null
          service_date?: string
          span_gas_cert?: string | null
          user_id?: string | null
          work_performed?: string | null
          zero_gas_cert?: string | null
        }
        Update: {
          created_at?: string
          detector_id?: string
          id?: string
          new_calibration_date?: string | null
          problem_description?: string | null
          service_date?: string
          span_gas_cert?: string | null
          user_id?: string | null
          work_performed?: string | null
          zero_gas_cert?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_logs_detector_id_fkey"
            columns: ["detector_id"]
            isOneToOne: false
            referencedRelation: "aga_detectors"
            referencedColumns: ["id"]
          },
        ]
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
