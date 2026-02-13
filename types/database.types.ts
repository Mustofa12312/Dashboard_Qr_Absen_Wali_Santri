export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            attendances: {
                Row: {
                    id: number
                    created_at: string
                    guardian_id: number
                    event_name: string
                    scanned_at: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    guardian_id: number
                    event_name: string
                    scanned_at?: string
                    method?: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    guardian_id?: number
                    event_name?: string
                    scanned_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "attendances_guardian_id_fkey"
                        columns: ["guardian_id"]
                        referencedRelation: "guardians"
                        referencedColumns: ["id_wali"]
                    }
                ]
            }
            guardians: {
                Row: {
                    id_wali: number
                    nama_wali: string
                    nama_murid: string
                    kelas_murid: string
                    alamat?: string
                    no_hp?: string
                }
                Insert: {
                    id_wali?: number
                    nama_wali: string
                    nama_murid: string
                    kelas_murid: string
                    alamat?: string
                    no_hp?: string
                }
                Update: {
                    id_wali?: number
                    nama_wali?: string
                    nama_murid?: string
                    kelas_murid?: string
                    alamat?: string
                    no_hp?: string
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
    }
}
