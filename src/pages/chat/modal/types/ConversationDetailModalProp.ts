import { Conversation } from "../../../../services/conversation/types/conversation.dto";

export interface ConversationDetailsModalProp {
  visible: boolean;
  onClose: () => void;
  conversation: Conversation;
  directConversationName?: string;
}
