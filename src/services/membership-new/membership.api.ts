import { notification } from "antd";
import { UpdateMembershipDto } from "./membership.type";
import Api from "../api";
import { HTTPMethod } from "../api/api.type";

const MODULE_NAME: string = "memberships";

async function updateMembershipStatus(
  membershipId: string,
  payload: UpdateMembershipDto
) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/${membershipId}`,
      method: HTTPMethod.PATCH,
      data: payload,
    });
    if (response.data) {
      notification.success({
        message: "Success",
        description: "Membership status updated successfully",
      });
      return response.data;
    }
    notification.error({
      message: "Error",
      description: "Unexpected error occurred",
    });
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error?.message,
    });
  }
}

async function deleteMembership(membershipId: string) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/${membershipId}`,
      method: HTTPMethod.DELETE,
    });
    if (response.data) {
      notification.success({
        message: "Success",
        description: "Membership deleted successfully",
      });
      return response.data;
    }
    notification.error({
      message: "Error",
      description: "Unexpected error occurred",
    });
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error?.message,
    });
  }
}

const MembershipApi = { updateMembershipStatus, deleteMembership };

export default MembershipApi;
