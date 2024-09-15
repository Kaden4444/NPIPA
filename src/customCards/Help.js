import { Card, Inset, Flex} from "@radix-ui/themes";

function  Help(){
    return(
<Card
  size={3}
  variant='classic'
  content='center'
  style={{
    position: 'fixed',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    height: '75vh',
    width: '25vw', 
    overflowY: 'auto', 
    padding: '20px', 
    border: '1px solid #ccc',
    borderRadius: '8px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    backgroundColor: '#fff', 
  }}
>
  <Flex direction={"column"} gap={"2"}>
    <h1 style={{ margin: '0 0 20px 0', fontSize: '1.5em', color: '#333' }}>Welcome to NPIP!</h1>

    <Inset clip="border-box" side="top" pb="current">
      <img
        src="/imgs/Select.png"
        alt="Select"
        style={{
          display: 'block',
          objectFit: 'contain',
          width: '100%',
          height: 'auto', // maintain aspect ratio ?
          maxHeight: '150px', 
          marginBottom: '10px', 
          backgroundColor: 'var(--gray-5)',
        }}
      />
      <h2 style={{ margin: '0', fontSize: '1.2em', color: '#555' }}>Select your country on the map!</h2>
    </Inset>
    
    <Inset clip="padding-box" side="top" pb="current">
      <img
        src="/imgs/Country.png"
        alt="Filter"
        style={{
          display: 'block',
          objectFit: 'contain',
          width: '100%',
          height: 'auto',
          maxHeight: '150px',
          marginBottom: '10px',
          backgroundColor: 'var(--gray-5)',
        }}
      />
      <h2 style={{ margin: '0', fontSize: '1.2em', color: '#555' }}>See your selections on the right!</h2>
    </Inset>

    <Inset clip="padding-box" side="top" pb="current">
      <img
        src="/imgs/Chart.png"
        alt="Chart"
        style={{
          display: 'block',
          objectFit: 'contain',
          width: '100%',
          height: 'auto',
          maxHeight: '150px',
          marginBottom: '10px',
          backgroundColor: 'var(--gray-5)',
        }}
      />
      <h2 style={{ margin: '0', fontSize: '1.2em', color: '#555' }}>See their data on the left!</h2>
    </Inset>
  </Flex>
</Card>

        
    )
}

export default Help;