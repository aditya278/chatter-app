import { Box } from "@chakra-ui/layout";
import { IUser } from "../../Api/Models/User"
import { CloseIcon } from '@chakra-ui/icons';

interface IUserBadgeItemProps {
  user: IUser;
  handleFunction: () => void;
}

const UserBadgeItem = ({ user, handleFunction }: IUserBadgeItemProps) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      fontSize={12}
      background='purple'
      color='white'
      cursor={'pointer'}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  )
}

export default UserBadgeItem