import { Button, Input as ChakraInput, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { RiLockPasswordLine, RiMailLine } from 'react-icons/ri'
import {
  ActionFunction,
  Form,
  json,
  useActionData,
  useSearchParams,
  useTransition,
} from 'remix'
import { Input } from '~/components/common/Input'
import { IResponse, AuthType } from '~/types'
import { useNavToast } from '~/utils/hooks'
import { sleep } from '~/utils/system'

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData()
  const name = body.get('name')
  const password = body.get('password')
  const from = body.get('from') as string

  // TODO: 接入后端登录
  await sleep(1000)

  return json<IResponse<AuthType>>({
    status: '可以',
    type: '登录',
    message: '已登录到「清廉街」',
  })
}

export default function LoginPage() {
  const [params] = useSearchParams()
  const from = params.get('from') ?? '/'

  const action = useActionData<IResponse<AuthType>>()
  const transition = useTransition()

  const isLoading = transition.state === 'submitting'
  const redirectTo = action?.status === '可以' && '/'

  const toast = useNavToast<AuthType>()
  useEffect(() => action && toast({ to: redirectTo, ...action }), [action])

  return (
    <Form method="post">
      <VStack
        p={{ base: '6', sm: '8' }}
        w="full"
        spacing="4"
        align="flex-start"
      >
        <Input
          type="text"
          name="name"
          placeholder="用户名或邮箱"
          autoComplete="username"
          autoFocus
          icon={RiMailLine}
        />
        <Input
          type="password"
          name="password"
          placeholder="密码"
          autoComplete="current-password"
          icon={RiLockPasswordLine}
        />
        <ChakraInput type="hidden" name="from" value={from} />
        <Button
          isFullWidth
          isLoading={isLoading}
          variant="solid"
          type="submit"
          colorScheme="green"
        >
          登录
        </Button>
      </VStack>
    </Form>
  )
}