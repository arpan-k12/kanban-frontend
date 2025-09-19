export type Permission = "can_create" | "can_edit" | "can_view";

export interface PermissionsType {
  byFeature: {
    [feature: string]: Permission[];
  };
  flat: Permission[];
}
