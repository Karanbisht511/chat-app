import axios from 'axios'
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const FriendList = () => {
  const [actives, setActives] = useState([])

  useEffect(() => {
    const username = sessionStorage.getItem('username')
    console.log('username:', username);

    if (username)
      getActiveUser(username);
  }, []);

  async function getActiveUser(username: string) {
    const token = sessionStorage.getItem("JWTToken");
    try {
      const res = await axios.get(`http://localhost:9000/api/friends/getFriend?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('username:', username);

      console.log("res:", res);

      setActives(res.data?.friendList);
    } catch (error) {
      console.log("error:", error);

    }
  }

  return (
    <div>
      <span>ActiveUser</span>
      <div> 
        {actives.length > 0 ? actives.map((e) => { return <Link to={`/message/${e}`} key={e} ><li>{e}</li></Link> }) : "No Active Friends"}
      </div>

    </div>
  )
}

export default FriendList