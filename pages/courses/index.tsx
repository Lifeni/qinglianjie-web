import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Fade,
  Grid,
  GridItem,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import CourseListFilter from '../../components/app/course/list/Filter'
import CourseListItem from '../../components/app/course/list/Item'
import CoursePaginator from '../../components/app/course/Paginator'
import GroupContainer from '../../components/common/container/Group'
import ListContainer from '../../components/common/container/List'
import MainContainer from '../../components/common/container/Main'
import useCourseList from '../../hooks/useCourseList'

const CoursesPage = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<CourseFilter>({})
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (router.isReady) {
      setQuery(window.location.search.slice(1))
      setCurrentPage(Number(router.query.page) || 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const { courseList, isLoading, isError } = useCourseList(query)

  const handleRouter = (page?: number, query?: CourseFilter) => {
    if (page) {
      setCurrentPage(page)
    }

    if (query) {
      setFilter(query)
    }

    const search = new URLSearchParams()
    for (const [key, value] of Object.entries({
      ...(query || filter),
      page: page ? page.toString() : router.query.page?.toString() || '1',
    })) {
      if (key === 'page' && value === '1') continue
      search.set(key, value)
    }
    setQuery(search.toString())

    if (search.toString() === '') {
      router.push(`/courses`, undefined, { shallow: true })
    } else {
      router.push(`/courses?${search.toString()}`, undefined, {
        shallow: true,
      })
    }
  }

  const handleFilter = (query: CourseFilter, resetPage: boolean) => {
    if (resetPage) {
      handleRouter(1, query)
    } else {
      handleRouter(undefined, query)
    }
  }

  return (
    <>
      <Head>
        <title>课程 - 清廉街</title>
      </Head>
      <MainContainer gray title="课程">
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(16, 1fr)' }}
          gap={{ base: 8, md: 12 }}
          w="full"
          h="full"
        >
          <GridItem
            colSpan={{ base: 2, md: 10, lg: 12 }}
            maxW="full"
            h="full"
            minW="0"
          >
            <GroupContainer>
              {isError ? (
                <Alert status="error" rounded="md">
                  <AlertIcon />
                  获取数据失败，请稍后再试
                </Alert>
              ) : (
                <VStack align="start" spacing="4" w="full">
                  <Box
                    bg="white"
                    _dark={{
                      bg: 'gray.800',
                    }}
                    borderWidth="1px"
                    rounded="md"
                    w="full"
                    overflow="hidden"
                  >
                    <Fade in>
                      <ListContainer spacing="0" divider>
                        {!isLoading ? (
                          courseList?.count !== 0 ? (
                            courseList?.results.map((course, index) => (
                              <CourseListItem key={index} course={course} />
                            ))
                          ) : (
                            <Text w="full" px="6" py="4">
                              搜索无结果，试试其他关键词吧
                            </Text>
                          )
                        ) : (
                          <Center w="full" h="50vh">
                            <Spinner
                              thickness="4px"
                              color="pink.400"
                              size="xl"
                            />
                          </Center>
                        )}
                      </ListContainer>
                    </Fade>
                  </Box>

                  {!isLoading && !!courseList?.count && (
                    <CoursePaginator
                      currentPage={currentPage}
                      totalPage={
                        courseList
                          ? Math.floor(courseList.count / 10) + 1
                          : 1000
                      }
                      onPageChange={handleRouter}
                    />
                  )}
                </VStack>
              )}
            </GroupContainer>
          </GridItem>

          <GridItem
            colSpan={{ base: 2, md: 6, lg: 4 }}
            h="full"
            minW="0"
            rowStart={{ base: 1, md: 'auto' }}
          >
            <GroupContainer title="课程搜索" icon={RiSearchLine}>
              <CourseListFilter action={handleFilter} />
            </GroupContainer>
          </GridItem>
        </Grid>
      </MainContainer>
    </>
  )
}

export default CoursesPage
