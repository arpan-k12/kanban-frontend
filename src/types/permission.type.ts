export type Permission = "can_create" | "can_edit" | "can_view";

export interface Permissions {
  byFeature: {
    [feature: string]: Permission[];
  };
  flat: Permission[];
}
