import {
  Drawer as CharkraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { RiMenuLine } from 'react-icons/ri'
import SwitchTheme from '~/libs/common/SwitchTheme'

const Drawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <IconButton
        aria-label="菜单图标"
        icon={<Icon as={RiMenuLine} fontSize="xl" />}
        onClick={onOpen}
        d={{ base: 'flex', md: 'none' }}
        rounded="full"
        w="12"
        h="12"
        bg="gray.200"
        color="gray.500"
        _dark={{
          bg: 'gray.700',
          color: 'gray.400',
        }}
      />
      <CharkraDrawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            top="5"
            right="7"
            rounded="full"
            w="12"
            h="12"
            bg="gray.200"
            color="gray.500"
            _dark={{
              bg: 'gray.700',
              color: 'gray.400',
            }}
          />
          <DrawerHeader
            p="8"
            fontSize="lg"
            bg="gray.100"
            _dark={{ bg: 'gray.800' }}
          >
            清廉街
          </DrawerHeader>
          <DrawerBody p="8">world</DrawerBody>
          <DrawerFooter px="8" py="4" bg="gray.100" _dark={{ bg: 'gray.800' }}>
            <HStack w="full">
              <Text
                fontSize="sm"
                color="gray.500"
                _dark={{
                  color: 'gray.400',
                }}
              >
                点击按钮，切换颜色模式
              </Text>
              <Spacer />
              <SwitchTheme />
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </CharkraDrawer>
    </>
  )
}

export default Drawer