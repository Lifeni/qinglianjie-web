import {
  AspectRatio,
  Avatar,
  Button,
  Heading,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { RiUserLine } from 'react-icons/ri'
import useUser from '../../../hooks/useUser'

interface MemberProfileProps {
  name: string | string[] | undefined
}

const MemberProfile = ({ name }: MemberProfileProps) => {
  const { user, isLoading, isError } = useUser()

  return (
    <>
      <AspectRatio ratio={1} maxW="65vw" mx="auto">
        <Avatar
          bg="gray.100"
          icon={<RiUserLine size="50%" />}
          size="full"
          mx="1"
          color="gray.400"
          _dark={{
            color: 'white',
            bg: 'gray.700',
          }}
        />
      </AspectRatio>

      <VStack py="8" spacing="2.5">
        <Skeleton isLoaded={!isLoading} px="4">
          <Heading size="lg" textAlign="center">
            {name}
          </Heading>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} px="4">
          <Text fontSize="lg" textAlign="center">
            {user?.email || '登录后查看邮箱'}
          </Text>
        </Skeleton>
      </VStack>

      {isLoading ? null : isError ? (
        <Button isFullWidth>这里也许有一个功能</Button>
      ) : (
        <Button isFullWidth>编辑资料（还没做）</Button>
      )}
    </>
  )
}

export default MemberProfile