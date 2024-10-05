export interface UserInformationWithRelationship {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  relationship: {
    id: string;
    userA: string;
    userB: string;
    status: string;
  };
}
