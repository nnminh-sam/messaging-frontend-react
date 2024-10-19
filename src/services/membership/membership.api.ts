import { notification } from "antd";
import {
  BanUserDto,
  ChangeHostDto,
  CreateMembershipDto,
} from "./membership.type";
import Api from "../api";
import { HTTPMethod, PaginationDto } from "../api/api.type";

const MODULE_NAME: string = "memberships";

async function createMembership(createMembershipDto: CreateMembershipDto) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}`,
      method: HTTPMethod.POST,
      data: createMembershipDto,
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

async function getMembershipById(membershipId: string) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/${membershipId}`,
      method: HTTPMethod.GET,
    });
    if (response.data) {
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

async function getParticipatedConversations(paginationDto: PaginationDto) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/participated-conversations`,
      method: HTTPMethod.GET,
      params: { ...paginationDto },
    });
    if (response.data) {
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

async function getConversationMembers(
  conversationId: string,
  paginationDto: PaginationDto
) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/conversation/${conversationId}`,
      method: HTTPMethod.GET,
      params: { ...paginationDto },
    });
    if (response.data) {
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

async function changeHost(changeHostDto: ChangeHostDto) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/change-host`,
      method: HTTPMethod.PATCH,
      data: changeHostDto,
    });
    if (response.data) {
      notification.success({
        message: "Success",
        description: "Host changed successfully",
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

async function banUser(banUserDto: BanUserDto) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/ban`,
      method: HTTPMethod.PATCH,
      data: banUserDto,
    });
    if (response.data) {
      notification.success({
        message: "Success",
        description: "User banned successfully",
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

async function unbanUser(banUserDto: BanUserDto) {
  try {
    const response = await Api({
      url: `${MODULE_NAME}/unban`,
      method: HTTPMethod.PATCH,
      data: banUserDto,
    });
    if (response.data) {
      notification.success({
        message: "Success",
        description: "User unbanned successfully",
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

const MembershipApi = {
  createMembership,
  getMembershipById,
  getParticipatedConversations,
  getConversationMembers,
  changeHost,
  banUser,
  unbanUser,
  deleteMembership,
};

export default MembershipApi;
