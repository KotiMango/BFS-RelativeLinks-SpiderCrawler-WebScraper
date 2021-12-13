import axios from 'axios';
export const postInfoToServer = (bodyObj, jsonState) => {
  axios
    .post('http://localhost:2556/api/spider/', bodyObj)
    .then((res) => {
      jsonState(res.data);
    });
};
