import { Flex, Text } from "@radix-ui/themes";
import { FaGlobeAfrica } from "react-icons/fa";

const Logo = () => {
    return(
        <Flex as="logo" align={'center'}>
        <FaGlobeAfrica style={{color : 'white', fontSize: '2rem' }} />
        <Text size="6" weight="bold" style={{ color: 'white', fontSize: '1.5rem' }}> NPIPA </Text>
        </Flex>
    );
    
  };

  export default Logo;