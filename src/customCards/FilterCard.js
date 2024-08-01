import { Box, Card, Button, Flex, TextField } from '@radix-ui/themes';
import { FaLock, FaUnlock} from 'react-icons/fa'; // Importing lock icons from react-icons
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

function ISPText() {
  return (
    <Box maxWidth="165px">
<TextField.Root placeholder="ISP…">
  <TextField.Slot>
    <MagnifyingGlassIcon height="16" width="16" />
  </TextField.Slot>
</TextField.Root>
</Box>
  );
}

export function FilterCard({ CountryName, isLocked, onToggleLock }) {
  return (
    <Box width="350px" maxWidth="400px" height="400">
      <Card size="3">
        <Box>
          <Flex gapX="4" align="center">
            <h1>{CountryName}:   </h1>
            <ISPText />
            <Box style={{position: "fixed", left: "300px"}}>
              <Button onClick={onToggleLock}>
                {isLocked ? <FaUnlock /> : <FaLock />}
              </Button>
            </Box>
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}
