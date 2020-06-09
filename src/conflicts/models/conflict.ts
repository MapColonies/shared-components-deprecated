export interface Conflict {
  id: string;

  source_server: string;

  target_server: string;

  source_entity: object;

  target_entity: object;

  description: string;

  location?: Location;

  has_resolved: boolean;

  resolved_at?: Date;

  resolution_id?: string;

  created_at: Date;

  updated_at: Date;

  deleted_at?: Date;
}