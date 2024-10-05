export interface CreateRelationshipModalProp {
  accessToken: string;
  userA: string;
  visible: boolean;
  onClose: () => void;
  logoutAction: () => void;
}
