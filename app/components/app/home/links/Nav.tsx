import type { SystemProps } from '@chakra-ui/react'
import { Flex, Icon, Link, Text } from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import { Link as RemixLink } from 'remix'
import { Card } from '~/components/common/containers/Card'
import { appLinks } from '~/contents/links/app-links'

interface NavLinksProps extends SystemProps {}

export const NavLinks = (props: NavLinksProps) => (
  <Card title="页面" {...props}>
    <Flex
      flexDir="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      w="full"
      pt="2"
      px="0"
      pb="4"
      gap="0"
    >
      {appLinks.map(link =>
        link.mobile ? null : <NavLink {...link} key={link.name} />
      )}
    </Flex>
  </Card>
)

interface NavLinkProps {
  href: string
  name: string
  icon: IconType
  color: string
}

const NavLink = ({ href, name, icon, color }: NavLinkProps) => (
  <Link
    as={RemixLink}
    to={href}
    key={name}
    d="flex"
    alignItems="center"
    flexDir="row"
    gap="4"
    w="full"
    px="6"
    pt="2"
    pb="2"
    rounded="none"
    _hover={{
      textDecor: 'none',
      bg: 'gray.200',
    }}
    _dark={{
      _hover: {
        bg: 'gray.700',
      },
    }}
  >
    <Icon as={icon} aria-label={name} color={`${color}.500`} fontSize="xl" />
    <Text>{name}</Text>
  </Link>
)