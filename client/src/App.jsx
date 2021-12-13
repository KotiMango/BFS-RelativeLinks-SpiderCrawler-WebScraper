import './App.css';
import { FormControl, Input, Button } from '@mui/material';
import { useState } from 'react';
import { postInfoToServer } from './api.service';
import ReactJson from 'react-json-view';
function App() {
  const [linkState, setLinkState] = useState('');
  const [countState, setCountState] = useState(0);
  const [depthState, setDepthState] = useState(0);
  const [jsonState, setJsonState] = useState({
    queue: [''],
    msg: 'Relative links are fetched via the panel above',
  });
  const submitResults = () => {
    postInfoToServer(
      { url: linkState, max: countState, depth: depthState },
      setJsonState
    );
  };
  return (
    <div className='main-container'>
      <div className='form-container'>
        <FormControl>
          <Input
            id='url-input'
            className='user-input'
            placeholder='Web Address'
            type='url'
            onChange={(ev) => setLinkState(ev.target.value)}
          />
          <Input
            id='count-input'
            className='user-input'
            placeholder='Link Amount'
            type='number'
            onChange={(ev) => setCountState(ev.target.value)}
          />
          <Input
            id='count-input'
            className='user-input'
            placeholder='Depth'
            type='number'
            onChange={(ev) => setDepthState(ev.target.value)}
          />
          <Button
            variant='contained'
            className='submit-button'
            onClick={submitResults}
          >
            CRAWL
          </Button>
        </FormControl>
      </div>
      <h1 className='display-msg'>{jsonState.msg}</h1>
      <ReactJson
        src={jsonState.queue}
        style={{
          borderRadius: '25px',
          border: '1px solid black',
          padding: '1.5%',
          textAlign: 'center',
          marginTop: '5vh',
        }}
        theme='monokai'
      />
    </div>
  );
}

export default App;
