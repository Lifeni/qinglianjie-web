import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import 'cropperjs/dist/cropper.css'
import { ChangeEvent, useState } from 'react'
import Cropper from 'react-cropper'
import { RiRefreshLine } from 'react-icons/ri'
import { mutate } from 'swr'
import { BASE_API_URL } from '../../../../data/api-config'
import { toastConfig } from '../../../../utils/config/toast'
import { sizeFormatter } from '../../../../utils/formatter'
import ProfileAvatar from '../Avatar'

interface ProfileEditProps {
  profile: IProfile
}

type ImageInfo = { size: number; type: string }

const fileType = ['image/jpeg', 'image/png', 'image/webp']

const ProfileEditAvatar = ({ profile }: ProfileEditProps) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [image, setImage] = useState<string | ArrayBuffer | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo>({ size: 0, type: '' })
  const [cropper, setCropper] = useState<Cropper | null>(null)

  const handleFileChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]
      setImageInfo({ size: file.size, type: file.type })

      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const verifyFileSize = (size: number) => size <= 10 * 1024 * 1024
  const verifyFileType = (type: string) => fileType.includes(type)

  const baseURL = BASE_API_URL

  const handleAvatarUpload = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 512,
        maxHeight: 512,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        fillColor: '#ffffff',
      })

      canvas.toBlob(blob => {
        if (blob) {
          const formdata = new FormData()
          formdata.append(
            'image',
            blob,
            `user-avatar-${profile.pk}-${new Date().getTime()}.jpeg`
          )

          fetch(`${baseURL}/api/user/profile/photo`, {
            method: 'POST',
            body: formdata,
            mode: 'cors',
            credentials: 'include',
          })
            .then(async res => {
              if (res.ok) {
                toast({
                  title: '修改头像成功',
                  ...toastConfig.ok,
                })
                mutate(`${baseURL}/api/user`)
                mutate(`${baseURL}/api/profile/${profile.username}`)
                onClose()
                setImage(null)
                setCropper(null)
              } else {
                const data = await res.json()
                Object.values(data).forEach(d => {
                  toast({
                    title: '修改头像失败',
                    description: d as string,
                    ...toastConfig.error,
                  })
                })
              }
            })
            .catch((err: Error) => {
              console.log('Upload Avatar Error -', err)
              toast({
                title: '修改头像失败',
                description: err.toString(),
                ...toastConfig.error,
              })
            })
        }
      }, 'image/jpeg')
    }
  }

  return (
    <>
      <ProfileAvatar profile={profile} action={onOpen} />
      <Modal
        isCentered
        size="sm"
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setImage(null)
          setCropper(null)
        }}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt="5" pb="3">
            编辑头像
          </ModalHeader>
          <ModalCloseButton mx="2" my="0.5" top="4" right="4" />

          <ModalBody>
            <VStack align="start" spacing="3">
              <FormControl>
                <FormLabel d="flex" flexDir="column" mx="0">
                  {image ? (
                    <Button
                      as="span"
                      color="gray.500"
                      userSelect="none"
                      d="flex"
                      alignItems="center"
                      isFullWidth
                      cursor="pointer"
                    >
                      <Icon as={RiRefreshLine} w="5" h="5" me="3" />
                      重新选择图片
                    </Button>
                  ) : (
                    <Box
                      w="full"
                      rounded="md"
                      d="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth="1px"
                      cursor="pointer"
                      _hover={{
                        borderColor: 'blue.500',
                      }}
                      transition="all 0.2s"
                    >
                      <VStack px="8" py={image ? '3' : '8'} spacing="3">
                        <Text fontSize="lg" color="gray.500" userSelect="none">
                          点击此处上传图片
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          textAlign="center"
                          userSelect="none"
                        >
                          支持 JPG | PNG | WebP 格式，建议选择不超过 10MB
                          的图片，上传后图片会被压缩，上传不合适的图片会被删除账号。
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </FormLabel>

                <Input
                  type="file"
                  d="none"
                  name="image"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileChange}
                />
              </FormControl>

              {image && (
                <>
                  <Box w="full" cursor="pointer" rounded="md" overflow="hidden">
                    <Cropper
                      src={image as string}
                      initialAspectRatio={1}
                      aspectRatio={1}
                      guides={false}
                      onInitialized={instance => {
                        setCropper(instance)
                      }}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={false}
                      autoCropArea={1}
                      checkOrientation={false}
                    />
                  </Box>

                  <HStack spacing="6" pt="3">
                    <Stat>
                      <StatLabel>图片格式</StatLabel>
                      <StatNumber whiteSpace="nowrap">
                        {imageInfo.type}
                      </StatNumber>
                      {verifyFileType(imageInfo.type) ? (
                        <StatHelpText>图片格式符合要求</StatHelpText>
                      ) : (
                        <StatHelpText color="red.500" fontWeight="600">
                          图片格式不对
                        </StatHelpText>
                      )}
                    </Stat>
                    <Stat>
                      <StatLabel>图片大小</StatLabel>
                      <StatNumber whiteSpace="nowrap">
                        {sizeFormatter(imageInfo.size)}
                      </StatNumber>
                      {verifyFileSize(imageInfo.size) ? (
                        <StatHelpText>图片大小符合要求</StatHelpText>
                      ) : (
                        <StatHelpText color="red.500" fontWeight="600">
                          图片过大
                        </StatHelpText>
                      )}
                    </Stat>
                  </HStack>
                </>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter pt="2" pb="6">
            <Spacer />
            <Button
              onClick={() => {
                onClose()
                setImage(null)
                setCropper(null)
              }}
              mr={3}
            >
              取消
            </Button>
            <Button
              onClick={handleAvatarUpload}
              colorScheme="blue"
              disabled={!image || !verifyFileType(imageInfo.type)}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileEditAvatar
