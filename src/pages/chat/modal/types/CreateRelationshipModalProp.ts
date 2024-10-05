export interface CreateRelationshipModalProp {
  userA: string;
  visible: boolean;
  onClose: () => void;
  onCreateRelationship: (searchTerm: string) => void;
}
