import Link from 'next/link'
import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'

import { Input } from '../../components/Form/Input'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { api } from '../../services/api';
import { queryClient } from '../../services/queryClient';
import { useRouter } from 'next/dist/client/router';

type CreateUserFormData = {
  name: string;
  email: string;
  password: string; 
  password_confirmation: string;
}

const CreateUserFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),   
  email: yup.string().required('E-mail is required').email('E-mail Invalid'),   
  password: yup.string().required('Passaword is required').min(6, 'No min 6 carecters'),
  password_confirmation: yup.string().oneOf([
    null, yup.ref('password')
  ], 'Password does not match')
})

export default function CreateUser(){
  const router = useRouter()
  const createUser = useMutation(async (user: CreateUserFormData) => {
    const response = await api.post('users', {
      user: {
        ...user,
        created_at: new Date(),
      }
    })

    return response.data.user
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const { register, handleSubmit, formState} = useForm({
    resolver: yupResolver(CreateUserFormSchema)
  })

  const { errors } = formState

const HandleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
  await createUser.mutateAsync(values)
  router.push('/users')
}

  return(
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box as="form" flex="1" borderRadius={8} bg="gray.800" p={["6","8"]} onSubmit={handleSubmit(HandleCreateUser)}>
          <Heading size="lg" fontWeight="normal">Create User</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6","8"]} w="100%">
              <Input name="name" label="Complete Name" type="text" error={errors.name} {...register('name')}/>
              <Input name="email" label="E-mail" type="email" error={errors.email} {...register('email')}/>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6","8"]} w="100%">
              <Input name="password" type="password" label="Password" error={errors.password} {...register('password')}/>
              <Input name="password_confirmation" label="Repeat Password" type="password" error={errors.password_confirmation} {...register('password_confirmation')}/>
            </SimpleGrid>
          </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/users" passHref>
                  <Button as="a" colorScheme="whiteAlpha"> Cancel </Button>
                </Link>
                <Button type="submit" colorScheme="pink" isLoading={formState.isSubmitting}> Save </Button>
              </HStack>
            </Flex>
        </Box>
      </Flex>
    </Box>
  )
}