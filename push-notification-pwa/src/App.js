import { useState } from 'react';
import {
  MainContainer,
  Button,
  Text
} from './styled-components'

const App = () => {

  const [message, setMessage] = useState('');

  const subscribe = async () => {
    const sw = await navigator.serviceWorker.ready;

    if(sw){
      const push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BB84ACPFhuejkiiIK22L9bdl7j5Cyi9ZyTnFZ-yHPBKs1pcvEEVfUIOQMO63Nj0Sirw9JF3wFbWreYUELfghH3U'
      })

      if(push){
        const res = await fetch('http://localhost:5000/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(push)
        })
        const data = await res.json();

        console.log(data)
        setMessage(data.message)
      }
    }else{
      alert('No ServiceWorker Available!')
    }
  }

  return (
    <MainContainer>
      <Button onClick={subscribe}>Subscribe to Push Notifications</Button>
      <Text>{message}</Text>
    </MainContainer>
  );
}

export default App;
