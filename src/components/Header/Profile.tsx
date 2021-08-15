import { Flex, Box, Text, Avatar} from '@chakra-ui/react'

interface ProfileProps {
  showProfileData: boolean;
} 

export function Profile( { showProfileData = true}: ProfileProps){
  return(
    <Flex
        align="center">
          { showProfileData && (
            <Box mr="4" textAlign="right">
            <Text>Felipe</Text>
            <Text color="gray.300" fontSize="small">
              Felipetiburcioviana@gmail.com
              </Text>
          </Box>
          )}
          
          <Avatar size="md" name="Felipe Viana" src="https://github.com/felipeact.png" />
        </Flex>
  );
}