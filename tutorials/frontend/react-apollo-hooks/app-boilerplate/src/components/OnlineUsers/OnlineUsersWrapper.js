
import React, { useEffect, Fragment, useState } from "react";
import { useMutation, useSubscription, gql } from "@apollo/client";

import OnlineUser from "./OnlineUser";

const UPDATE_LAST_SEEN_MUTATION = gql`mutation updateLastSeen($now: timestamptz!) {
  update_users(where: {}, _set: { last_seen: $now }) {
    affected_rows
   }
 }`;

const OnlineUsersWrapper = () => {
  const [onlineIndicator, setOnlineIndicator] = useState(0);
  let onlineUsersList;
  useEffect(() => {

    updateLastSeen();
    setOnlineIndicator(setInterval(() => updateLastSeen(), 30000));
    return () => {
      clearInterval(onlineIndicator);
    }
  }, [])


 
  const [updateLastSeenMutation] = useMutation(UPDATE_LAST_SEEN_MUTATION);

  const updateLastSeen = () => {
  // Use the apollo client to run a mutation to update the last_seen value
  updateLastSeenMutation({
    variables: { now: new Date().toISOString() }
  });
};

const onlineUsersSubscription= gql `subscription getOnlineUsers {
  online_users(order_by: {user: {name: asc}}) {
    id
    user{
      name
    }
  }

}`

const { loading, error, data } = useSubscription(onlineUsersSubscription);

if (loading) {
    return<span>Loading...</span>;
}
if (error) {
  console.error(error);
  return <span>Error!</span>;
}
if (data) {
  onlineUsersList = data.online_users.map(u => {
    return <OnlineUser key={u.id} user={u.user} />
});
  
  }
return (
  <div className="onlineUsersWrapper">
       <Fragment>
        <div className="sliderHeader">
           Online users - {onlineUsersList.length}
        </div>
        {onlineUsersList}
      </Fragment>
    </div>
  );
}
  
export default OnlineUsersWrapper;
